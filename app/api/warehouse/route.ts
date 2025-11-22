
import { NextResponse } from "next/server";
import { db, warehouses } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {


  const rows = await db.select().from(warehouses);
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  

  const body = await req.json();
  const { name, code, location } = body;

  if (!name || !code) {
    return NextResponse.json(
      { error: "name and code are required" },
      { status: 400 }
    );
  }

  const [wh] = await db
    .insert(warehouses)
    .values({
      name,
      code,
      location: location ?? null,
    })
    .returning();

  return NextResponse.json(wh, { status: 201 });
}
