 import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, operations, operationItems, warehouses } from "@/lib/db";
import { and, eq, sql } from "drizzle-orm";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
//   const status = searchParams.get("status"); // optional filter
  const warehouseId = searchParams.get("warehouseId");

  const whereClauses = [eq(operations.type, "RECEIPT" as const)];

//   if (status) {
    
//     whereClauses.push(eq(operations.status, status));
//   }
  if (warehouseId) {
    whereClauses.push(eq(operations.toWarehouseId, Number(warehouseId)));
  }

  const rows = await db
    .select({
      id: operations.id,
      status: operations.status,
      toWarehouseId: operations.toWarehouseId,
      warehouseName: warehouses.name,
      createdAt: operations.createdAt,
      itemsCount: sql<number>`COUNT(${operationItems.id})`,
    })
    .from(operations)
    .leftJoin(warehouses, eq(warehouses.id, operations.toWarehouseId))
    .leftJoin(operationItems, eq(operationItems.operationId, operations.id))
    .where(and(...whereClauses))
    .groupBy(operations.id, warehouses.name)
    .orderBy(sql`"created_at" DESC`);

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { toWarehouseId, items, notes } = body;

  if (!toWarehouseId) {
    return NextResponse.json(
      { error: "toWarehouseId is required" },
      { status: 400 }
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "At least one item is required" },
      { status: 400 }
    );
  }

  // Minimal validation of items
  for (const item of items) {
    if (!item.productId || !item.quantity || item.quantity <= 0) {
      return NextResponse.json(
        { error: "Each item must have productId and positive quantity" },
        { status: 400 }
      );
    }
  }

  // Create DRAFT receipt operation
  const [op] = await db
    .insert(operations)
    .values({
      type: "RECEIPT",
      status: "DRAFT",
      fromWarehouseId: null,
      toWarehouseId,
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
