// app/api/operations/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, operations, operationItems } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type, fromWarehouseId, toWarehouseId, items, notes } = body;

  if (!type || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "type and at least one item are required" },
      { status: 400 }
    );
  }

  // Very basic business validation (you can expand later)
  if (type === "RECEIPT" && !toWarehouseId) {
    return NextResponse.json(
      { error: "Receipt requires toWarehouseId" },
      { status: 400 }
    );
  }
  if (type === "DELIVERY" && !fromWarehouseId) {
    return NextResponse.json(
      { error: "Delivery requires fromWarehouseId" },
      { status: 400 }
    );
  }
  if (type === "TRANSFER" && (!fromWarehouseId || !toWarehouseId)) {
    return NextResponse.json(
      { error: "Transfer requires fromWarehouseId and toWarehouseId" },
      { status: 400 }
    );
  }

  const [op] = await db
    .insert(operations)
    .values({
      type,
      status: "DRAFT",
      fromWarehouseId: fromWarehouseId ?? null,
      toWarehouseId: toWarehouseId ?? null,
      createdByUserId: Number(session.user.id),
      notes: notes ?? null,
    })
    .returning();

    await db.insert(operationItems).values(
      
    items.map((item: any) => ({
      operationId: op.id,
      productId: item.productId,
      quantity: item.quantity,
      notes: item.notes ?? null,
    }))
  );

  return NextResponse.json(
    { operationId: op.id, operation: op },
    { status: 201 }
  );
}
