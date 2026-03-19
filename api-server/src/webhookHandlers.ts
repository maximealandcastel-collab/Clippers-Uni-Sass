import Stripe from "stripe";
import { getStripeSync, getUncachableStripeClient } from "./stripeClient";
import { sendRedemptionEmail } from "./emailService";
import { sendPromoCodeSms } from "./smsService";
import { storage } from "./storage";

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email =
    session.customer_email ||
    session.customer_details?.email ||
    "";
  const tier = (session.metadata?.tier as string) ?? "early_access";
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : (session.customer as any)?.toString() ?? session.id;

  try {
    await storage.markWaitlistPaid(session.id, customerId);
    console.log(`✅ Waitlist marked paid: session=${session.id} email=${email}`);
  } catch (markErr) {
    console.error("Failed to mark waitlist paid:", markErr);
  }

  if (email) {
    await sendRedemptionEmail(email, tier);
  } else {
    console.warn("checkout.session.completed — no email found on session", session.id);
  }

  // Send SMS promo code if phone number was captured
  const phone = session.metadata?.phone;
  if (phone) {
    sendPromoCodeSms(phone, tier).catch((err) =>
      console.error("SMS send error (non-fatal):", err)
    );
  }
}

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        "STRIPE WEBHOOK ERROR: Payload must be a Buffer. " +
        "Received type: " + typeof payload + ". " +
        "FIX: Ensure webhook route is registered BEFORE app.use(express.json())."
      );
    }

    // Try manual verification first using STRIPE_WEBHOOK_SECRET (production domain webhook)
    const manualSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (manualSecret) {
      try {
        const stripe = await getUncachableStripeClient();
        const event = stripe.webhooks.constructEvent(payload, signature, manualSecret);
        console.log(`✅ Webhook verified via STRIPE_WEBHOOK_SECRET: ${event.type}`);
        if (event.type === "checkout.session.completed") {
          await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        }
        return; // Successfully handled
      } catch (verifyErr: any) {
        // Secret didn't match — fall through to stripe-replit-sync
        console.log("STRIPE_WEBHOOK_SECRET verify failed, trying managed webhook...");
      }
    }

    // Fall back to stripe-replit-sync managed webhook
    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);

    try {
      const event = JSON.parse(payload.toString()) as Stripe.Event;
      if (event.type === "checkout.session.completed") {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      }
    } catch (err) {
      console.error("Custom webhook handler error:", err);
    }
  }
}
