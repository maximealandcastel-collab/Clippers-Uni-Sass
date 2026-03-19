const TWILIO_ACCOUNT_SID = process.env.TWILO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILO_AUTH_TOKEN || process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM_NUMBER = process.env.TWILO_FROM_NUMBER || process.env.TWILIO_FROM_NUMBER;

const PROMO_CODE = "MAXP210";

export async function sendPromoCodeSms(toPhone: string, tier: string): Promise<void> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.warn("⚠️  Twilio credentials not configured — SMS not sent to", toPhone);
    return;
  }

  const tierLabel =
    tier === "one_month" ? "1-Month Early Access" :
    tier === "early_access" ? "2-Month Early Access" :
    tier === "two_year" ? "2-Year Founder Access" :
    "Early Access";

  const body = `🔥 P2P FitTech AI — ${tierLabel} confirmed!\n\nYour promo code: ${PROMO_CODE}\n\nSave this. It unlocks your access at launch. Welcome to the future of fitness coaching.`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const payload = new URLSearchParams({
    To: toPhone,
    From: TWILIO_FROM_NUMBER,
    Body: body,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Twilio SMS error:", errText);
    throw new Error(`Twilio SMS failed: ${response.status}`);
  }

  const data = await response.json() as any;
  console.log(`✅ SMS sent to ${toPhone} — SID: ${data.sid}`);
}
