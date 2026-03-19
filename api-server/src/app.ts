import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { WebhookHandlers } from "./webhookHandlers";
import router from "./routes";

const app: Express = express();

app.use(cors());

// Stripe webhook MUST be registered before express.json()
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) return res.status(400).json({ error: "Missing stripe-signature" });
    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;
      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      res.status(200).json({ received: true });
    } catch (err: any) {
      console.error("Webhook error:", err.message);
      res.status(400).json({ error: "Webhook processing error" });
    }
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve static files — resolve relative to process.cwd() (workspace root)
// Works correctly whether run via tsx (dev) or node dist/index.cjs (prod)
const artifactsRoot = path.resolve(process.cwd(), "artifacts");
const commercialDist = path.join(artifactsRoot, "p2p-commercial/dist/web");
const websiteDist = path.join(artifactsRoot, "p2p-website/dist/public");

if (fs.existsSync(websiteDist)) {
  app.use("/p2p-website", express.static(websiteDist));
  app.use("/p2p-website", (_req, res) => {
    res.sendFile(path.join(websiteDist, "index.html"));
  });
}

if (fs.existsSync(commercialDist)) {
  app.use(express.static(commercialDist));
  app.use((_req, res) => {
    res.sendFile(path.join(commercialDist, "index.html"));
  });
}

export default app;
