import { pgTable, uuid, varchar, text, numeric, integer, boolean, timestamp, jsonb, smallint, pgEnum } from 'drizzle-orm/pg-core';

// Enums PostgreSQL
export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN']);
export const productStatusEnum = pgEnum('product_status', ['ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED']);
export const orderStatusEnum = pgEnum('order_status', [
  'CREATED',
  'PAID',
  'PREPARING',
  'IN_TRANSIT',
  'DELIVERED',
  'COMPLETED',
  'DISPUTED',
  'CANCELLED',
  'REFUNDED'
]);
export const deliveryModeEnum = pgEnum('delivery_mode', ['PICKUP', 'SELLER_DELIVERY', 'THIRD_PARTY']);
export const transactionTypeEnum = pgEnum('transaction_type', ['ESCROW_DEPOSIT', 'PAYOUT_SELLER', 'REFUND_BUYER', 'PLATFORM_FEE']);
export const transactionStatusEnum = pgEnum('transaction_status', ['PENDING', 'SUCCESS', 'FAILED']);
export const disputeReasonEnum = pgEnum('dispute_reason', ['ITEM_NOT_RECEIVED', 'NOT_AS_DESCRIBED', 'DAMAGED', 'WRONG_ITEM', 'OTHER']);
export const disputeStatusEnum = pgEnum('dispute_status', ['OPEN', 'UNDER_REVIEW', 'RESOLVED_REFUND', 'RESOLVED_PAYOUT', 'REJECTED']);

// 1. Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull().unique(),
  fullName: varchar('full_name', { length: 120 }).notNull(),
  avatarUrl: text('avatar_url'),
  city: varchar('city', { length: 80 }).notNull(),
  district: varchar('district', { length: 100 }),
  role: userRoleEnum('role').default('USER').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Seller Profiles Table
export const sellerProfiles = pgTable('seller_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  businessName: varchar('business_name', { length: 120 }).notNull(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  bio: text('bio'),
  logoUrl: text('logo_url'),
  isVerified: boolean('is_verified').default(false).notNull(),
  ratingAvg: numeric('rating_avg', { precision: 3, scale: 2 }).default('0.00').notNull(),
  ratingCount: integer('rating_count').default(0).notNull(),
  totalSalesCount: integer('total_sales_count').default(0).notNull(),
  payoutMethod: varchar('payout_method', { length: 50 }).default('MOBILE_MONEY').notNull(),
  payoutAccountNumber: varchar('payout_account_number', { length: 50 }).notNull(),
  payoutAccountName: varchar('payout_account_name', { length: 120 }),
  latitude: numeric('latitude', { precision: 10, scale: 7 }),
  longitude: numeric('longitude', { precision: 10, scale: 7 }),
  address: text('address'),
  category: varchar('category', { length: 80 }).default('Général'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Products Table
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  sellerId: uuid('seller_id').notNull().references(() => sellerProfiles.id, { onDelete: 'cascade' }),
  shortCode: varchar('short_code', { length: 12 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('XOF').notNull(),
  stockQuantity: integer('stock_quantity').default(1).notNull(),
  images: jsonb('images').default('[]').notNull(),
  videos: jsonb('videos').default('[]').notNull(),
  city: varchar('city', { length: 80 }).notNull(),
  district: varchar('district', { length: 100 }),
  latitude: numeric('latitude', { precision: 10, scale: 7 }),
  longitude: numeric('longitude', { precision: 10, scale: 7 }),
  address: text('address'),
  category: varchar('category', { length: 80 }).default('Général'),
  status: productStatusEnum('status').default('ACTIVE').notNull(),
  viewsCount: integer('views_count').default(0).notNull(),
  sharesCount: integer('shares_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3.1 Media Table (Images & Vidéos avec métadonnées)
export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: text('url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  type: varchar('type', { length: 20 }).notNull(), // 'IMAGE' | 'VIDEO'
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  width: integer('width'),
  height: integer('height'),
  durationSeconds: integer('duration_seconds'),
  isPrimary: boolean('is_primary').default(false).notNull(),
  orderIndex: integer('order_index').default(0).notNull(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }),
  entityType: varchar('entity_type', { length: 50 }), // 'PRODUCT' | 'USER_AVATAR' | 'SHOP_LOGO' ...
  entityId: uuid('entity_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Orders Table
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: varchar('order_number', { length: 20 }).notNull().unique(),
  buyerId: uuid('buyer_id').notNull().references(() => users.id),
  sellerId: uuid('seller_id').notNull().references(() => sellerProfiles.id),
  productId: uuid('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').default(1).notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  deliveryFee: numeric('delivery_fee', { precision: 12, scale: 2 }).default('0.00').notNull(),
  platformFee: numeric('platform_fee', { precision: 12, scale: 2 }).default('0.00').notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('XOF').notNull(),
  status: orderStatusEnum('status').default('CREATED').notNull(),
  deliveryMode: deliveryModeEnum('delivery_mode').default('SELLER_DELIVERY').notNull(),
  deliveryAddress: jsonb('delivery_address').notNull(),
  buyerNotes: text('buyer_notes'),
  
  paidAt: timestamp('paid_at', { withTimezone: true }),
  inTransitAt: timestamp('in_transit_at', { withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  autoReleaseAt: timestamp('auto_release_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 5. Transactions Table
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id),
  transactionRef: varchar('transaction_ref', { length: 100 }).notNull().unique(),
  gateway: varchar('gateway', { length: 50 }).notNull(),
  gatewayTransactionId: varchar('gateway_transaction_id', { length: 100 }),
  type: transactionTypeEnum('type').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  feeAmount: numeric('fee_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
  currency: varchar('currency', { length: 3 }).default('XOF').notNull(),
  status: transactionStatusEnum('status').default('PENDING').notNull(),
  idempotencyKey: varchar('idempotency_key', { length: 100 }).notNull().unique(),
  rawPayload: jsonb('raw_payload'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 6. Reviews Table
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().unique().references(() => orders.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetSellerId: uuid('target_seller_id').notNull().references(() => sellerProfiles.id, { onDelete: 'cascade' }),
  rating: smallint('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 7. Disputes Table
export const disputes = pgTable('disputes', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().unique().references(() => orders.id),
  raisedBy: uuid('raised_by').notNull().references(() => users.id),
  reason: disputeReasonEnum('reason').notNull(),
  description: text('description').notNull(),
  evidenceUrls: jsonb('evidence_urls').default('[]'),
  status: disputeStatusEnum('status').default('OPEN').notNull(),
  resolutionNotes: text('resolution_notes'),
  resolvedBy: uuid('resolved_by').references(() => users.id),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
