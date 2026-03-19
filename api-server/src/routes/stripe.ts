import { Router } from "express";
import { storage } from "../storage";
import { getUncachableStripeClient } from "../stripeClient";

const router = Router();

const BASE_URL = process.env.REPLIT_DOMAINS
  ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
  : "http://localhost:8080";

const WEBSITE_URL = `${BASE_URL}/p2p-website`;

const TIER_CONFIG = {
  one_month: {
    name: "P2P FitTech AI — 1 Month Early Access",
    description: "1 month of full access to P2P FitTech AI. All perks included.",
    amount: 199,
    currency: "usd",
  },
  early_access: {
    name: "P2P FitTech AI — Early Access (2 Months)",
    description: "2 months of full access to P2P FitTech AI. Be first in.",
    amount: 499,
    currency: "usd",
  },
  two_year: {
    name: "P2P FitTech AI — 2 Years Access",
    description: "2 full years of access. One payment, locked in forever.",
    amount: 4499,
    currency: "usd",
  },
} as const;

async function createCheckoutSession(email: string, tier: string, res: any, phone?: string) {
  if (!(tier in TIER_CONFIG)) {
    return res.status(400).json({ error: "Invalid tier" });
  }
  const config = TIER_CONFIG[tier as keyof typeof TIER_CONFIG];
  const stripe = await getUncachableStripeClient();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: config.currency,
          unit_amount: config.amount,
          product_data: {
            name: config.name,
            description: config.description,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: email,
    success_url: `${WEBSITE_URL}?waitlist=success&tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${WEBSITE_URL}?waitlist=cancelled`,
    metadata: { tier, phone: phone || "" },
  });
  await storage.addToWaitlist({ email, tier, phone: phone || undefined, stripeSessionId: session.id });
  return session;
}

router.post("/stripe/checkout", async (req, res) => {
  try {
    const { email, tier, phone } = req.body;
    if (!email || !tier) return res.status(400).json({ error: "email and tier are required" });
    const session = await createCheckoutSession(email, tier, res, phone);
    if (session && session.url) res.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: err?.message || "Failed to create checkout session" });
  }
});

router.get("/stripe/checkout", async (req, res) => {
  try {
    const { email, tier, phone } = req.query as { email: string; tier: string; phone?: string };
    if (!email || !tier) return res.status(400).send("email and tier are required");
    const session = await createCheckoutSession(email, tier, res, phone);
    if (session && session.url) res.redirect(302, session.url);
  } catch (err: any) {
    console.error("Checkout error:", err);
    res.status(500).send(err?.message || "Failed to create checkout session");
  }
});

// Verify a checkout session is actually paid before revealing the access code
router.get("/stripe/verify-session", async (req, res) => {
  const { session_id } = req.query as { session_id: string };
  if (!session_id) return res.json({ paid: false, error: "No session_id" });
  try {
    const stripe = await getUncachableStripeClient();
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paid = session.payment_status === "paid";
    if (paid) {
      // Mark as paid in our DB too
      await storage.markWaitlistPaid(session_id).catch(() => {});
    }
    res.json({
      paid,
      tier: session.metadata?.tier || "early_access",
      email: session.customer_email || null,
    });
  } catch (err: any) {
    res.json({ paid: false, error: err?.message });
  }
});

router.get("/stripe/waitlist/stats", async (_req, res) => {
  try {
    const stats = await storage.getWaitlistStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to get stats" });
  }
});

router.get("/stripe/waitlist", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    const entries = await storage.listWaitlist(limit, offset);
    res.json({ data: entries });
  } catch (err) {
    res.status(500).json({ error: "Failed to list waitlist" });
  }
});

export default router;
