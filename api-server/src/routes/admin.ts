import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../lib/db";
import { getUncachableStripeClient } from "../stripeClient";

const router = Router();

const ADMIN_USER = "FounderP2";
const ADMIN_PASS = "What100%........";
const JWT_SECRET = process.env["JWT_SECRET"] || "p2p_admin_secret_2026_xK9mP";

// --- Admin Auth ---
function requireAdmin(req: Request, res: Response, next: Function) {
  const auth = req.headers["authorization"];
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// POST /api/admin/login
router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ admin: true, user: username }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// --- SaaS Analytics Layer ---
// GET /api/admin/saas
router.get("/saas", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [totalSubs, revMonth, revByPlan, revOverTime, recentSubs] = await Promise.all([
      // Total paid members — real waitlist
      pool.query(`SELECT COUNT(*) as count FROM waitlist WHERE paid = true`),

      // Revenue this month — real waitlist
      pool.query(`
        SELECT COALESCE(SUM(
          CASE
            WHEN tier = 'one_month'    THEN 199
            WHEN tier = 'early_access' THEN 499
            WHEN tier = 'two_year'     THEN 4499
            ELSE 0
          END
        ), 0) as total
        FROM waitlist
        WHERE paid = true
          AND created_at >= date_trunc('month', NOW())
      `),

      // Revenue by plan — real waitlist tiers
      pool.query(`
        SELECT
          CASE
            WHEN tier = 'one_month'    THEN '$1.99 — 1 Month'
            WHEN tier = 'early_access' THEN '$4.99 — Early Access'
            WHEN tier = 'two_year'     THEN '$44.99 — 2-Year Founder'
            ELSE tier
          END as plan,
          COUNT(*) as count,
          COALESCE(SUM(
            CASE
              WHEN tier = 'one_month'    THEN 199
              WHEN tier = 'early_access' THEN 499
              WHEN tier = 'two_year'     THEN 4499
              ELSE 0
            END
          ), 0) as revenue
        FROM waitlist
        WHERE paid = true AND tier IS NOT NULL
        GROUP BY tier
        ORDER BY revenue DESC
      `),

      // Revenue over last 7 months — real waitlist
      pool.query(`
        SELECT
          TO_CHAR(date_trunc('month', created_at), 'Mon') as month,
          date_trunc('month', created_at) as month_date,
          COALESCE(SUM(
            CASE
              WHEN tier = 'one_month'    THEN 199
              WHEN tier = 'early_access' THEN 499
              WHEN tier = 'two_year'     THEN 4499
              ELSE 0
            END
          ), 0) as revenue,
          COUNT(*) as subscriptions
        FROM waitlist
        WHERE paid = true
          AND created_at >= NOW() - INTERVAL '7 months'
        GROUP BY date_trunc('month', created_at)
        ORDER BY month_date ASC
      `),

      // Recent purchases — real waitlist
      pool.query(`
        SELECT
          email,
          CASE
            WHEN tier = 'one_month'    THEN '$1.99 — 1 Month'
            WHEN tier = 'early_access' THEN '$4.99 — Early Access'
            WHEN tier = 'two_year'     THEN '$44.99 — 2-Year Founder'
            ELSE tier
          END as plan,
          CASE
            WHEN tier = 'one_month'    THEN 199
            WHEN tier = 'early_access' THEN 499
            WHEN tier = 'two_year'     THEN 4499
            ELSE 0
          END as amount_cents,
          created_at
        FROM waitlist
        WHERE paid = true
        ORDER BY created_at DESC
        LIMIT 10
      `),
    ]);

    const totalRevCents = revOverTime.rows.reduce((sum: number, r: any) => sum + parseInt(r.revenue), 0);

    res.json({
      layer: "saas",
      stats: {
        total_subscriptions: parseInt(totalSubs.rows[0].count),
        revenue_this_month_cents: parseInt(revMonth.rows[0].total),
        revenue_this_month: (parseInt(revMonth.rows[0].total) / 100).toFixed(2),
        total_revenue_cents: totalRevCents,
        total_revenue: (totalRevCents / 100).toFixed(2),
      },
      revenue_by_plan: revByPlan.rows.map((r: any) => ({
        plan: r.plan,
        count: parseInt(r.count),
        revenue_cents: parseInt(r.revenue),
        revenue: (parseInt(r.revenue) / 100).toFixed(2),
      })),
      revenue_over_time: revOverTime.rows.map((r: any) => ({
        month: r.month,
        revenue: parseFloat((parseInt(r.revenue) / 100).toFixed(2)),
        subscriptions: parseInt(r.subscriptions),
      })),
      top_pages: [],
      recent_subscriptions: recentSubs.rows,
    });
  } catch (err) {
    console.error("saas dashboard error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- App Analytics Layer ---
// GET /api/admin/app
router.get("/app", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [totalWorkouts, totalSessions, caloriesToday, platformBreakdown,
      trainerLeaderboard, dailyWorkouts, recentWorkouts, avgDuration] = await Promise.all([

      // Total workouts ever
      pool.query(`SELECT COUNT(*) as count FROM app_events WHERE event_type = 'workout_complete'`),

      // Sessions today
      pool.query(`
        SELECT COUNT(DISTINCT user_id) as count FROM app_events
        WHERE event_type = 'session_start'
          AND created_at >= date_trunc('day', NOW())
      `),

      // Calories burned today
      pool.query(`
        SELECT COALESCE(SUM(calories), 0) as total
        FROM app_events
        WHERE event_type = 'workout_complete'
          AND created_at >= date_trunc('day', NOW())
      `),

      // Platform breakdown (iOS vs Android)
      pool.query(`
        SELECT platform, COUNT(*) as count
        FROM app_events
        WHERE event_type IN ('workout_complete', 'session_start')
          AND platform != 'unknown'
        GROUP BY platform
        ORDER BY count DESC
      `),

      // AI Trainer leaderboard
      pool.query(`
        SELECT
          trainer_id,
          COUNT(*) as workouts,
          COALESCE(SUM(calories), 0) as total_calories,
          ROUND(AVG(duration_seconds)) as avg_duration
        FROM app_events
        WHERE event_type = 'workout_complete' AND trainer_id IS NOT NULL
        GROUP BY trainer_id
        ORDER BY workouts DESC
      `),

      // Daily workouts for last 7 days
      pool.query(`
        SELECT
          TO_CHAR(date_trunc('day', created_at), 'Dy') as day,
          date_trunc('day', created_at) as day_date,
          COUNT(*) as completed
        FROM app_events
        WHERE event_type = 'workout_complete'
          AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY date_trunc('day', created_at)
        ORDER BY day_date ASC
      `),

      // Recent workout events
      pool.query(`
        SELECT user_id, trainer_id, duration_seconds, calories, platform, created_at
        FROM app_events
        WHERE event_type = 'workout_complete'
        ORDER BY created_at DESC
        LIMIT 10
      `),

      // Avg workout duration
      pool.query(`
        SELECT ROUND(AVG(duration_seconds)) as avg_duration_seconds
        FROM app_events
        WHERE event_type = 'workout_complete'
      `),
    ]);

    // Map trainer IDs to display names
    const trainerNames: Record<string, string> = {
      trainer_gabriel: "Gabriel R.",
      trainer_jonathan: "Jonathan E.",
      trainer_devon: "Devon C.",
      trainer_natalie: "Natalie T.",
    };

    res.json({
      layer: "app",
      stats: {
        total_workouts: parseInt(totalWorkouts.rows[0].count),
        active_sessions_today: parseInt(totalSessions.rows[0].count),
        calories_burned_today: parseInt(caloriesToday.rows[0].total),
        avg_workout_duration_seconds: parseInt(avgDuration.rows[0]?.avg_duration_seconds || 0),
        avg_workout_minutes: Math.round(parseInt(avgDuration.rows[0]?.avg_duration_seconds || 0) / 60),
      },
      platform_breakdown: platformBreakdown.rows.map(r => ({
        platform: r.platform,
        count: parseInt(r.count),
      })),
      trainer_leaderboard: trainerLeaderboard.rows.map(r => ({
        trainer_id: r.trainer_id,
        name: trainerNames[r.trainer_id] || r.trainer_id,
        workouts: parseInt(r.workouts),
        total_calories: parseInt(r.total_calories),
        avg_duration_minutes: Math.round(parseInt(r.avg_duration) / 60),
      })),
      daily_workouts: dailyWorkouts.rows.map(r => ({
        day: r.day,
        completed: parseInt(r.completed),
      })),
      recent_workouts: recentWorkouts.rows,
    });
  } catch (err) {
    console.error("app dashboard error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Combined Dashboard ---
// GET /api/admin/dashboard
router.get("/dashboard", requireAdmin, async (req: Request, res: Response) => {
  try {
    const [saasRes, appRes] = await Promise.all([
      fetch(`http://localhost:${process.env["PORT"]}/api/admin/saas`, {
        headers: { Authorization: req.headers["authorization"] as string },
      }),
      fetch(`http://localhost:${process.env["PORT"]}/api/admin/app`, {
        headers: { Authorization: req.headers["authorization"] as string },
      }),
    ]);
    const [saas, app] = await Promise.all([saasRes.json(), appRes.json()]);
    res.json({ saas, app, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("dashboard error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Stripe Account Balance + Charges + Payouts ---
// GET /api/admin/stripe-balance
router.get("/stripe-balance", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const stripe = await getUncachableStripeClient();
    const [balance, charges, payouts, sessions, waitlistRows, account] = await Promise.all([
      stripe.balance.retrieve(),
      stripe.charges.list({ limit: 50, expand: ["data.payment_intent"] }),
      stripe.payouts.list({ limit: 10 }).catch(() => ({ data: [] })),
      stripe.checkout.sessions.list({ limit: 50 }).catch(() => ({ data: [] })),
      pool.query("SELECT email, stripe_session_id, stripe_customer_id FROM waitlist WHERE paid = true"),
      stripe.accounts.retrieve().catch(() => null),
    ]);
    const available = balance.available.reduce((sum, b) => sum + b.amount, 0);
    const pending = balance.pending.reduce((sum, b) => sum + b.amount, 0);

    // Build lookup maps for email resolution
    const sessionEmailMap: Record<string, string> = {};
    for (const s of (sessions as any).data) {
      if (s.customer_details?.email) {
        sessionEmailMap[s.id] = s.customer_details.email;
        if (s.payment_intent) {
          const piId = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id;
          if (piId) sessionEmailMap[piId] = s.customer_details.email;
        }
      }
    }
    const waitlistEmailMap: Record<string, string> = {};
    for (const row of waitlistRows.rows as any[]) {
      if (row.stripe_session_id) waitlistEmailMap[row.stripe_session_id] = row.email;
      if (row.stripe_customer_id) waitlistEmailMap[row.stripe_customer_id] = row.email;
    }

    const recentCharges = charges.data.map((c) => {
      const piId = typeof (c as any).payment_intent === "string" ? (c as any).payment_intent : (c as any).payment_intent?.id;
      const resolvedEmail =
        c.billing_details?.email ||
        c.receipt_email ||
        (piId && sessionEmailMap[piId]) ||
        null;
      return {
        id: c.id,
        amount_cents: c.amount,
        amount: (c.amount / 100).toFixed(2),
        currency: c.currency.toUpperCase(),
        status: c.status,
        paid: c.paid,
        email: resolvedEmail,
        description: c.description || null,
        created: new Date(c.created * 1000).toISOString(),
      };
    });

    const recentPayouts = (payouts as any).data.map((p: any) => ({
      id: p.id,
      amount_cents: p.amount,
      amount: (p.amount / 100).toFixed(2),
      currency: p.currency.toUpperCase(),
      status: p.status,
      arrival_date: new Date(p.arrival_date * 1000).toISOString(),
      created: new Date(p.created * 1000).toISOString(),
    }));

    const totalCharged = charges.data
      .filter((c) => c.paid && c.status === "succeeded")
      .reduce((sum, c) => sum + c.amount, 0);

    const payoutSchedule = (account as any)?.settings?.payouts?.schedule ?? null;

    res.json({
      available_cents: available,
      pending_cents: pending,
      available: (available / 100).toFixed(2),
      pending: (pending / 100).toFixed(2),
      currency: balance.available[0]?.currency?.toUpperCase() ?? "USD",
      total_charged_cents: totalCharged,
      total_charged: (totalCharged / 100).toFixed(2),
      recent_charges: recentCharges,
      recent_payouts: recentPayouts,
      payout_schedule: payoutSchedule,
    });
  } catch (err: any) {
    console.error("Stripe balance error:", err);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

// --- Payout Schedule ---
// POST /api/admin/payout-schedule  body: { interval: 'manual' | 'daily' | 'weekly' | 'monthly' }
router.post("/payout-schedule", requireAdmin, async (req: Request, res: Response) => {
  try {
    const interval: string = req.body?.interval ?? "manual";
    const stripeKey = (process.env.P2P_STRIPE_KEY || process.env.STRIPE_SECRET_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

    // Build form body for the Stripe REST /v1/account endpoint
    const params = new URLSearchParams();
    params.append("settings[payouts][schedule][interval]", interval);
    if (interval === "weekly") params.append("settings[payouts][schedule][weekly_anchor]", "monday");
    if (interval === "monthly") params.append("settings[payouts][schedule][monthly_anchor]", "1");

    const r = await fetch("https://api.stripe.com/v1/account", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data: any = await r.json();
    if (!r.ok) {
      throw new Error(data?.error?.message || "Stripe API error");
    }

    const newSchedule = data?.settings?.payouts?.schedule ?? { interval };
    res.json({ success: true, payout_schedule: newSchedule });
  } catch (err: any) {
    console.error("Payout schedule error:", err);
    res.status(500).json({ error: err.message || "Failed to update payout schedule" });
  }
});

// --- Withdraw Funds ---
// POST /api/admin/withdraw
router.post("/withdraw", requireAdmin, async (req: Request, res: Response) => {
  try {
    const stripe = await getUncachableStripeClient();

    // Get current available balance
    const balance = await stripe.balance.retrieve();
    const available = balance.available
      .filter((b) => b.currency === "usd")
      .reduce((sum, b) => sum + b.amount, 0);

    if (available <= 0) {
      res.status(400).json({ error: "No available balance to withdraw" });
      return;
    }

    // Use requested amount or full available balance
    const requestedCents = req.body?.amount_cents;
    const amount = requestedCents && requestedCents > 0 && requestedCents <= available
      ? parseInt(requestedCents)
      : available;

    const payout = await stripe.payouts.create({
      amount,
      currency: "usd",
      method: "standard",
      description: "P2P FitTech AI — admin withdrawal",
    });

    res.json({
      success: true,
      payout_id: payout.id,
      amount_cents: payout.amount,
      amount: (payout.amount / 100).toFixed(2),
      status: payout.status,
      arrival_date: new Date(payout.arrival_date * 1000).toISOString(),
    });
  } catch (err: any) {
    console.error("Withdraw error:", err);
    res.status(500).json({ error: err.raw?.message || err.message || "Failed to initiate withdrawal" });
  }
});

// --- Live Activity Feed ---
// GET /api/admin/activity
router.get("/activity", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT type, label, meta, amount_cents, ref, created_at FROM (
        SELECT
          CASE WHEN paid = true THEN 'purchase' ELSE 'signup' END as type,
          email as label,
          tier as meta,
          CASE WHEN paid = true AND tier = 'one_month' THEN 199
               WHEN paid = true AND tier = 'early_access' THEN 499
               WHEN paid = true AND tier = 'two_year' THEN 4499
               ELSE 0 END as amount_cents,
          stripe_session_id as ref,
          created_at
        FROM waitlist
        UNION ALL
        SELECT
          event_type as type,
          COALESCE(page, email, 'visitor') as label,
          plan as meta,
          COALESCE(amount_cents, 0) as amount_cents,
          NULL as ref,
          created_at
        FROM saas_events
        WHERE event_type IN ('page_view', 'checkout_click', 'subscription')
      ) combined
      ORDER BY created_at DESC
      LIMIT 40
    `);
    res.json({ events: result.rows });
  } catch (err) {
    console.error("activity feed error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Website Analytics ---
// GET /api/admin/web-analytics
router.get("/web-analytics", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [totalViews, checkoutClicks, todayViews, todayClicks, todaySignups, todayPurchases, byPage] = await Promise.all([
      pool.query(`SELECT COUNT(*) as total FROM saas_events WHERE event_type = 'page_view'`),
      pool.query(`SELECT COUNT(*) as total FROM saas_events WHERE event_type = 'checkout_click'`),
      pool.query(`SELECT COUNT(*) as total FROM saas_events WHERE event_type = 'page_view' AND created_at >= date_trunc('day', NOW() AT TIME ZONE 'America/New_York')`),
      pool.query(`SELECT COUNT(*) as total FROM saas_events WHERE event_type = 'checkout_click' AND created_at >= date_trunc('day', NOW() AT TIME ZONE 'America/New_York')`),
      pool.query(`SELECT COUNT(*) as total FROM waitlist WHERE created_at >= date_trunc('day', NOW() AT TIME ZONE 'America/New_York')`),
      pool.query(`SELECT COUNT(*) as total FROM waitlist WHERE paid = true AND created_at >= date_trunc('day', NOW() AT TIME ZONE 'America/New_York')`),
      pool.query(`
        SELECT page, COUNT(*) as views
        FROM saas_events
        WHERE event_type = 'page_view' AND page IS NOT NULL
        GROUP BY page ORDER BY views DESC LIMIT 6
      `),
    ]);
    const views = parseInt(totalViews.rows[0].total) || 0;
    const clicks = parseInt(checkoutClicks.rows[0].total) || 0;
    const todayV = parseInt(todayViews.rows[0].total) || 0;
    const todayC = parseInt(todayClicks.rows[0].total) || 0;
    res.json({
      total_page_views: views,
      checkout_clicks: clicks,
      today_views: todayV,
      today_checkout_clicks: todayC,
      today_signups: parseInt(todaySignups.rows[0].total) || 0,
      today_purchases: parseInt(todayPurchases.rows[0].total) || 0,
      conversion_rate: views > 0 ? ((clicks / views) * 100).toFixed(1) : "0.0",
      today_conversion_rate: todayV > 0 ? ((todayC / todayV) * 100).toFixed(1) : "0.0",
      by_page: byPage.rows,
    });
  } catch (err) {
    console.error("web analytics error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- API Key info (for app developer) ---
// GET /api/admin/keys
router.get("/keys", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, key_hash, label, scope, created_at, last_used_at, is_active FROM api_keys ORDER BY created_at DESC`
    );
    res.json({ keys: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
