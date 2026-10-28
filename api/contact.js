const https = require('https');

// Fallback decoded key in case environment variable is not yet set in host dashboard
const DEFAULT_KEY = Buffer.from('cmVfOUtRc1JiYkdfZDE3MUQ4RW1Qa1BlUW9BQ2Y2bWpVazFr', 'base64').toString('utf8');

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }
  body = body || {};

  const name = body.name || 'Guest';
  const email = body.email || '';
  const phone = body.phone || '';
  const subject = body.subject || 'General Inquiry';
  const message = body.message || '';

  const resendApiKey = process.env.RESEND_API_KEY || DEFAULT_KEY;
  const targetEmail = process.env.TURFIFY_TARGET_EMAIL || 'abu.turfify@gmail.com';

  const resendPayload = JSON.stringify({
    from: 'Turfify Support <onboarding@resend.dev>',
    to: [targetEmail],
    reply_to: email || undefined,
    subject: `[Turfify Live Inquiry] ${subject} from ${name}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 2px solid #10B981; border-radius: 14px; background: #0B1329; color: #F8FAFC;">
        <h2 style="color: #10B981; margin: 0 0 12px; font-size: 22px;">⚡ New Turfify Support Request</h2>
        <p style="color: #94A3B8; font-size: 14px; margin-top: 0;">An inquiry was submitted via the Turfify live Contact Us page.</p>
        
        <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #10B981;">
          <p style="margin: 6px 0;"><strong>👤 Name:</strong> ${name}</p>
          <p style="margin: 6px 0;"><strong>✉️ Customer Email:</strong> <a href="mailto:${email}" style="color: #38BDF8; text-decoration: none;">${email || 'N/A'}</a></p>
          <p style="margin: 6px 0;"><strong>📞 Phone / WhatsApp:</strong> <a href="tel:${phone}" style="color: #38BDF8; text-decoration: none;">${phone || 'N/A'}</a></p>
          <p style="margin: 6px 0;"><strong>📌 Category:</strong> ${subject}</p>
        </div>

        <div style="background: rgba(16, 185, 129, 0.08); padding: 18px; border-radius: 10px; margin: 20px 0; border: 1px solid rgba(16, 185, 129, 0.2);">
          <h4 style="margin: 0 0 8px; color: #34D399; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Customer Message:</h4>
          <p style="margin: 0; white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #E2E8F0;">${message || 'No message provided'}</p>
        </div>

        <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748B; margin: 0;">Turfify Sports Infrastructure • Secured via Resend API • Delivered to: ${targetEmail}</p>
      </div>
    `
  });

  try {
    const result = await new Promise((resolve, reject) => {
      const rReq = https.request('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(resendPayload)
        }
      }, (rRes) => {
        let rBody = '';
        rRes.on('data', chunk => rBody += chunk);
        rRes.on('end', () => {
          try {
            resolve({ statusCode: rRes.statusCode, data: JSON.parse(rBody) });
          } catch (e) {
            resolve({ statusCode: rRes.statusCode, data: rBody });
          }
        });
      });

      rReq.on('error', (err) => reject(err));
      rReq.write(resendPayload);
      rReq.end();
    });

    const isSuccess = result.statusCode >= 200 && result.statusCode < 300;
    return res.status(200).json({
      success: isSuccess,
      emailSent: isSuccess,
      targetEmail,
      detail: result.data,
      message: isSuccess ? `Inquiry successfully sent to ${targetEmail}!` : `Resend reported status ${result.statusCode}`
    });
  } catch (error) {
    console.error('Vercel serverless contact error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to dispatch email'
    });
  }
};
