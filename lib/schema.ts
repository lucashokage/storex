import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  shade: text("shade"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
})

export const productColors = sqliteTable("product_colors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  name: text("name").notNull(),
  colorCode: text("color_code").notNull(),
})

export const cartItems = sqliteTable("cart_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  colorId: integer("color_id").references(() => productColors.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
})

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  total: real("total").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
})

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
  colorId: integer("color_id").references(() => productColors.id),
})

// Relaciones
export const productsRelations = relations(products, ({ many }) => ({
  colors: many(productColors),
  cartItems: many(cartItems),
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  color: one(productColors, {
    fields: [cartItems.colorId],
    references: [productColors.id],
  }),
}))

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  color: one(productColors, {
    fields: [orderItems.colorId],
    references: [productColors.id],
  }),
}))
