// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, products, stockLevels, operations } from "@/lib/db";
import { and, eq, ne, sql } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // total stock (sum of all quantities)
  const [{ totalStock }] = await db
    .select({
      totalStock: sql<number>`COALESCE(SUM(${stockLevels.quantity}), 0)`,
    })
    .from(stockLevels);

  // low stock count (products where total qty <= reorderLevel)
  const lowStockRows = await db
    .select({
      productId: products.id,
      totalQty: sql<number>`COALESCE(SUM(${stockLevels.quantity}), 0)`,
      reorderLevel: products.reorderLevel,
    })
    .from(products)
    .leftJoin(stockLevels, eq(stockLevels.productId, products.id))
    .groupBy(products.id, products.reorderLevel);

  const lowStockCount = lowStockRows.filter(
    (row) => row.totalQty <= row.reorderLevel && row.reorderLevel > 0
  ).length;

  // pending receipts / deliveries / transfers
  const [pendingReceipts] = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(operations)
    .where(and(eq(operations.type, "RECEIPT"), ne(operations.status, "DONE")));

  const [pendingDeliveries] = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(operations)
    .where(and(eq(operations.type, "DELIVERY"), ne(operations.status, "DONE")));

  const [pendingTransfers] = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(operations)
    .where(and(eq(operations.type, "TRANSFER"), ne(operations.status, "DONE")));

  // recent operations
  const recentOps = await db
    .select({
      id: operations.id,
      type: operations.type,
      status: operations.status,
      createdAt: operations.createdAt,
    })
    .from(operations)
    .orderBy(sql`"created_at" DESC`)
    .limit(10);

  return NextResponse.json({
    totalStock,
    lowStockCount,
    pendingReceipts: pendingReceipts?.count ?? 0,
    pendingDeliveries: pendingDeliveries?.count ?? 0,
    pendingTransfers: pendingTransfers?.count ?? 0,
    recentOperations: recentOps,
  });
}
