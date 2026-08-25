export type UserRole = 'USER' | 'ADMIN';

export type ProductStatus = 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';

export type OrderStatus =
  | 'CREATED'     // En attente de paiement
  | 'PAID'        // Paiement séquestré par Zarén
  | 'PREPARING'   // Vendeur prépare la commande
  | 'IN_TRANSIT'  // En cours de livraison / prêt au retrait
  | 'DELIVERED'   // Livré / remis, confirmation acheteur requise
  | 'COMPLETED'   // Validé par acheteur, fonds débloqués au vendeur
  | 'DISPUTED'    // Litige ouvert, fonds gelés
  | 'CANCELLED'   // Annulé
  | 'REFUNDED';   // Remboursé

export type DeliveryMode = 'PICKUP' | 'SELLER_DELIVERY' | 'THIRD_PARTY';

export type PaymentGateway = 'WAVE' | 'ORANGE_MONEY' | 'MTN_MOMO' | 'AIRTEL_MONEY' | 'MOOV_MONEY' | 'STRIPE' | 'CARD';

export type TransactionType = 'ESCROW_DEPOSIT' | 'PAYOUT_SELLER' | 'REFUND_BUYER' | 'PLATFORM_FEE';

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export type MediaType = 'IMAGE' | 'VIDEO';

export type MediaEntityType = 'PRODUCT' | 'USER_AVATAR' | 'USER_BANNER' | 'SHOP_LOGO' | 'SHOP_BANNER' | 'SHOP_GALLERY';

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: MediaType;
  mimeType: string;
  name: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  durationSeconds?: number;
  isPrimary?: boolean;
  orderIndex: number;
  ownerId?: string;
  entityType?: MediaEntityType;
  entityId?: string;
  createdAt: string;
}

export interface MediaUploadProgress {
  fileId: string;
  fileName: string;
  fileSize: number;
  type: MediaType;
  progress: number; // 0 to 100
  status: 'PENDING' | 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  errorMessage?: string;
  previewUrl?: string;
  resultMedia?: MediaItem;
}

export type AccountTier = 'STANDARD' | 'PRO';

export interface User {
  id: string;
  email?: string;
  phoneNumber: string;
  isPhoneVerified?: boolean;
  fullName: string;
  username?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  country?: string;
  city: string;
  district?: string;
  role: UserRole;
  isActive: boolean;
  account_tier?: AccountTier;
  plan: SubscriptionPlan;
  planExpiresAt?: string;
  ratingAvg?: number;
  ratingCount?: number;
  completedSalesCount?: number;
  completedPurchasesCount?: number;
  disputeRatePercent?: number;
  galleryMedia?: MediaItem[];
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  businessName: string;
  username?: string;
  slug: string;
  bio?: string;
  logoUrl?: string;
  bannerUrl?: string;
  isVerified: boolean;
  account_tier?: AccountTier;
  plan?: SubscriptionPlan;
  ratingAvg: number;
  ratingCount: number;
  totalSalesCount: number;
  completedSalesCount?: number;
  disputeRatePercent?: number;
  payoutMethod: PaymentGateway;
  payoutAccountNumber: string;
  payoutAccountName?: string;
  responseTimeMinutes?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  country?: string;
  city?: string;
  district?: string;
  category?: string;
  shopMedia?: MediaItem[];
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  shortCode: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition?: string; // 'Neuf avec étiquette' | 'Très bon état' | 'Bon état' | 'Satisfaisant'
  size?: string; // 'S' | 'M' | 'L' | 'XL' | '38' | '42' ...
  brand?: string;
  stockQuantity: number;
  images: string[];
  videos?: string[];
  media?: MediaItem[];
  city: string;
  district?: string;
  deliveryFee: number;
  pickupAvailable: boolean;
  status: ProductStatus;
  viewsCount: number;
  sharesCount: number;
  category?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  createdAt: string;
  seller?: SellerProfile;
}

export interface ShopLocation {
  id: string;
  name: string;
  photo: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  district?: string;
  category: string;
  rating: number;
  reviewCount: number;
  description: string;
  phone?: string;
  isVerified?: boolean;
  isOpen?: boolean;
  distanceKm?: number;
}

export interface MapFilterState {
  searchQuery: string;
  category: string;
  radiusKm: number;
  minRating: number;
  onlyVerified: boolean;
}

export interface DeliveryAddress {
  fullName?: string;
  city: string;
  district: string;
  phone: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  deliveryFee: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  deliveryMode: DeliveryMode;
  deliveryAddress: DeliveryAddress;
  buyerNotes?: string;
  
  // Timeline dates
  createdAt: string;
  paidAt?: string;
  preparingAt?: string;
  inTransitAt?: string;
  deliveredAt?: string;
  autoReleaseAt?: string;
  completedAt?: string;
  disputedAt?: string;
  cancelledAt?: string;
  
  product?: Product;
  seller?: SellerProfile;
  buyer?: User;
}

export interface Transaction {
  id: string;
  orderId: string;
  transactionRef: string;
  gateway: PaymentGateway;
  gatewayTransactionId?: string;
  type: TransactionType;
  amount: number;
  feeAmount: number;
  currency: string;
  status: TransactionStatus;
  idempotencyKey: string;
  createdAt: string;
}

export type SubscriptionPlan = 'PRO' | 'PER_LISTING' | 'STANDARD';

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED';

export interface ProductOffer {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  originalPrice: number;
  offeredPrice: number;
  counterPrice?: number;
  currency: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  sellerId: string;
  sellerName?: string;
  status: OfferStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  attachmentUrl?: string;
  offerId?: string;
  isSystem?: boolean;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: {
    id: string;
    name: string;
    avatar?: string;
    phone?: string;
    isPro?: boolean;
    isVerified?: boolean;
  }[];
  productId?: string;
  productTitle?: string;
  productPrice?: number;
  productImage?: string;
  offerId?: string;
  currentOffer?: ProductOffer;
  lastMessage?: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Review {
  id: string;
  orderId?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  targetSellerId: string;
  rating: number; // 1 to 5
  comment?: string;
  productTitle?: string;
  verifiedPurchase?: boolean;
  createdAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  raisedBy: string;
  reason: 'ITEM_NOT_RECEIVED' | 'NOT_AS_DESCRIBED' | 'DAMAGED' | 'WRONG_ITEM' | 'OTHER';
  description: string;
  evidenceUrls: string[];
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED_REFUND' | 'RESOLVED_PAYOUT' | 'REJECTED';
  resolutionNotes?: string;
  createdAt: string;
}
