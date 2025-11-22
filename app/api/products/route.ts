
import { NextResponse } from "next/server";
import { db, products, stockLevels } from "@/lib/db";
import { auth } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      category: products.category,
      unitOfMeasure: products.unitOfMeasure,
      reorderLevel: products.reorderLevel,
      isActive: products.isActive,
      totalStock: sql<number>`COALESCE(SUM(${stockLevels.quantity}), 0)`,
    })
    .from(products)
    .leftJoin(stockLevels, eq(stockLevels.productId, products.id))
    .groupBy(products.id);

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, sku, category, unitOfMeasure, reorderLevel } = body;

  if (!name || !sku || !unitOfMeasure) {
    return NextResponse.json(
      { error: "name, sku and unitOfMeasure are required" },
      { status: 400 }
    );
  }

  const [product] = await db
    .insert(products)
    .values({
      name,
      sku,
      category: category ?? null,
      unitOfMeasure,
      reorderLevel: reorderLevel ?? 0,
    })
    .returning();

  return NextResponse.json(product, { status: 201 });
}
