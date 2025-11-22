
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

  
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  

  
  if (!user) {
    
    return NextResponse.json(
      { error: "No user found with this email" },
      { status: 404 }
    );
  }

 
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 


  await db
    .update(users)
    .set({
      resetOtpCode: otp,
      resetOtpExpiresAt: expiresAt,
    })
    .where(eq(users.id, user.id));

 
  await sendPasswordResetOtpEmail({ email, otp });

  return NextResponse.json({ success: true });
}
