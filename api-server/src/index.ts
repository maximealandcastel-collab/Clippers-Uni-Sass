import cluster from "cluster";
import os from "os";
import { runMigrations } from "stripe-replit-sync";
import { getStripeSync } from "./stripeClient";
import app from "./app";

const rawPort = process.env["PORT"];
if (!rawPort) throw new Error("PORT environment variable is required");
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT: "${rawPort}"`);

const NUM_WORKERS = os.cpus().length; // 8 on your current machine config

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn("DATABASE_URL not set — skipping Stripe init");
    return;
  }
  try {
    console.log("Initializing Stripe schema...");
    await runMigrations({ databaseUrl, schema: "stripe" });
    console.log("Stripe schema ready");

    const stripeSync = await getStripeSync();
    const domains = process.env.REPLIT_DOMAINS?.split(",")[0];
    const webhookBaseUrl = domains ? `https://${domains}` : "http://localhost:8080";
    await stripeSync.findOrCreateManagedWebhook(`${webhookBaseUrl}/api/stripe/webhook`);
    console.log("Stripe webhook configured");

    stripeSync.syncBackfill()
      .then(() => console.log("Stripe data synced"))
      .catch((err: any) => console.error("Stripe sync error:", err));
  } catch (err) {
    console.error("Stripe init error (non-fatal):", err);
  }
}

if (cluster.isPrimary) {
  // Primary: run Stripe init once, then fork one worker per CPU
  (async () => {
    await initStripe();
    console.log(`Primary ${process.pid} — spawning ${NUM_WORKERS} workers`);
    for (let i = 0; i < NUM_WORKERS; i++) cluster.fork();

    cluster.on("exit", (worker, code, signal) => {
      console.warn(`Worker ${worker.process.pid} died (${signal || code}) — restarting`);
      cluster.fork();
    });
  })();
} else {
  // Worker: just start the HTTP server
  app.listen(port, "0.0.0.0", () => {
    console.log(`Worker ${process.pid} listening on port ${port}`);
  });
}
