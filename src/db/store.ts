import { Product, Order, Review, Dispute, SellerProfile, OrderStatus, Conversation, Message, ProductOffer } from '@/types';
import { EscrowStateMachine } from '@/lib/escrow/stateMachine';

const DEFAULT_SELLER_PROFILE: SellerProfile = {
  id: 'usr_seller_main',
  userId: 'usr_seller_main',
  businessName: 'Boutique ZARÉN',
  username: '@boutique_zaren',
  slug: 'boutique-zaren',
  bio: 'Vendeur officiel sur ZARÉN avec séquestre Mobile Money certifié.',
  logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  isVerified: true,
  account_tier: 'STANDARD',
  plan: 'STANDARD',
  ratingAvg: 5.0,
  ratingCount: 0,
  totalSalesCount: 0,
  completedSalesCount: 0,
  disputeRatePercent: 0,
  payoutMethod: 'AIRTEL_MONEY',
  payoutAccountNumber: '+241 07 00 00 00',
  payoutAccountName: 'Compte Vendeur ZARÉN',
  city: 'Libreville',
  district: 'Centre',
  country: 'Gabon',
  address: 'Libreville, Gabon',
  shopHours: '08h30 - 19h00',
  whatsapp: '+241 07 00 00 00',
  createdAt: new Date().toISOString(),
};

class ZarénStore {
  private products: Product[] = [];
  private orders: Order[] = [];
  private reviews: Review[] = [];
  private disputes: Dispute[] = [];
  private conversations: Conversation[] = [];
  private messages: Message[] = [];
  private offers: ProductOffer[] = [];
  private seller: SellerProfile = DEFAULT_SELLER_PROFILE;
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined') {
      const storedProducts = localStorage.getItem('zaren_products');
      const storedOrders = localStorage.getItem('zaren_orders');
      const storedReviews = localStorage.getItem('zaren_reviews');
      const storedDisputes = localStorage.getItem('zaren_disputes');
      const storedConversations = localStorage.getItem('zaren_conversations');
      const storedMessages = localStorage.getItem('zaren_messages');
      const storedOffers = localStorage.getItem('zaren_offers');
      const storedSeller = localStorage.getItem('zaren_seller_profile');

