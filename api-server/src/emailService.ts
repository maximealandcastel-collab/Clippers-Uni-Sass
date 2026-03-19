const REDEMPTION_CODE = "MAXP210";

function buildEmailHtml(tier: string): string {
  const tierLabel =
    tier === "two_year" ? "2 Years Access" : "2 Months Early Access";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your P2P FitTech AI Access Code</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #222;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#FF6B00,#FF4500);padding:32px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.7);text-transform:uppercase;">P2P FitTech AI</p>
              <h1 style="margin:0;font-size:26px;font-weight:900;color:#fff;letter-spacing:-0.5px;">Payment Confirmed</h1>
              <p style="margin:8px 0 0 0;font-size:14px;color:rgba(255,255,255,0.8);">${tierLabel} — your spot is locked in.</p>
            </td>
          </tr>

          <!-- Code block -->
          <tr>
            <td style="padding:36px 32px 24px;">
              <p style="margin:0 0 16px 0;font-size:13px;color:#888;text-align:center;letter-spacing:1px;text-transform:uppercase;">Your exclusive access code</p>
              <div style="background:#0a0a0a;border:2px solid #FF6B00;border-radius:12px;padding:24px;text-align:center;">
                <span style="font-size:42px;font-weight:900;color:#ffffff;letter-spacing:8px;">${REDEMPTION_CODE}</span>
              </div>
              <p style="margin:16px 0 0 0;font-size:12px;color:#666;text-align:center;">Save this — you'll need it when the app launches.</p>
            </td>
          </tr>

          <!-- Instructions -->
          <tr>
            <td style="padding:0 32px 32px;">
              <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:20px;">
                <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;color:#fff;">How to use your code</p>
                <p style="margin:0 0 8px 0;font-size:13px;color:#aaa;line-height:1.6;">
                  1. Download P2P FitTech AI from the App Store or Google Play when it launches.<br/>
                  2. On the sign-up screen, enter code <strong style="color:#FF6B00;">${REDEMPTION_CODE}</strong>.<br/>
                  3. Your ${tierLabel} unlocks instantly — no extra charge.
                </p>
              </div>
            </td>
          </tr>

          <!-- Phone CTA -->
          <tr>
            <td style="padding:0 32px 28px;">
              <div style="background:linear-gradient(135deg,#1a0f00,#2a1500);border:1px solid #FF6B00;border-radius:12px;padding:20px;text-align:center;">
                <p style="margin:0 0 6px 0;font-size:13px;font-weight:700;color:#FF6B00;text-transform:uppercase;letter-spacing:1px;">📱 Get SMS Launch Alerts</p>
                <p style="margin:0 0 14px 0;font-size:13px;color:#ccc;line-height:1.6;">We'll text you the moment the app goes live + any exclusive drops. Reply to this email with your phone number and we'll add you to the list.</p>
                <a href="mailto:noreply@p2pfitechai.com?subject=My Phone Number&body=Hi, my phone number is: " style="display:inline-block;background:#FF6B00;color:#fff;font-weight:800;font-size:13px;padding:12px 28px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">Reply With My Number →</a>
              </div>
            </td>
          </tr>

          <!-- Tagline -->
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;color:#FF6B00;text-transform:uppercase;">Stop Managing. Start Coaching.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d0d0d;border-top:1px solid #1e1e1e;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#555;">© ${new Date().getFullYear()} P2P FitTech AI · <a href="https://p2pfitechai.com" style="color:#FF6B00;text-decoration:none;">p2pfitechai.com</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildReEngagementHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Spot is Still Available</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #222;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#FF6B00,#FF4500);padding:32px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.7);text-transform:uppercase;">P2P FitTech AI</p>
              <h1 style="margin:0;font-size:26px;font-weight:900;color:#fff;letter-spacing:-0.5px;">Your Spot is Still Open</h1>
              <p style="margin:8px 0 0 0;font-size:14px;color:rgba(255,255,255,0.8);">But it won't be for long.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 24px;">
              <p style="margin:0 0 16px 0;font-size:15px;color:#ccc;line-height:1.7;">
                You showed interest in P2P FitTech AI — the AI-powered coaching platform that puts 30+ elite trainer personas in your pocket.
              </p>
              <p style="margin:0 0 24px 0;font-size:15px;color:#ccc;line-height:1.7;">
                We're officially <strong style="color:#fff;">LIVE</strong>. Early access spots are filling up. Lock yours in right now for as little as <strong style="color:#FF6B00;">$1.99</strong>.
              </p>
              <div style="text-align:center;">
                <a href="https://p2pfitechai.com/p2p-website" style="display:inline-block;background:#FF6B00;color:#fff;font-weight:900;font-size:15px;letter-spacing:0.5px;padding:16px 40px;border-radius:12px;text-decoration:none;">Reserve My Spot Now →</a>
              </div>
            </td>
          </tr>

          <!-- Perks -->
          <tr>
            <td style="padding:0 32px 32px;">
              <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:20px;">
                <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;color:#fff;">What you get with early access:</p>
                <p style="margin:0;font-size:13px;color:#aaa;line-height:2;">
                  ✅ Full AI coaching platform<br/>
                  ✅ 30+ AI trainer personas<br/>
                  ✅ Personalized workout plans<br/>
                  ✅ Personal trainer fees waived<br/>
                  ✅ Promo code <strong style="color:#FF6B00;">MAXP210</strong> delivered instantly
                </p>
              </div>
            </td>
          </tr>

          <!-- Tagline -->
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;color:#FF6B00;text-transform:uppercase;">Stop Managing. Start Coaching.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d0d0d;border-top:1px solid #1e1e1e;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#555;">© ${new Date().getFullYear()} P2P FitTech AI · <a href="https://p2pfitechai.com" style="color:#FF6B00;text-decoration:none;">p2pfitechai.com</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendReEngagementBlast(emails: string[]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.warn("RESEND_API_KEY not set"); return; }

  for (const email of emails) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "P2P FitTech AI <noreply@p2pfitechai.com>",
          to: email,
          subject: "⚡ Your spot is still open — P2P FitTech AI is LIVE",
          html: buildReEngagementHtml(),
        }),
      });
      if (res.ok) console.log(`Re-engagement email sent → ${email}`);
      else console.error(`Failed to send to ${email}:`, await res.text());
    } catch (err) {
      console.error(`Error sending to ${email}:`, err);
    }
  }
}

