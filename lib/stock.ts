// lib/stock.ts
import { and, eq } from "drizzle-orm";
import { db, stockLevels, operationItems, operations } from "@/lib/db";

//Helper to get stock level

export async function getStockLevel(opts: {
  productId: number;
  warehouseId: number;
}) {
  const [row] = await db
    .select()
    .from(stockLevels)
    .where(
      and(
        eq(stockLevels.productId, opts.productId),
        eq(stockLevels.warehouseId, opts.warehouseId)
      )
    )
    .limit(1);

  return row ?? null;
}

export async function setStockLevel(opts: {
  productId: number;
  warehouseId: number;
  quantity: number;
}) {
  const existing = await getStockLevel(opts);

  if (!existing) {
    await db.insert(stockLevels).values({
      productId: opts.productId,
      warehouseId: opts.warehouseId,
      quantity: opts.quantity,
    });
  } else {
    await db
      .update(stockLevels)
      .set({
        quantity: opts.quantity,
        updatedAt: new Date(),
      })
      .where(eq(stockLevels.id, existing.id));
  }
}

export async function adjustStock(opts: {
  productId: number;
  warehouseId: number;
  delta: number; // positive or negative
}) {
  const existing = await getStockLevel(opts);
  const currentQty = existing?.quantity ?? 0;
  const newQty = currentQty + opts.delta;

  if (newQty < 0) {
    throw new Error(
      `Insufficient stock for product ${opts.productId} at warehouse ${opts.warehouseId}`
    );
  }

  await setStockLevel({
    productId: opts.productId,
    warehouseId: opts.warehouseId,
    quantity: newQty,
  });
}

async function getOperationWithItems(operationId: number) {
  const [operation] = await db
    .select()
    .from(operations)
    .where(eq(operations.id, operationId))
    .limit(1);

  if (!operation) {
    throw new Error(`Operation ${operationId} not found`);
  }

  const items = await db
    .select()
    .from(operationItems)
    .where(eq(operationItems.operationId, operationId));

  return { operation, items };
}

export async function applyReceipt(operationId: number) {
  const { operation, items } = await getOperationWithItems(operationId);

  if (operation.type !== "RECEIPT") {
    throw new Error("applyReceipt called on non-RECEIPT operation");
  }
  if (!operation.toWarehouseId) {
    throw new Error("Receipt must have toWarehouseId");
  }

  for (const item of items) {
    await adjustStock({
      productId: item.productId,
      warehouseId: operation.toWarehouseId,
      delta: item.quantity,
    });
  }

  await db
    .update(operations)
    .set({
      status: "DONE",
      updatedAt: new Date(),
    })
    .where(eq(operations.id, operationId));
}

export async function applyDelivery(operationId: number) {
  const { operation, items } = await getOperationWithItems(operationId);

  if (operation.type !== "DELIVERY") {
    throw new Error("applyDelivery called on non-DELIVERY operation");
  }
  if (!operation.fromWarehouseId) {
    throw new Error("Delivery must have fromWarehouseId");
  }

  for (const item of items) {
    await adjustStock({
      productId: item.productId,
      warehouseId: operation.fromWarehouseId,
      delta: -item.quantity,
    });
  }

  await db
    .update(operations)
    .set({
      status: "DONE",
      updatedAt: new Date(),
    })
    .where(eq(operations.id, operationId));
}

export async function applyTransfer(operationId: number) {
  const { operation, items } = await getOperationWithItems(operationId);

  if (operation.type !== "TRANSFER") {
    throw new Error("applyTransfer called on non-TRANSFER operation");
  }
  if (!operation.fromWarehouseId || !operation.toWarehouseId) {
    throw new Error("Transfer must have fromWarehouseId and toWarehouseId");
  }

  for (const item of items) {
    await adjustStock({
      productId: item.productId,
      warehouseId: operation.fromWarehouseId,
      delta: -item.quantity,
    });

    await adjustStock({
      productId: item.productId,
      warehouseId: operation.toWarehouseId,
      delta: item.quantity,
    });
  }

  await db
    .update(operations)
    .set({
      status: "DONE",
      updatedAt: new Date(),
    })
    .where(eq(operations.id, operationId));
}

export async function applyAdjustment(operationId: number) {
  const { operation, items } = await getOperationWithItems(operationId);

  if (operation.type !== "ADJUSTMENT") {
    throw new Error("applyAdjustment called on non-ADJUSTMENT operation");
  }
  if (!operation.toWarehouseId && !operation.fromWarehouseId) {
    throw new Error("Adjustment must specify warehouse (toWarehouseId)");
  }

  const warehouseId = operation.toWarehouseId ?? operation.fromWarehouseId!;

  for (const item of items) {
    const existing = await getStockLevel({
      productId: item.productId,
      warehouseId,
    });

    const previous = existing?.quantity ?? 0;
    const newQty = item.quantity;

    await setStockLevel({
      productId: item.productId,
      warehouseId,
      quantity: newQty,
    });

    await db
      .update(operationItems)
      .set({ previousQuantity: previous })
      .where(eq(operationItems.id, item.id));
  }

  await db
    .update(operations)
    .set({
      status: "DONE",
      updatedAt: new Date(),
    })
    .where(eq(operations.id, operationId));
}

export async function applyOperation(operationId: number) {
  const [op] = await db
    .select({ id: operations.id, type: operations.type })
    .from(operations)
    .where(eq(operations.id, operationId))
    .limit(1);

  if (!op) throw new Error("Operation not found");

  switch (op.type) {
    case "RECEIPT":
      return applyReceipt(operationId);
    case "DELIVERY":
      return applyDelivery(operationId);
    case "TRANSFER":
      return applyTransfer(operationId);
    case "ADJUSTMENT":
      return applyAdjustment(operationId);
    default:
      throw new Error(`Unknown operation type: ${op.type}`);
  }
}
