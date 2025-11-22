
import { NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { resetPasswordSchema } from "@/lib/validation/auth";

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, otp, newPassword } = parsed.data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or OTP" },
      { status: 400 }
    );
  }


  if (!user.resetOtpCode || !user.resetOtpExpiresAt) {
    return NextResponse.json({ error: "OTP not requested" }, { status: 400 });
  }

  const now = new Date();

  if (user.resetOtpCode !== otp) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  if (user.resetOtpExpiresAt < now) {
    return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
  }

  const newHash = await bcrypt.hash(newPassword, 10);

  await db
    .update(users)
    .set({
      passwordHash: newHash,
      resetOtpCode: null,
      resetOtpExpiresAt: null,
    })
    .where(eq(users.id, user.id));

  return NextResponse.json({ success: true });
}