      this.products = storedProducts ? JSON.parse(storedProducts) : [];
      this.orders = storedOrders ? JSON.parse(storedOrders) : [];
      this.reviews = storedReviews ? JSON.parse(storedReviews) : [];
      this.disputes = storedDisputes ? JSON.parse(storedDisputes) : [];
      this.conversations = storedConversations ? JSON.parse(storedConversations) : [];
      this.messages = storedMessages ? JSON.parse(storedMessages) : [];
      this.offers = storedOffers ? JSON.parse(storedOffers) : [];
      this.seller = storedSeller ? JSON.parse(storedSeller) : DEFAULT_SELLER_PROFILE;
    } else {
      this.products = [];
      this.orders = [];
      this.reviews = [];
      this.disputes = [];
      this.conversations = [];
      this.messages = [];
      this.offers = [];
    }
    this.initialized = true;
  }

  private persist() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zaren_products', JSON.stringify(this.products));
      localStorage.setItem('zaren_orders', JSON.stringify(this.orders));
      localStorage.setItem('zaren_reviews', JSON.stringify(this.reviews));
      localStorage.setItem('zaren_disputes', JSON.stringify(this.disputes));
      localStorage.setItem('zaren_conversations', JSON.stringify(this.conversations));
      localStorage.setItem('zaren_messages', JSON.stringify(this.messages));
      localStorage.setItem('zaren_offers', JSON.stringify(this.offers));
      localStorage.setItem('zaren_seller_profile', JSON.stringify(this.seller));
    }
  }

  // ===================== PRODUCTS =====================
  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getProductByCode(shortCode: string): Product | undefined {
    return this.products.find(p => p.shortCode.toLowerCase() === shortCode.toLowerCase());
  }

  addProduct(product: Omit<Product, 'id' | 'createdAt' | 'viewsCount' | 'sharesCount' | 'status'> & { status?: any }): Product {
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      status: product.status || 'ACTIVE',
      viewsCount: 1,
      sharesCount: 0,
      createdAt: new Date().toISOString(),
      seller: this.seller,
    };
    this.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  updateProductStatus(id: string, status: any): Product | undefined {
    const prod = this.getProductById(id);
    if (prod) {
      prod.status = status;
      this.persist();
    }
    return prod;
  }

  incrementViews(productId: string) {
    const prod = this.getProductById(productId);
    if (prod) {
      prod.viewsCount += 1;
      this.persist();
    }
  }

  incrementShares(productId: string) {
    const prod = this.getProductById(productId);
    if (prod) {
      prod.sharesCount += 1;
      this.persist();
    }
  }

  // ===================== ORDERS & ESCROW =====================
  getOrders(): Order[] {
    return this.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  getOrdersBySeller(sellerId: string): Order[] {
    return this.orders.filter(o => o.sellerId === sellerId);
  }

  createOrder(orderData: {
    productId: string;
    buyerName: string;
    buyerPhone: string;
    city: string;
    district: string;
    deliveryMode: 'PICKUP' | 'SELLER_DELIVERY' | 'THIRD_PARTY';
    buyerNotes?: string;
    quantity: number;
    customPrice?: number;
  }): Order {
    const product = this.getProductById(orderData.productId);
    if (!product) throw new Error('Produit introuvable');

    const deliveryFee = orderData.deliveryMode === 'PICKUP' ? 0 : product.deliveryFee;
    const unitPrice = orderData.customPrice || product.price;
    const totalAmount = unitPrice * orderData.quantity + deliveryFee;
    const platformFee = Math.round(totalAmount * 0.02);

    const now = new Date().toISOString();
    const orderId = `ord_${Date.now()}`;
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);

    const newOrder: Order = {
      id: orderId,
      orderNumber: `ZRN-${year}-${rand}`,
      buyerId: `usr_${Date.now()}`,
      sellerId: product.sellerId,
      productId: product.id,
      quantity: orderData.quantity,
      unitPrice,
      deliveryFee,
      platformFee,
      totalAmount,
      currency: product.currency,
      status: 'PAID',
      deliveryMode: orderData.deliveryMode,
      deliveryAddress: {
        fullName: orderData.buyerName,
        city: orderData.city,
        district: orderData.district,
        phone: orderData.buyerPhone
      },
      buyerNotes: orderData.buyerNotes,
      createdAt: now,
      paidAt: now,
      product,
      seller: this.seller
    };

    this.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  updateOrderStatus(orderId: string, targetStatus: OrderStatus, reason?: string): Order {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error('Commande introuvable');

    const { updatedOrder } = EscrowStateMachine.applyTransition(order, targetStatus, reason);

    const index = this.orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      this.orders[index] = updatedOrder;
      this.persist();
    }

    return updatedOrder;
  }

  // ===================== REVIEWS =====================
  getReviews(): Review[] {
    return this.reviews;
  }

  getReviewsBySeller(sellerId: string): Review[] {
    return this.reviews.filter(r => r.targetSellerId === sellerId);
  }

  addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const newReview: Review = {
      verifiedPurchase: true,
      ...review,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.reviews.unshift(newReview);
    this.persist();
    return newReview;
  }

  // ===================== DISPUTES =====================
  getDisputes(): Dispute[] {
    return this.disputes;
  }

  openDispute(orderId: string, reason: Dispute['reason'], description: string): Dispute {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error('Commande introuvable');

    this.updateOrderStatus(orderId, 'DISPUTED', description);

    const newDispute: Dispute = {
      id: `disp_${Date.now()}`,
      orderId,
      raisedBy: order.buyerId,
      reason,
      description,
      evidenceUrls: [],
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };

    this.disputes.unshift(newDispute);
    this.persist();
    return newDispute;
  }

  resolveDispute(disputeId: string, action: 'refund' | 'release', notes?: string): Dispute {
    const disputeIndex = this.disputes.findIndex(d => d.id === disputeId);
    if (disputeIndex === -1) throw new Error('Litige introuvable');
    const dispute = this.disputes[disputeIndex];
    const order = this.getOrderById(dispute.orderId);

    if (action === 'refund') {
      dispute.status = 'RESOLVED_REFUND';
      if (order) {
        this.updateOrderStatus(order.id, 'REFUNDED', notes || 'Remboursement acheteur validé');
      }
    } else {
      dispute.status = 'RESOLVED_PAYOUT';
      if (order) {
        this.updateOrderStatus(order.id, 'COMPLETED', notes || 'Fonds débloqués au vendeur');
      }
    }
    dispute.resolutionNotes = notes;
    this.disputes[disputeIndex] = dispute;
    this.persist();
    return dispute;
  }

  // ===================== MESSAGING & CHAT =====================
  getConversations(): Conversation[] {
    return this.conversations;
  }

  getConversationById(id: string): Conversation | undefined {
    return this.conversations.find(c => c.id === id);
  }

  getMessages(conversationId: string): Message[] {
    return this.messages.filter(m => m.conversationId === conversationId);
  }

  sendMessage(conversationId: string, senderId: string, senderName: string, text: string, offerId?: string): Message {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId,
      senderName,
      text,
      offerId,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    this.messages.push(newMsg);

    const conv = this.getConversationById(conversationId);
    if (conv) {
      conv.lastMessage = text;
      conv.lastMessageAt = newMsg.createdAt;
      if (offerId) conv.offerId = offerId;
    }

    this.persist();
    return newMsg;
  }

  startOrGetConversation(params: {
    buyerId: string;
    buyerName: string;
    buyerPhone: string;
    sellerId: string;
    sellerName: string;
    sellerPhone: string;
    product?: Product;
  }): Conversation {
    let existing = this.conversations.find(
      c => c.participantIds.includes(params.buyerId) && 
           c.participantIds.includes(params.sellerId) &&
           (!params.product || c.productId === params.product.id)
    );

    if (existing) return existing;

    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      participantIds: [params.buyerId, params.sellerId],
      participants: [
        {
          id: params.buyerId,
          name: params.buyerName,
          phone: params.buyerPhone,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          isVerified: true
        },
        {
          id: params.sellerId,
          name: params.sellerName,
          phone: params.sellerPhone,
          avatar: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=150&q=80',
          isPro: true,
          isVerified: true
        }
      ],
      productId: params.product?.id,
      productTitle: params.product?.title,
      productPrice: params.product?.price,
      productImage: params.product?.images?.[0],
      lastMessage: 'Conversation ouverte',
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0
    };

    this.conversations.unshift(newConv);
    this.persist();
    return newConv;
  }

  // ===================== OFFERS / PROPOSITIONS =====================
  getOffers(): ProductOffer[] {
    return this.offers;
  }

  getOfferById(id: string): ProductOffer | undefined {
    return this.offers.find(o => o.id === id);
  }

  createOffer(offerData: Omit<ProductOffer, 'id' | 'status' | 'createdAt'>): ProductOffer {
    const newOffer: ProductOffer = {
      ...offerData,
      id: `off_${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    this.offers.unshift(newOffer);

    // Démarrer ou mettre à jour la conversation
    const conv = this.startOrGetConversation({
      buyerId: newOffer.buyerId,
      buyerName: newOffer.buyerName,
      buyerPhone: newOffer.buyerPhone,
      sellerId: newOffer.sellerId,
      sellerName: newOffer.sellerName || 'Vendeur ZARÉN',
      sellerPhone: '+24107458812'
    });

    conv.offerId = newOffer.id;
    conv.currentOffer = newOffer;

    this.sendMessage(
      conv.id,
      newOffer.buyerId,
      newOffer.buyerName,
      `🤝 Proposition d'offre de prix : ${newOffer.offeredPrice.toLocaleString()} FCFA (Prix initial : ${newOffer.originalPrice.toLocaleString()} FCFA)${newOffer.notes ? ` • "${newOffer.notes}"` : ''}`,
      newOffer.id
    );

    this.persist();
    return newOffer;
  }

  respondToOffer(offerId: string, action: 'ACCEPT' | 'REJECT' | 'COUNTER', counterPrice?: number): ProductOffer {
    const offer = this.getOfferById(offerId);
    if (!offer) throw new Error('Offre introuvable');

    if (action === 'ACCEPT') {
      offer.status = 'ACCEPTED';
    } else if (action === 'REJECT') {
      offer.status = 'REJECTED';
    } else if (action === 'COUNTER' && counterPrice) {
      offer.status = 'COUNTERED';
      offer.counterPrice = counterPrice;
    }
    offer.updatedAt = new Date().toISOString();

    // Mettre à jour la conversation liée
    const conv = this.conversations.find(c => c.offerId === offerId);
    if (conv) {
      conv.currentOffer = offer;
      const statusText = action === 'ACCEPT'
        ? `✨ Offre acceptée à ${offer.offeredPrice.toLocaleString()} FCFA ! Le lien d'achat sous séquestre est prêt.`
        : action === 'COUNTER'
        ? `🔄 Contre-proposition du vendeur à ${counterPrice?.toLocaleString()} FCFA.`
        : `❌ L'offre à ${offer.offeredPrice.toLocaleString()} FCFA a été déclinée par le vendeur.`;

      this.sendMessage(conv.id, offer.sellerId, offer.sellerName || 'Vendeur', statusText, offer.id);
    }

    this.persist();
    return offer;
  }

  updateSellerProfile(updates: Partial<SellerProfile>): SellerProfile {
    this.seller = {
      ...this.seller,
      ...updates,
    };
    this.persist();
    return this.seller;
  }

  getSellerProfile(): SellerProfile {
    return this.seller;
  }
}

export const zarenStore = new ZarénStore();
