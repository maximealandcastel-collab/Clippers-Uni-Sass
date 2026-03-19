import Stripe from "stripe";
import { StripeSync } from "stripe-replit-sync";

function getStripeSecretKey(): string {
  // P2P_STRIPE_KEY takes priority — avoids conflict with Replit's Stripe integration
  // which auto-injects STRIPE_SECRET_KEY with a Manifest (mk_) key that can't create sessions
  const key = process.env.P2P_STRIPE_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("P2P_STRIPE_KEY env var is not set");
  const clean = key.replace(/[^\x20-\x7E]/g, "").trim();
  if (clean.startsWith("mk_")) throw new Error("Invalid key type: use sk_live_ not mk_ (Manifest key). Set P2P_STRIPE_KEY in Secrets.");
  return clean;
}

export async function getUncachableStripeClient(): Promise<Stripe> {
  return new Stripe(getStripeSecretKey());
}

let stripeSyncInstance: StripeSync | null = null;

export async function getStripeSync(): Promise<StripeSync> {
  if (stripeSyncInstance) return stripeSyncInstance;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required");

  stripeSyncInstance = new StripeSync({
    stripeSecretKey: getStripeSecretKey(),
    databaseUrl,
  });
  return stripeSyncInstance;
}
