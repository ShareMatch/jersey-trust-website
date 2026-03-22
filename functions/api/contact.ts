interface Env {
  // No bindings needed for basic mailto
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const origin = context.request.headers.get('Origin') || '';
  const allowedOrigins = ['https://new.jerseytrust.ae', 'https://jerseytrust.ae', 'http://localhost:4321'];

  if (!allowedOrigins.some((o) => origin.startsWith(o))) {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const body = await context.request.json() as {
      name?: string;
      email?: string;
      phone?: string;
      service?: string;
      message?: string;
    };

    const { name, email, phone, service, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send via MailChannels (free for Cloudflare Workers)
    const mailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              { email: 'info@jerseytrust.ae', name: 'Jersey Trust' },
            ],
            cc: [
              { email: 'nr@jerseytrust.ae', name: 'Nigel' },
            ],
          },
        ],
        from: {
          email: 'noreply@jerseytrust.ae',
          name: 'Jersey Trust Website',
        },
        reply_to: {
          email: email.trim(),
          name: name.trim(),
        },
        subject: `New Enquiry: ${name.trim()}${service ? ` - ${service}` : ''}`,
        content: [
          {
            type: 'text/plain',
            value: [
              `Name: ${name.trim()}`,
              `Email: ${email.trim()}`,
              phone?.trim() ? `Phone: ${phone.trim()}` : null,
              service ? `Service: ${service}` : null,
              '',
              'Message:',
              message.trim(),
              '',
              '---',
              'Sent from jerseytrust.ae contact form',
            ]
              .filter(Boolean)
              .join('\n'),
          },
        ],
      }),
    });

    if (mailResponse.status === 202 || mailResponse.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
        },
      });
    }

    // Fallback: log the enquiry so it's not lost
    console.error('MailChannels failed:', mailResponse.status, await mailResponse.text());

    return new Response(JSON.stringify({ error: 'Failed to send' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async (context) => {
  const origin = context.request.headers.get('Origin') || '';
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};
