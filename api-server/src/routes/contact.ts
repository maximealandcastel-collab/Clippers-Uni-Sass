import { Router, type Request, type Response } from "express";
import { Resend } from "resend";

const router = Router();

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/contact
router.post("/contact", async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body as { name?: string; email?: string; message?: string };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "name, email, and message are required." });
    }

    await resend.emails.send({
      from: "P2P FitTech AI <noreply@p2pfitechai.com>",
      to: ["noreply@p2pfitechai.com"],
      reply_to: email.trim(),
      subject: `Contact Form: Message from ${name.trim()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #0a0e14; color: #e5e7eb; padding: 32px; border-radius: 12px;">
          <div style="margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <span style="display:inline-block; background:#FF6B00; color:#fff; font-size:11px; font-weight:700; padding:4px 12px; border-radius:999px; letter-spacing:0.1em; text-transform:uppercase;">Contact Form Submission</span>
            <h2 style="margin: 12px 0 4px; font-size: 20px; color: #ffffff;">New Message Received</h2>
            <p style="margin: 0; font-size: 13px; color: #6b7280;">P2P FitTech AI — noreply@p2pfitechai.com</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:14px;">
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; width: 80px;">Name</td>
              <td style="padding: 8px 0; color: #f9fafb; font-weight: 600;">${name.trim()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${email.trim()}" style="color:#FF6B00; text-decoration:none;">${email.trim()}</a></td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;">
            <p style="margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280;">Message</p>
            <p style="margin: 0; font-size: 14px; color: #d1d5db; white-space: pre-wrap; line-height: 1.6;">${message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #4b5563;">Reply directly to this email to respond to ${name.trim()}.</p>
        </div>
      `,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ error: "Failed to send message." });
  }
});

export default router;