export async function sendRedemptionEmail(
  email: string,
  tier: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping redemption email");
    return;
  }

  const tierLabel =
    tier === "two_year" ? "2 Years Access" : "2 Months Early Access";

  const OWNER_EMAIL = "maximealandcastel@gmail.com";

  async function trySend(to: string, subject: string, html: string): Promise<boolean> {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "P2P FitTech AI <noreply@p2pfitechai.com>", to, subject, html }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`Resend failed to ${to}:`, res.status, body);
      return false;
    }
    console.log(`Email sent → ${to}`);
    return true;
  }

  try {
    const subject = `Your access code is MAXP210 — ${tierLabel}`;
    const html = buildEmailHtml(tier);

    const sent = await trySend(email, subject, html);

    if (!sent && email !== OWNER_EMAIL) {
      // Domain not verified yet — notify owner so they can forward manually
      const ownerHtml = `<div style="font-family:sans-serif;padding:32px;background:#0a0a0a;color:#fff;">
        <h2 style="color:#FF6B00;">⚡ New Purchase — Send Code Manually</h2>
        <p>Customer email delivery failed (Resend domain not verified yet).</p>
        <p><strong>Customer:</strong> ${email}</p>
        <p><strong>Plan:</strong> ${tierLabel}</p>
        <p><strong>Code to send them:</strong> <span style="font-size:28px;font-weight:900;color:#FF6B00;letter-spacing:4px;">MAXP210</span></p>
        <hr style="border-color:#333;margin:20px 0;"/>
        <p style="color:#888;font-size:13px;">Once you verify p2pfitechai.com in Resend, future emails will send automatically.</p>
      </div>`;
      await trySend(OWNER_EMAIL, `⚡ New purchase from ${email} — send MAXP210 manually`, ownerHtml);
    }
  } catch (err) {
    console.error("Email send error:", err);
  }
}
