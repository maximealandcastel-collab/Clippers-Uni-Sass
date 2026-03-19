import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../lib/db";
import { cache } from "../lib/cache";
import { getUncachableStripeClient } from "../stripeClient";

const router = Router();
const JWT_SECRET = process.env["JWT_SECRET"] || "cu_secret_2026_xK9mP";
const ADMIN_USER = "FounderP2";
const ADMIN_PASS = "What100%........";

function requireCreator(req: Request, res: Response, next: Function) {
  const auth = req.headers["authorization"];
  if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET) as any;
    if (!decoded.creatorId) { res.status(401).json({ error: "Not a creator token" }); return; }
    (req as any).creatorId = decoded.creatorId;
    next();
  } catch { res.status(401).json({ error: "Invalid or expired token" }); }
}

function requireAdmin(req: Request, res: Response, next: Function) {
  const auth = req.headers["authorization"];
  if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET) as any;
    if (!decoded.admin) { res.status(403).json({ error: "Admin only" }); return; }
    next();
  } catch { res.status(401).json({ error: "Invalid or expired token" }); }
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

// POST /api/cu/signup
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, full_name, phone, creator_type, tiktok_handle, instagram_handle, youtube_handle, snapchat_handle } = req.body;
    if (!email || !password || !full_name || !phone) {
      res.status(400).json({ error: "email, password, full_name, and phone are required" }); return;
    }
    const existing = await pool.query("SELECT id FROM cu_creators WHERE email = $1", [email.toLowerCase()]);
    if (existing.rows.length > 0) { res.status(409).json({ error: "Email already registered" }); return; }
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO cu_creators (email, password_hash, full_name, phone, creator_type, tiktok_handle, instagram_handle, youtube_handle, snapchat_handle)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, email, full_name, phone, creator_type, tiktok_handle, instagram_handle, youtube_handle, snapchat_handle,
                 stripe_onboarded, badge_status, tier, total_views, total_earnings_cents, created_at`,
      [email.toLowerCase(), passwordHash, full_name, phone, creator_type || "clipper",
       tiktok_handle || null, instagram_handle || null, youtube_handle || null, snapchat_handle || null]
    );
    const creator = result.rows[0];
    const token = jwt.sign({ creatorId: creator.id, email: creator.email }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, creator });
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/cu/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ error: "email and password required" }); return; }
    const result = await pool.query("SELECT * FROM cu_creators WHERE email = $1", [email.toLowerCase()]);
    if (result.rows.length === 0) { res.status(401).json({ error: "Invalid credentials" }); return; }
    const creator = result.rows[0];
    const valid = await bcrypt.compare(password, creator.password_hash);
    if (!valid) { res.status(401).json({ error: "Invalid credentials" }); return; }
    const token = jwt.sign({ creatorId: creator.id, email: creator.email }, JWT_SECRET, { expiresIn: "7d" });
    const { password_hash, ...safeCreator } = creator;
    res.json({ token, creator: safeCreator });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/cu/me
router.get("/me", requireCreator, async (req: Request, res: Response) => {
  try {
    const creatorId = (req as any).creatorId;
    const cacheKey = `me:${creatorId}`;
    const cached = cache.get(cacheKey);
    if (cached) { res.json(cached); return; }

    const result = await pool.query(
      `SELECT id, email, full_name, phone, creator_type, tiktok_handle, instagram_handle, youtube_handle, snapchat_handle,
              stripe_account_id, stripe_onboarded, badge_status, tier,
              total_views, tiktok_views, instagram_views, youtube_views, snapchat_views,
              total_earnings_cents, created_at
       FROM cu_creators WHERE id = $1`,
      [creatorId]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: "Creator not found" }); return; }
    const payload = { creator: result.rows[0] };
    cache.set(cacheKey, payload, 60);
    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Badge ─────────────────────────────────────────────────────────────────────

// POST /api/cu/badge/claim
router.post("/badge/claim", requireCreator, async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT badge_status FROM cu_creators WHERE id = $1", [(req as any).creatorId]);
    if (result.rows[0]?.badge_status !== "not_claimed") {
      res.status(409).json({ error: "Badge already claimed" }); return;
    }
    await pool.query("UPDATE cu_creators SET badge_status = 'claimed' WHERE id = $1", [(req as any).creatorId]);
    res.json({ success: true, badge_status: "claimed" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Campaign Applications ─────────────────────────────────────────────────────

// POST /api/cu/campaigns/:campaignId/apply
router.post("/campaigns/:campaignId/apply", requireCreator, async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;
    const { campaign_name } = req.body;
    const creatorId = (req as any).creatorId;
    const existing = await pool.query(
      "SELECT id, status FROM cu_campaign_applications WHERE creator_id=$1 AND campaign_id=$2",
      [creatorId, campaignId]
    );
    if (existing.rows.length > 0) {
      res.status(409).json({ error: "Already applied", status: existing.rows[0].status }); return;
    }
    const result = await pool.query(
      `INSERT INTO cu_campaign_applications (creator_id, campaign_id, campaign_name) VALUES ($1,$2,$3) RETURNING *`,
      [creatorId, campaignId, campaign_name || campaignId]
    );
    cache.del(`applications:${creatorId}`);
    cache.del("admin:creators");
    res.status(201).json({ application: result.rows[0] });
  } catch (err) {
    console.error("apply error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/cu/applications
router.get("/applications", requireCreator, async (req: Request, res: Response) => {
  try {
    const creatorId = (req as any).creatorId;
    const cacheKey = `applications:${creatorId}`;
    const cached = cache.get(cacheKey);
    if (cached) { res.json(cached); return; }

    const result = await pool.query(
      "SELECT * FROM cu_campaign_applications WHERE creator_id=$1 ORDER BY applied_at DESC",
      [creatorId]
    );
    const payload = { applications: result.rows };
    cache.set(cacheKey, payload, 30);
    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Submissions ───────────────────────────────────────────────────────────────

// POST /api/cu/submissions
router.post("/submissions", requireCreator, async (req: Request, res: Response) => {
  try {
    const { campaign_id, campaign_name, platform, content_url, caption, views, likes, comments, shares } = req.body;
    if (!campaign_id || !platform || !content_url) {
      res.status(400).json({ error: "campaign_id, platform, and content_url are required" }); return;
    }
    const creatorId = (req as any).creatorId;

    // Determine CPM rate from creator's tier
    const creatorResult = await pool.query("SELECT tier, badge_status FROM cu_creators WHERE id=$1", [creatorId]);
    const creator = creatorResult.rows[0];
    const cpmMap: Record<string, number> = { Starter: 100, Growth: 200, Premium: 300 };
    const cpmRateCents = cpmMap[creator?.tier] ?? 100;

    const viewCount = parseInt(views) || 0;
    const payoutCents = Math.floor((viewCount / 1000) * cpmRateCents);

    const result = await pool.query(
      `INSERT INTO cu_submissions (creator_id, campaign_id, campaign_name, platform, content_url, caption, cpm_rate_cents, views, likes, comments, shares, payout_cents)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [creatorId, campaign_id, campaign_name || campaign_id, platform, content_url, caption || null,
       cpmRateCents, viewCount, parseInt(likes) || 0, parseInt(comments) || 0, parseInt(shares) || 0, payoutCents]
    );

    // Mark badge eligible if claimed + first submission
    if (creator?.badge_status === "claimed") {
      await pool.query("UPDATE cu_creators SET badge_status='eligible' WHERE id=$1", [creatorId]);
    }

    res.status(201).json({ submission: result.rows[0] });
  } catch (err) {
    console.error("submission error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/cu/submissions
router.get("/submissions", requireCreator, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cu_submissions WHERE creator_id=$1 ORDER BY submitted_at DESC",
      [(req as any).creatorId]
    );
    res.json({ submissions: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Page Tracking ─────────────────────────────────────────────────────────────

// POST /api/cu/track
router.post("/track", async (req: Request, res: Response) => {
  try {
    const { path, visitor_id, visitorId, referrer } = req.body;
    await pool.query(
      "INSERT INTO cu_page_views (path, visitor_id, referrer) VALUES ($1,$2,$3)",
      [path || "/", visitor_id || visitorId || null, referrer || null]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Admin ─────────────────────────────────────────────────────────────────────

// POST /api/cu/admin/login
router.post("/admin/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ admin: true, user: username }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// GET /api/cu/admin/creators
router.get("/admin/creators", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const cached = cache.get("admin:creators");
    if (cached) { res.json(cached); return; }

    const result = await pool.query(`
      SELECT c.id, c.email, c.full_name, c.phone, c.creator_type,
             c.tiktok_handle, c.instagram_handle, c.youtube_handle, c.snapchat_handle, c.badge_status, c.tier,
             c.stripe_onboarded, c.stripe_account_id,
             c.total_views, c.tiktok_views, c.instagram_views, c.youtube_views, c.snapchat_views,
             c.total_earnings_cents, c.created_at,
             COUNT(DISTINCT a.id) as application_count,
             COUNT(DISTINCT s.id) as submission_count
      FROM cu_creators c
      LEFT JOIN cu_campaign_applications a ON a.creator_id = c.id
      LEFT JOIN cu_submissions s ON s.creator_id = c.id
      GROUP BY c.id ORDER BY c.created_at DESC
    `);
    const payload = { creators: result.rows };
    cache.set("admin:creators", payload, 30);
    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/cu/admin/submissions
router.get("/admin/submissions", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT s.*, c.full_name, c.email, c.badge_status
      FROM cu_submissions s
      JOIN cu_creators c ON c.id = s.creator_id
      ORDER BY s.submitted_at DESC
    `);
    res.json({ submissions: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/cu/admin/submissions/:id/approve
router.post("/admin/submissions/:id/approve", requireAdmin, async (req: Request, res: Response) => {
  try {
    const subResult = await pool.query("SELECT * FROM cu_submissions WHERE id=$1", [req.params.id]);
    if (subResult.rows.length === 0) { res.status(404).json({ error: "Not found" }); return; }
    const sub = subResult.rows[0];
    const payoutCents = Math.floor((sub.views / 1000) * sub.cpm_rate_cents);

    await pool.query(
      `UPDATE cu_submissions SET status='approved', payout_cents=$1, reviewed_at=NOW() WHERE id=$2`,
      [payoutCents, req.params.id]
    );

    // Map platform string to the correct views column
    const platformCol: Record<string, string> = {
      "tiktok": "tiktok_views",
      "instagram reels": "instagram_views",
      "youtube shorts": "youtube_views",
      "snapchat spotlight": "snapchat_views",
    };
    const platformKey = (sub.platform || "").toLowerCase();
    const viewsCol = platformCol[platformKey] || null;

    if (viewsCol) {
      await pool.query(
        `UPDATE cu_creators SET total_views=total_views+$1, total_earnings_cents=total_earnings_cents+$2, ${viewsCol}=${viewsCol}+$1 WHERE id=$3`,
        [sub.views, payoutCents, sub.creator_id]
      );
    } else {
      await pool.query(
        `UPDATE cu_creators SET total_views=total_views+$1, total_earnings_cents=total_earnings_cents+$2 WHERE id=$3`,
        [sub.views, payoutCents, sub.creator_id]
      );
    }

    // Advance badge if claimed
    await pool.query(
      `UPDATE cu_creators SET badge_status='eligible' WHERE id=$1 AND badge_status='claimed'`,
      [sub.creator_id]
    );
    res.json({ success: true, payout_cents: payoutCents, platform: sub.platform, views: sub.views });
  } catch (err) {
    console.error("approve submission error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/cu/admin/submissions/:id/reject
router.post("/admin/submissions/:id/reject", requireAdmin, async (req: Request, res: Response) => {
  try {
    await pool.query(`UPDATE cu_submissions SET status='rejected', reviewed_at=NOW() WHERE id=$1`, [req.params.id]);
    cache.del("admin:creators");
    cache.delPattern("admin:analytics");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/cu/admin/creators/:id/badge/approve
router.post("/admin/creators/:id/badge/approve", requireAdmin, async (req: Request, res: Response) => {
  try {
    const creatorId = req.params.id;
    const result = await pool.query(
      `UPDATE cu_creators SET badge_status='approved', total_earnings_cents=total_earnings_cents+2000
       WHERE id=$1 AND badge_status IN ('claimed','eligible') RETURNING *`,
      [creatorId]
    );
    if (result.rows.length === 0) { res.status(400).json({ error: "Creator not eligible" }); return; }
    await pool.query(
      `INSERT INTO cu_transactions (creator_id, type, amount_cents, status, note)
       VALUES ($1,'badge_bonus',2000,'paid','$20 Creator Badge Payout')`,
      [creatorId]
    );
    cache.del(`me:${creatorId}`);
    cache.del("admin:creators");
    cache.delPattern("admin:analytics");
    res.json({ success: true });
  } catch (err) {
    console.error("badge approve error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Stripe Connect ────────────────────────────────────────────────────────────

const BASE_DOMAIN = process.env.REPLIT_DOMAINS
  ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
  : "http://localhost:8080";

// POST /api/cu/connect/onboard — create/resume Stripe Express onboarding
router.post("/connect/onboard", requireCreator, async (req: Request, res: Response) => {
  try {
    const creatorId = (req as any).creatorId;
    const creator = (await pool.query("SELECT * FROM cu_creators WHERE id=$1", [creatorId])).rows[0];
    if (!creator) { res.status(404).json({ error: "Creator not found" }); return; }

    const stripe = await getUncachableStripeClient();

    let accountId = creator.stripe_account_id;
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        capabilities: { transfers: { requested: true } },
        metadata: { creator_id: String(creatorId), creator_email: creator.email },
      });
      accountId = account.id;
      await pool.query("UPDATE cu_creators SET stripe_account_id=$1, stripe_connect_status='pending' WHERE id=$2", [accountId, creatorId]);
    }

    const returnUrl = `${BASE_DOMAIN}/p2c-university/dashboard?stripe_return=1`;
    const refreshUrl = `${BASE_DOMAIN}/p2c-university/dashboard?stripe_refresh=1`;

    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    });

    res.json({ url: link.url });
  } catch (err: any) {
    console.error("Stripe Connect onboard error:", err);
    const msg = err?.message || "";
    const friendlyError = msg.includes("signed up for Connect")
      ? "Stripe payouts are being configured — check back shortly. Questions? Contact support."
      : msg || "Failed to create onboarding link";
    res.status(500).json({ error: friendlyError });
  }
});

// POST /api/cu/connect/verify — check if onboarding is complete
router.post("/connect/verify", requireCreator, async (req: Request, res: Response) => {
  try {
    const creatorId = (req as any).creatorId;
    const creator = (await pool.query("SELECT * FROM cu_creators WHERE id=$1", [creatorId])).rows[0];
    if (!creator?.stripe_account_id) { res.json({ onboarded: false }); return; }

    const stripe = await getUncachableStripeClient();
    const account = await stripe.accounts.retrieve(creator.stripe_account_id);
    const onboarded = account.details_submitted && account.charges_enabled;

    if (onboarded && !creator.stripe_onboarded) {
      await pool.query("UPDATE cu_creators SET stripe_onboarded=true, stripe_connect_status='verified' WHERE id=$1", [creatorId]);
    }

    res.json({ onboarded, details_submitted: account.details_submitted, charges_enabled: account.charges_enabled });
  } catch (err: any) {
    console.error("Stripe Connect verify error:", err);
    res.status(500).json({ error: err.message || "Verification failed" });
  }
});

// ─── Admin: Growth Analytics ───────────────────────────────────────────────────

// GET /api/cu/admin/analytics/growth — time-series growth data
router.get("/admin/analytics/growth", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const cached = cache.get("admin:analytics:growth");
    if (cached) { res.json(cached); return; }

    const [creatorGrowth, submissionGrowth, viewGrowth] = await Promise.all([
      pool.query(`
        SELECT DATE(created_at) as date, COUNT(*)::int as count,
               SUM(COUNT(*)) OVER (ORDER BY DATE(created_at))::int as cumulative
        FROM cu_creators
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
        LIMIT 60
      `),
      pool.query(`
        SELECT DATE(submitted_at) as date, COUNT(*)::int as submissions,
               COALESCE(SUM(views),0)::int as views
        FROM cu_submissions
        GROUP BY DATE(submitted_at)
        ORDER BY DATE(submitted_at)
        LIMIT 60
      `),
      pool.query(`
        SELECT
          COALESCE(SUM(CASE WHEN platform='tiktok' THEN views ELSE 0 END),0)::int as tiktok,
          COALESCE(SUM(CASE WHEN platform='instagram' THEN views ELSE 0 END),0)::int as instagram,
          COALESCE(SUM(CASE WHEN platform='youtube' THEN views ELSE 0 END),0)::int as youtube
        FROM cu_submissions WHERE status='approved'
      `),
    ]);
    const payload = {
      creator_growth: creatorGrowth.rows,
      submission_growth: submissionGrowth.rows,
      platform_views: viewGrowth.rows[0] || { tiktok: 0, instagram: 0, youtube: 0 },
    };
    cache.set("admin:analytics:growth", payload, 300);
    res.json(payload);
  } catch (err) {
    console.error("growth analytics error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Admin: Payout Trigger ─────────────────────────────────────────────────────

// POST /api/cu/admin/payout — trigger Stripe transfer to creator
router.post("/admin/payout", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { creator_id, amount_cents, note } = req.body;
    if (!creator_id || !amount_cents) { res.status(400).json({ error: "creator_id and amount_cents required" }); return; }

    const creatorResult = await pool.query("SELECT * FROM cu_creators WHERE id=$1", [creator_id]);
    const creator = creatorResult.rows[0];
    if (!creator) { res.status(404).json({ error: "Creator not found" }); return; }
    if (!creator.stripe_account_id || !creator.stripe_onboarded) {
      res.status(400).json({ error: "Creator has not completed Stripe onboarding" }); return;
    }

    const stripe = await getUncachableStripeClient();
    const transfer = await stripe.transfers.create({
      amount: amount_cents,
      currency: "usd",
      destination: creator.stripe_account_id,
      description: note || "Clippers University payout",
    });

    await pool.query(
      `INSERT INTO cu_transactions (creator_id, type, amount_cents, stripe_transfer_id, status, note)
       VALUES ($1, 'manual_payout', $2, $3, 'paid', $4)`,
      [creator_id, amount_cents, transfer.id, note || "Admin-triggered payout"]
    );
    await pool.query(
      "UPDATE cu_creators SET total_earnings_cents=total_earnings_cents+$1 WHERE id=$2",
      [amount_cents, creator_id]
    );

    res.json({ success: true, transfer_id: transfer.id });
  } catch (err: any) {
    console.error("payout error:", err);
    res.status(500).json({ error: err.message || "Payout failed" });
  }
});

// ─── Content Bundle Delivery ───────────────────────────────────────────────────

const P2P_BUNDLE_FILES = [
  { label: "Content Pack Vol. 1 (Zip)", url: "https://www.dropbox.com/scl/fo/7i3wzvnqgdzm3e29cw7yh/AEfEb49-whw31oj-yRd_XAE?rlkey=bioey3tbgrf1nypkt1mz9sjpw&st=6r4fdt5k&dl=1", size: "~481 MB", type: "download" as const },
  { label: "Content Pack Vol. 2 (Zip)", url: "https://www.dropbox.com/scl/fo/qx5ed9fvod10u9h3cur2q/AJqfCaESN_ql3avNg6-r6yA?rlkey=25myq2crrs7o93j9yu7y8f3wj&st=1yeuy3f6&dl=1", size: "~1.4 GB", type: "download" as const },
  { label: "Video 1", url: "/p2c-university/bundles/p2p-fittech-ai/p2p-video-1.mp4", size: "22 MB", type: "video" as const },
  { label: "Video 2", url: "/p2c-university/bundles/p2p-fittech-ai/p2p-video-2.mp4", size: "34 MB", type: "video" as const },
  { label: "Video 3", url: "/p2c-university/bundles/p2p-fittech-ai/p2p-video-3.mp4", size: "16 MB", type: "video" as const },
  { label: "Bonus Reference Video", url: "/p2c-university/bundles/p2p-fittech-ai/fittech-ai-bonus.mp4", size: "28 MB", type: "video" as const },
  { label: "Photo 1", url: "/p2c-university/bundles/p2p-fittech-ai/p2p-photo-1.jpg", size: "2.1 MB", type: "photo" as const },
  { label: "Photo 2", url: "/p2c-university/bundles/p2p-fittech-ai/p2p-photo-2.jpg", size: "1.5 MB", type: "photo" as const },
  { label: "Photo 3", url: "/p2c-university/bundles/p2p-fittech-ai/p2p-photo-3.jpg", size: "2.1 MB", type: "photo" as const },
  { label: "Photo 4", url: "/p2c-university/bundles/p2p-fittech-ai/p2p-photo-4.jpg", size: "1.1 MB", type: "photo" as const },
  { label: "Photo 5", url: "/p2c-university/bundles/p2p-fittech-ai/p2p-photo-5.jpg", size: "1.9 MB", type: "photo" as const },
];

const CAMPAIGN_BUNDLES: Record<string, { name: string; brand: string; files: typeof P2P_BUNDLE_FILES }> = {
  "2": { name: "P2P FitTech AI — Content Bundle", brand: "P2P Fit Tech AI", files: P2P_BUNDLE_FILES },
  "6": { name: "P2P FitTech AI — Content Bundle", brand: "P2P Fit Tech AI", files: P2P_BUNDLE_FILES },
  "7": { name: "P2P FitTech AI — Content Bundle", brand: "P2P Fit Tech AI", files: P2P_BUNDLE_FILES },
};

// GET /api/cu/bundles/:campaign_id — returns bundle if creator is approved for that campaign
router.get("/bundles/:campaign_id", requireCreator, async (req: Request, res: Response) => {
  try {
    const { campaign_id } = req.params;
    const creatorId = (req as any).creatorId;

    const application = await pool.query(
      "SELECT status FROM cu_campaign_applications WHERE creator_id=$1 AND campaign_id=$2",
      [creatorId, campaign_id]
    );

    if (!application.rows.length || application.rows[0].status !== "approved") {
      res.status(403).json({ error: "Bundle only available after your application is approved" });
      return;
    }

    const bundle = CAMPAIGN_BUNDLES[campaign_id];
    if (!bundle) { res.status(404).json({ error: "No bundle for this campaign" }); return; }

    res.json({ bundle });
  } catch (err) {
    console.error("bundle fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/cu/admin/creator/:id — delete creator + wipe Stripe account
router.delete("/admin/creator/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const creatorId = parseInt(req.params.id);
    if (isNaN(creatorId)) { res.status(400).json({ error: "Invalid creator ID" }); return; }

    const creatorRes = await pool.query("SELECT id, full_name, stripe_account_id FROM cu_creators WHERE id=$1", [creatorId]);
    if (!creatorRes.rows.length) { res.status(404).json({ error: "Creator not found" }); return; }
    const creator = creatorRes.rows[0];

    // Delete Stripe connected account if exists
    if (creator.stripe_account_id) {
      try {
        const stripe = await getUncachableStripeClient();
        await stripe.accounts.del(creator.stripe_account_id);
      } catch (stripeErr: any) {
        // If already deleted on Stripe side, continue
        if (stripeErr?.code !== "account_invalid") {
          console.error("Stripe account delete error:", stripeErr?.message);
        }
      }
    }

    // Delete all related records in order (FK constraints)
    await pool.query("DELETE FROM cu_transactions WHERE creator_id=$1", [creatorId]);
    await pool.query("DELETE FROM cu_submissions WHERE creator_id=$1", [creatorId]);
    await pool.query("DELETE FROM cu_campaign_applications WHERE creator_id=$1", [creatorId]);
    await pool.query("DELETE FROM cu_creators WHERE id=$1", [creatorId]);

    // Invalidate caches
    cache.del("admin:creators");
    cache.del("admin:analytics:main");

    res.json({ success: true, deleted: creator.full_name });
  } catch (err) {
    console.error("delete creator error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/cu/admin/analytics
router.get("/admin/analytics", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const cached = cache.get("admin:analytics:main");
    if (cached) { res.json(cached); return; }

    const [creatorsRes, viewsRes, earningsRes, badgeRes, tierRes, topRes, pageViewsRes, pageViewsTotalRes, pageViewsByPathRes] = await Promise.all([
      pool.query("SELECT COUNT(*)::int as total FROM cu_creators"),
      pool.query("SELECT COALESCE(SUM(total_views),0)::int as total FROM cu_creators"),
      pool.query("SELECT COALESCE(SUM(total_earnings_cents),0)::int as total FROM cu_creators"),
      pool.query("SELECT badge_status, COUNT(*)::int as count FROM cu_creators GROUP BY badge_status"),
      pool.query("SELECT tier, COUNT(*)::int as count FROM cu_creators GROUP BY tier"),
      pool.query(`SELECT full_name, total_views, total_earnings_cents FROM cu_creators ORDER BY total_views DESC LIMIT 5`),
      pool.query(`SELECT COUNT(*)::int as count FROM cu_page_views WHERE created_at >= NOW() - INTERVAL '30 days'`),
      pool.query(`SELECT COUNT(*)::int as count FROM cu_page_views`),
      pool.query(`SELECT path, COUNT(*)::int as visits FROM cu_page_views GROUP BY path ORDER BY visits DESC LIMIT 15`),
    ]);

    const badge_stats: Record<string, number> = {};
    for (const row of badgeRes.rows) badge_stats[row.badge_status] = row.count;

    const tier_stats: Record<string, number> = {};
    for (const row of tierRes.rows) tier_stats[row.tier] = row.count;

    const payload = {
      total_creators: creatorsRes.rows[0].total,
      total_views: viewsRes.rows[0].total,
      total_earnings_cents: earningsRes.rows[0].total,
      badge_stats,
      tier_stats,
      top_creators: topRes.rows,
      recent_page_views: pageViewsRes.rows[0].count,
      total_page_views: pageViewsTotalRes.rows[0].count,
      page_views_by_path: pageViewsByPathRes.rows,
    };
    cache.set("admin:analytics:main", payload, 300);
    res.json(payload);
  } catch (err) {
    console.error("analytics error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
