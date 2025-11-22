// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { sendPasswordResetOtpEmail } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json();
  const email = body?.email as string | undefined;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Find user with this email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // For security, don't reveal whether email exists.
  // But for hackathon it's okay to be explicit if you want.
  if (!user) {
    // You can either:
    // 1) still return success to avoid email enumeration
    //    return NextResponse.json({ success: true });
    // or 2) show an error for UX
    return NextResponse.json(
      { error: "No user found with this email" },
      { status: 404 }
    );
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save OTP + expiry
  await db
    .update(users)
    .set({
      resetOtpCode: otp,
      resetOtpExpiresAt: expiresAt,
    })
    .where(eq(users.id, user.id));

  // Send email
  await sendPasswordResetOtpEmail({ email, otp });

  return NextResponse.json({ success: true });
}
