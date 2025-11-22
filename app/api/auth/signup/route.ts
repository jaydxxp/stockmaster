// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db, users } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import { signupSchema } from "@/lib/validation/auth";

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { loginId, name, email, password } = parsed.data;

  
  const existing = await db
    .select()
    .from(users)
    .where(or(eq(users.loginId, loginId), eq(users.email, email)));

  if (existing.length > 0) {
    const conflict = existing[0];
    if (conflict.loginId === loginId) {
      return NextResponse.json(
        { error: "Login ID already exists" },
        { status: 400 }
      );
    }
    if (conflict.email === email) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    // fallback
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    loginId,
    name,
    email,
    passwordHash,
    role: "STAFF", // or ADMIN for first user
  });

  return NextResponse.json({ success: true });
}
