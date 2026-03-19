import { Router, type Request, type Response } from "express";
import pool from "../lib/db";

const router = Router();

// --- API Key Middleware ---
async function requireApiKey(req: Request, res: Response, next: Function) {
  const key = req.headers["x-api-key"] as string;
  if (!key) {
    res.status(401).json({ error: "Missing X-Api-Key header" });
    return;
  }
  const result = await pool.query(
    "SELECT id, scope FROM api_keys WHERE key_hash = $1 AND is_active = TRUE",
    [key]
  );
  if (result.rows.length === 0) {
    res.status(401).json({ error: "Invalid or inactive API key" });
    return;
  }
  await pool.query(
    "UPDATE api_keys SET last_used_at = NOW() WHERE key_hash = $1",
    [key]
  );
  (req as any).apiScope = result.rows[0].scope;
  next();
}

// --- SaaS Analytics (website events) ---
// POST /api/analytics/saas
// Used by website to track page views, sign-ups, subscriptions
router.post("/saas", async (req: Request, res: Response) => {
  try {
    const { event_type, page, user_id, email, plan, amount_cents, metadata } = req.body;
    if (!event_type) {
      res.status(400).json({ error: "event_type is required" });
      return;
    }
    await pool.query(
      `INSERT INTO saas_events (event_type, page, user_id, email, plan, amount_cents, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [event_type, page || null, user_id || null, email || null, plan || null, amount_cents || 0, JSON.stringify(metadata || {})]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("saas track error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- App Analytics (mobile app events) ---
// POST /api/analytics/app
// Used by mobile app developer — requires X-Api-Key header
router.post("/app", requireApiKey, async (req: Request, res: Response) => {
  try {
    const {
      event_type,
      user_id,
      trainer_id,
      workout_id,
      duration_seconds,
      calories,
      metadata,
      platform,
      app_version
    } = req.body;

    if (!event_type) {
      res.status(400).json({ error: "event_type is required" });
      return;
    }

    await pool.query(
      `INSERT INTO app_events 
       (event_type, user_id, trainer_id, workout_id, duration_seconds, calories, metadata, platform, app_version)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        event_type,
        user_id || null,
        trainer_id || null,
        workout_id || null,
        duration_seconds || 0,
        calories || 0,
        JSON.stringify(metadata || {}),
        platform || "unknown",
        app_version || null
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("app track error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Batch App Events ---
// POST /api/analytics/app/batch
// Track multiple events in one request (for offline sync)
router.post("/app/batch", requireApiKey, async (req: Request, res: Response) => {
  try {
    const { events } = req.body;
    if (!Array.isArray(events) || events.length === 0) {
      res.status(400).json({ error: "events array is required" });
      return;
    }
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const evt of events) {
        await client.query(
          `INSERT INTO app_events 
           (event_type, user_id, trainer_id, workout_id, duration_seconds, calories, metadata, platform, app_version)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            evt.event_type, evt.user_id || null, evt.trainer_id || null,
            evt.workout_id || null, evt.duration_seconds || 0, evt.calories || 0,
            JSON.stringify(evt.metadata || {}), evt.platform || "unknown", evt.app_version || null
          ]
        );
      }
      await client.query("COMMIT");
      res.json({ success: true, inserted: events.length });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("batch track error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
