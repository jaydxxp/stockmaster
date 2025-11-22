
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetOtpEmail(opts: {
  email: string;
  otp: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    
    console.log(`Password reset OTP for ${opts.email}: ${opts.otp}`);
    return;
  }

  await resend.emails.send({
    from: "StockMaster <no-reply@yourapp.com>",
    to: opts.email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${opts.otp}. It will expire in 10 minutes.`,
  });
}
