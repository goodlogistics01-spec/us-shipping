/**
 * Example Next.js API route for the Good Logistics Co., Ltd. inquiry form.
 *
 * Save as:
 * - App Router: app/api/inquiries/route.js
 * - Pages Router: pages/api/inquiries.js, then adapt the export shape
 *
 * Production options:
 * - Send email: Resend, SendGrid, Postmark, Mailgun, SMTP/Nodemailer
 * - Store database: Supabase, Airtable, HubSpot, your CRM, PostgreSQL
 * - Anti-spam: Cloudflare Turnstile, reCAPTCHA, hCaptcha, rate limiting
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^\+?[0-9][0-9\s().-]{6,22}$/;

function validate(payload) {
  const errors = {};

  if (!payload.name || payload.name.trim().length < 2) {
    errors.name = "Name is required.";
  }

  if (!payload.email || !EMAIL_REGEX.test(payload.email.trim())) {
    errors.email = "Valid email is required.";
  }

  if (!payload.phone || !PHONE_REGEX.test(payload.phone.trim())) {
    errors.phone = "Valid phone number is required.";
  }

  if (payload.website) {
    errors.spam = "Spam protection triggered.";
  }

  return errors;
}

async function sendEmail(payload) {
  /**
   * Example with Resend:
   *
   * const resend = new Resend(process.env.RESEND_API_KEY);
   * await resend.emails.send({
   *   from: "Good Logistics Co., Ltd. <website@good-shipping.com>",
   *   to: process.env.INQUIRY_TO_EMAIL,
   *   subject: `New freight inquiry from ${payload.name}`,
   *   text: JSON.stringify(payload, null, 2)
   * });
   */
}

async function saveToDatabase(payload) {
  /**
   * Example with Supabase:
   *
   * const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
   * await supabase.from("inquiries").insert({
   *   name: payload.name,
   *   email: payload.email,
   *   phone: payload.phone,
   *   company: payload.company || null,
   *   country: payload.country || null,
   *   requirement: payload.requirement || null,
   *   message: payload.message || null,
   *   locale: payload.locale || payload.language || "en",
   *   language: payload.language || payload.locale || "en",
   *   source: payload.source || "website",
   *   created_at: new Date().toISOString()
   * });
   */
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const errors = validate(payload);

    if (Object.keys(errors).length) {
      return Response.json({ ok: false, errors }, { status: 400 });
    }

    const inquiry = {
      ...payload,
      submittedAt: new Date().toISOString(),
      source: payload.source || "Good Logistics Co., Ltd. website"
    };

    await Promise.all([
      sendEmail(inquiry),
      saveToDatabase(inquiry)
    ]);

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { ok: false, message: "Unable to process inquiry." },
      { status: 500 }
    );
  }
}
