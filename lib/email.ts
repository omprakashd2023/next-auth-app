import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email",
    html: `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
              <tr>
                  <td align="center" style="padding: 20px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                          <tr>
                              <td style="text-align: center; padding: 20px 0;">
                                  <h1 style="font-size: 28px; background: linear-gradient(to right, #ef4444, #f97316); color: transparent; background-clip:text; margin-bottom: 20px;">Verify Your Email</h1>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 20px;">
                                  <p style="font-size: 16px;">Hi, <strong>${name}</strong>,</p>
                                  <p style="font-size: 16px;">You need to verify your email, to login. Please click the below button to verify your email.</p>
                                  <div style="text-align: center; margin-top: 20px;">
                                      <a href=${verificationLink} style="text-decoration: none; display: inline-block; background: linear-gradient(to right, #ef4444, #f97316); color: #fff; font-size: 18px; padding: 10px 20px; border-radius: 5px;">Verify Email</a>
                                  </div>
                                  <p style="font-size: 16px; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
                                  <p style="font-size: 16px;">Regards,<br>Admin</p>
                              </td>
                          </tr>
                          <tr>
                              <td style="background-color: #eee; padding: 10px 20px; text-align: center; font-size: 14px;">
                                  This email was sent from Auth App. &copy; 2024
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </div>`,
  });
};
