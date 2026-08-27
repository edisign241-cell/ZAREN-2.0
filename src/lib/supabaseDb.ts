import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AuthUser } from '@/context/AuthContext';
import { Product, Order, Dispute, Review, PartnerAd, SellerProfile, OrderStatus } from '@/types';

/**
 * Service de Synchronisation et de Persistance Supabase pour ZARÉN
 * Assure la réplication immédiate et continue de toutes les données utilisateurs,
 * profils, produits, commandes séquestrées et litiges vers PostgreSQL Supabase.
 */
class SupabaseSyncService {
  
  // ==========================================
  // 1. UTILISATEURS, PROFILS & SESSIONS TOKENS
  // ==========================================

  async syncUser(user: AuthUser, token?: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      // 1. Enregistrement dans la table public.users
      const userPayload = {
        id: user.id,
        phone_number: user.phone.trim(),
        full_name: user.name.trim(),
        username: user.username,
        email: user.email || null,
        avatar_url: user.avatar || null,
        country: user.country || 'Gabon',
        city: user.city || 'Libreville',
        district: user.district || 'Centre',
        account_tier: user.account_tier || 'STANDARD',
        plan: user.plan || 'STANDARD',
        rating_avg: user.ratingAvg || 5.0,
        rating_count: user.ratingCount || 0,
        completed_sales_count: user.completedSalesCount || 0,
        completed_purchases_count: user.completedPurchasesCount || 0,
        dispute_rate_percent: user.disputeRatePercent || 0,
        is_active: true,
        is_phone_verified: user.isPhoneVerified !== undefined ? user.isPhoneVerified : true,
        updated_at: new Date().toISOString()
      };

      const { error: userErr } = await supabase
        .from('users')
        .upsert(userPayload, { onConflict: 'id' });

      if (userErr) {
        console.warn('[SupabaseSync] Warning syncing user:', userErr.message);
      }

      // 2. Enregistrement ou mise à jour du profil vendeur
      const sellerPayload = {
        id: `sel_${user.id.replace('usr_', '')}`,
        user_id: user.id,
        business_name: user.businessName || `${user.name} Dressing`,
        username: user.username,
        slug: (user.username || user.name).toLowerCase().replace(/[^a-z0-9]/g, '-'),
        bio: `${user.businessName || user.name} sur ZARÉN. Transactions sécurisées par séquestre.`,
        avatar_url: user.avatar,
        logo_url: user.avatar,
        is_verified: user.account_tier === 'PRO',
        account_tier: user.account_tier,
        plan: user.plan,
        rating_avg: user.ratingAvg || 5.0,
        rating_count: user.ratingCount || 0,
        completed_sales_count: user.completedSalesCount || 0,
        payout_method: 'AIRTEL_MONEY',
        payout_account_number: user.phone,
        payout_account_name: user.name,
        country: user.country || 'Gabon',
        city: user.city || 'Libreville',
        district: user.district || 'Centre',
        updated_at: new Date().toISOString()
      };

      await supabase
        .from('seller_profiles')
        .upsert(sellerPayload, { onConflict: 'user_id' });

      // 3. Enregistrement du Token d'authentification
      if (token) {
        await supabase
          .from('user_tokens')
          .upsert({
            token: token,
            user_id: user.id,
            user_identifier: user.phone || user.email,
            created_at: new Date().toISOString(),
            is_valid: true
          }, { onConflict: 'token' });
      }

      return true;
    } catch (err: any) {
      console.warn('[SupabaseSync] Error in syncUser:', err?.message || err);
      return false;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<AuthUser>): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const payload: Record<string, any> = {
        updated_at: new Date().toISOString()
      };

      if (updates.name) payload.full_name = updates.name;
      if (updates.phone) payload.phone_number = updates.phone;
      if (updates.email) payload.email = updates.email;
      if (updates.username) payload.username = updates.username;
      if (updates.avatar) payload.avatar_url = updates.avatar;
      if (updates.city) payload.city = updates.city;
      if (updates.district) payload.district = updates.district;
      if (updates.account_tier) payload.account_tier = updates.account_tier;
      if (updates.plan) payload.plan = updates.plan;

      await supabase
        .from('users')
        .update(payload)
        .eq('id', userId);

      if (updates.businessName || updates.avatar) {
        await supabase
          .from('seller_profiles')
          .update({
            business_name: updates.businessName,
            avatar_url: updates.avatar,
            logo_url: updates.avatar,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      }

      return true;
    } catch (err) {
      return false;
    }
  }

  // ==========================================
  // 2. PRODUITS DU CATALOGUE
  // ==========================================

