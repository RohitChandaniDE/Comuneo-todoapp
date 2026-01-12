import { Resend } from 'resend';

export default async ({ req, res, log, error }) => {
  const user = req.body;

  log(`New user registered: ${user.email}`);

  // eslint-disable-next-line no-undef
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    error('RESEND_API_KEY environment variable is not set');
    return res.json({
      success: false,
      message: 'Email service not configured',
    });
  }

  const resend = new Resend(resendApiKey);
  // eslint-disable-next-line no-undef
  const appUrl = process.env.APP_URL || 'https://comuneo-todoapp.vercel.app';

  try {
    const { data, error: sendError } = await resend.emails.send({
      from: 'Comuneo Todo <onboarding@resend.dev>',
      to: user.email,
      subject: 'Welcome to Comuneo Todo! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header { text-align: center; padding: 20px 0; }
              .header h1 { color: #6366f1; margin: 0; }
              .content {
                background-color: #f8fafc;
                border-radius: 8px;
                padding: 30px;
                margin: 20px 0;
              }
              .button {
                display: inline-block;
                background-color: #6366f1;
                color: white;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 6px;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                color: #64748b;
                font-size: 14px;
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>📝 Comuneo Todo</h1>
            </div>
            <div class="content">
              <h2>Welcome aboard! 🎉</h2>
              <p>Hi${user.name ? ` ${user.name}` : ''},</p>
              <p>Thank you for signing up for <strong>Comuneo Todo</strong> — your new recursive task manager!</p>
              <p>With Comuneo Todo, you can:</p>
              <ul>
                <li>✅ Create tasks and organize your work</li>
                <li>🔄 Add unlimited nested sub-tasks</li>
                <li>📱 Access your tasks from anywhere</li>
              </ul>
              <p>Ready to get started?</p>
              <a href="${appUrl}/todos" class="button">
                Start Adding Tasks
              </a>
            </div>
            <div class="footer">
              <p>Happy organizing!</p>
              <p>— The Comuneo Todo Team</p>
            </div>
          </body>
        </html>
      `,
    });

    if (sendError) {
      error(`Failed to send email: ${sendError.message}`);
      return res.json({
        success: false,
        message: sendError.message,
      });
    }

    log(`Welcome email sent successfully to ${user.email}`);

    return res.json({
      success: true,
      message: `Welcome email sent to ${user.email}`,
      emailId: data?.id,
    });
  } catch (err) {
    error(`Error sending email: ${err.message}`);
    return res.json({
      success: false,
      message: err.message,
    });
  }
};