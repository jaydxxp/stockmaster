import { relations } from "drizzle-orm";

import {
  pgEnum,
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  numeric,
  primaryKey,
} from "drizzle-orm/pg-core";


export const userRoleEnum = pgEnum("user_role", ["ADMIN", "STAFF"]);

export const operationTypeEnum = pgEnum("operation_type", [
  "RECEIPT",
  "DELIVERY",
  "TRANSFER",
  "ADJUSTMENT",
]);

export const operationStatusEnum = pgEnum("operation_status", [
  "DRAFT",
  "WAITING",
  "READY",
  "DONE",
  "CANCELLED",
]);



export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  loginId: varchar("login_id", { length: 50 }).notNull().unique(), 
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull().default("STAFF"),

  resetOtpCode: varchar("reset_otp_code", { length: 6 }),
  resetOtpExpiresAt: timestamp("reset_otp_expires_at", {
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  operations: many(operations, { relationName: "operationsCreatedByUser" }),
}));

export const warehouses = pgTable("warehouses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  location: varchar("location", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const warehousesRelations = relations(warehouses, ({ many }) => ({
  stockLevels: many(stockLevels),
  operationsFrom: many(operations, { relationName: "operationsFromWarehouse" }),
  operationsTo: many(operations, { relationName: "operationsToWarehouse" }),
}));



export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 120 }),
  unitOfMeasure: varchar("unit_of_measure", { length: 50 }).notNull(), 
  reorderLevel: integer("reorder_level").notNull().default(0), 
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const productsRelations = relations(products, ({ many }) => ({
  stockLevels: many(stockLevels),
  operationItems: many(operationItems),
}));


import { uniqueIndex } from "drizzle-orm/pg-core";

export const stockLevels = pgTable(
  "stock_levels",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    warehouseId: integer("warehouse_id")
      .notNull()
      .references(() => warehouses.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    productWarehouseUnique: uniqueIndex(
      "stock_levels_product_warehouse_uid"
    ).on(table.productId, table.warehouseId),
  })
);

export const stockLevelsRelations = relations(stockLevels, ({ one }) => ({
  product: one(products, {
    fields: [stockLevels.productId],
    references: [products.id],
  }),
  warehouse: one(warehouses, {
    fields: [stockLevels.warehouseId],
    references: [warehouses.id],
  }),
}));


export const operations = pgTable("operations", {
  id: serial("id").primaryKey(),
  type: operationTypeEnum("type").notNull(), 
  status: operationStatusEnum("status").notNull().default("DRAFT"),

  
  fromWarehouseId: integer("from_warehouse_id").references(
    () => warehouses.id,
    { onDelete: "set null" }
  ),
  toWarehouseId: integer("to_warehouse_id").references(() => warehouses.id, {
    onDelete: "set null",
  }),

  createdByUserId: integer("created_by_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),

  externalRef: varchar("external_ref", { length: 150 }), 
  notes: text("notes"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const operationsRelations = relations(operations, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [operations.createdByUserId],
    references: [users.id],
    relationName: "operationsCreatedByUser",
  }),
  fromWarehouse: one(warehouses, {
    fields: [operations.fromWarehouseId],
    references: [warehouses.id],
    relationName: "operationsFromWarehouse",
  }),
  toWarehouse: one(warehouses, {
    fields: [operations.toWarehouseId],
    references: [warehouses.id],
    relationName: "operationsToWarehouse",
  }),
  items: many(operationItems),
}));


export const operationItems = pgTable("operation_items", {
  id: serial("id").primaryKey(),
  operationId: integer("operation_id")
    .notNull()
    .references(() => operations.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),

  quantity: integer("quantity").notNull(),

  previousQuantity: integer("previous_quantity"),
  notes: text("notes"),
});

export const operationItemsRelations = relations(operationItems, ({ one }) => ({
  operation: one(operations, {
    fields: [operationItems.operationId],
    references: [operations.id],
  }),
  product: one(products, {
    fields: [operationItems.productId],
    references: [products.id],
  }),
}));
