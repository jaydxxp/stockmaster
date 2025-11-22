import { NextResponse } from "next/server";
import { db, operations, operationItems, warehouses, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    
    const rows = await db
      .select({
        id: operations.id,
        type: operations.type,
        status: operations.status,
        fromWarehouseId: operations.fromWarehouseId,
        toWarehouseId: operations.toWarehouseId,
        createdByUserId: operations.createdByUserId,
        externalRef: operations.externalRef,
        notes: operations.notes,
        createdAt: operations.createdAt,
       
        contact: users.name,
      })
      .from(operations)
      .leftJoin(users, eq(users.id, operations.createdByUserId))
      .where(eq(operations.type, "RECEIPT"));

    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("Fetch receipts error:", err);
    return NextResponse.json({ error: err?.message ?? "Failed to fetch receipts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { toWarehouseId, items, notes } = body;

    if (!toWarehouseId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const wh = await db
      .select()
      .from(warehouses)
      .where(eq(warehouses.id, Number(toWarehouseId)))
      .limit(1);

    if (!wh || wh.length === 0) {
      return NextResponse.json({ error: "Destination warehouse not found" }, { status: 400 });
    }

    const [op] = await db
      .insert(operations)
      .values({
        type: "RECEIPT",
        status: "DRAFT",
        fromWarehouseId: null,
        toWarehouseId: Number(toWarehouseId),
        createdByUserId: Number(session.user?.id ?? null),
        notes: notes ?? null,
      })
      .returning();

   
    for (const it of items) {
      await db.insert(operationItems).values({
        operationId: op.id,
        productId: Number(it.productId),
        quantity: Number(it.quantity),
        notes: it.notes ?? null,
      });
    }

    return NextResponse.json({ success: true, id: op.id }, { status: 201 });
  } catch (err: any) {
    console.error("Create receipt error:", err);

  
    if (err?.cause?.code === "23503" || err?.code === "23503") {
      return NextResponse.json(
        { error: "Referenced record not found (foreign key violation)" },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: err?.message ?? "Internal Server Error" }, { status: 500 });
  }
}