  async syncProduct(product: Product): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const payload = {
        id: product.id,
        seller_id: product.sellerId || (product.seller?.id) || 'usr_seller_main',
        short_code: product.shortCode,
        title: product.title,
        description: product.description,
        price: product.price,
        currency: product.currency || 'FCFA',
        condition: product.condition || 'Très bon état',
        size: product.size || null,
        brand: product.brand || null,
        stock_quantity: product.stockQuantity ?? 1,
        images: product.images || [],
        videos: product.videos || [],
        city: product.city || 'Libreville',
        district: product.district || 'Centre',
        delivery_fee: product.deliveryFee || 0,
        pickup_available: product.pickupAvailable !== undefined ? product.pickupAvailable : true,
        category: product.category || 'Général',
        status: product.status || 'ACTIVE',
        views_count: product.viewsCount || 0,
        shares_count: product.sharesCount || 0,
        created_at: product.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await supabase
        .from('products')
        .upsert(payload, { onConflict: 'id' });

      return true;
    } catch (err) {
      return false;
    }
  }

  async deleteProduct(productId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      await supabase.from('products').delete().eq('id', productId);
      return true;
    } catch (err) {
      return false;
    }
  }

  // ==========================================
  // 3. COMMANDES SOUS SÉQUESTRE & PAIEMENTS
  // ==========================================

  async syncOrder(order: Order): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const payload = {
        id: order.id,
        order_number: order.orderNumber,
        buyer_id: order.buyerId,
        seller_id: order.sellerId,
        product_id: order.productId,
        quantity: order.quantity || 1,
        unit_price: order.unitPrice,
        delivery_fee: order.deliveryFee || 0,
        platform_fee: order.platformFee || 0,
        total_amount: order.totalAmount,
        currency: order.currency || 'FCFA',
        status: order.status,
        delivery_mode: order.deliveryMode,
        delivery_address: order.deliveryAddress,
        buyer_notes: order.buyerNotes || null,
        paid_at: order.paidAt || null,
        preparing_at: order.preparingAt || null,
        in_transit_at: order.inTransitAt || null,
        delivered_at: order.deliveredAt || null,
        auto_release_at: order.autoReleaseAt || null,
        completed_at: order.completedAt || null,
        disputed_at: order.disputedAt || null,
        cancelled_at: order.cancelledAt || null,
        created_at: order.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await supabase
        .from('orders')
        .upsert(payload, { onConflict: 'id' });

      return true;
    } catch (err) {
      return false;
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, reason?: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const updates: Record<string, any> = {
        status,
        updated_at: new Date().toISOString()
      };
      if (status === 'COMPLETED') updates.completed_at = new Date().toISOString();
      if (status === 'DELIVERED') updates.delivered_at = new Date().toISOString();
      if (status === 'DISPUTED') {
        updates.disputed_at = new Date().toISOString();
        if (reason) updates.buyer_notes = reason;
      }
      if (status === 'REFUNDED') updates.cancelled_at = new Date().toISOString();

      await supabase.from('orders').update(updates).eq('id', orderId);
      return true;
    } catch (err) {
      return false;
    }
  }

  // ==========================================
  // 4. LITIGES & ARBITRAGE SUPPORT
  // ==========================================

  async syncDispute(dispute: Dispute): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const payload = {
        id: dispute.id,
        order_id: dispute.orderId,
        raised_by: dispute.raisedBy,
        reason: dispute.reason,
        description: dispute.description,
        evidence_urls: dispute.evidenceUrls || [],
        status: dispute.status,
        resolution_notes: dispute.resolutionNotes || null,
        created_at: dispute.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await supabase.from('disputes').upsert(payload, { onConflict: 'id' });
      return true;
    } catch (err) {
      return false;
    }
  }

  // ==========================================
  // 5. AVIS & NOTATIONS VÉRIFIÉES
  // ==========================================

  async syncReview(review: Review): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const payload = {
        id: review.id,
        order_id: review.orderId || null,
        author_id: review.authorId,
        author_name: review.authorName,
        author_avatar: review.authorAvatar || null,
        target_seller_id: review.targetSellerId,
        rating: review.rating,
        comment: review.comment || null,
        product_title: review.productTitle || null,
        verified_purchase: review.verifiedPurchase !== undefined ? review.verifiedPurchase : true,
        created_at: review.createdAt || new Date().toISOString()
      };

      await supabase.from('reviews').upsert(payload, { onConflict: 'id' });
      return true;
    } catch (err) {
      return false;
    }
  }

  // ==========================================
  // 6. CAMPAGNES PUBLICITAIRES PARTENAIRES
  // ==========================================

  async syncPartnerAd(ad: PartnerAd): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const payload = {
        id: ad.id,
        partner_name: ad.partnerName,
        title: ad.title,
        tagline: ad.tagline,
        media_url: ad.mediaUrl,
        media_type: ad.mediaType,
        target_url: ad.targetUrl,
        cta_text: ad.ctaText,
        tier: ad.pack,
        status: ad.adStatus,
        city: ad.city || 'Libreville',
        country: ad.country || 'Gabon',
        views_count: ad.impressionsCount || 0,
        clicks_count: ad.clicksCount || 0,
        created_at: ad.createdAt,
        updated_at: new Date().toISOString()
      };

      await supabase.from('partner_ads').upsert(payload, { onConflict: 'id' });
      return true;
    } catch (err) {
      return false;
    }
  }
}

export const supabaseSync = new SupabaseSyncService();
