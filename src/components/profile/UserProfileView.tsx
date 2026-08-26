'use client';

import React from 'react';
import { Profile, Product, Review, Order, isProProfile, SellerProfile } from '@/types';
import StandardProfileView from '@/components/profile/StandardProfileView';
import ProProfileView from '@/components/profile/ProProfileView';

export interface UserProfileViewProps {
  profile: Profile;
  products: Product[];
  reviews: Review[];
  orders: Order[];
  isOwner?: boolean;
}

/**
 * Composant polymorphique de profil utilisateur avec Guard strict.
 * - Si profile.account_tier === 'PRO' -> Rend ProProfileView (Structure marchand complète avec bannière HD, logo, badge vérifié, dashboard analytique).
 * - Si profile.account_tier === 'STANDARD' -> Rend StandardProfileView (UX type Vinted épurée, dressing 2 colonnes, upsell Pass Pro).
 */
export default function UserProfileView({
  profile,
  products,
  reviews,
  orders,
  isOwner = true,
}: UserProfileViewProps) {
  // Guard discriminant strict
  if (isProProfile(profile)) {
    // Profil Marchand PRO
    const seller: SellerProfile = {
      id: profile.id,
      userId: profile.id,
      businessName: profile.businessName || profile.name,
      username: profile.username,
      slug: profile.slug || profile.username.replace('@', ''),
      bio: profile.bio || 'Boutique certifiée sur ZARÉN.',
      logoUrl: profile.logoUrl || profile.avatar,
      avatarUrl: profile.avatar,
      bannerUrl: profile.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      isVerified: profile.isVerified ?? true,
      account_tier: 'PRO',
      plan: 'PRO',
      ratingAvg: profile.ratingAvg,
      ratingCount: profile.ratingCount,
      totalSalesCount: profile.totalSalesCount || profile.completedSalesCount,
      completedSalesCount: profile.completedSalesCount,
      payoutMethod: profile.payoutMethod || 'AIRTEL_MONEY',
      payoutAccountNumber: profile.payoutAccountNumber || profile.phone || '+24107458812',
      payoutAccountName: profile.payoutAccountName || profile.name,
      city: profile.city,
      district: profile.district,
      country: profile.country || 'Gabon',
      address: profile.address || 'Point de retrait Libreville',
      shopHours: profile.shopHours || '08h30 - 19h00',
      whatsapp: profile.whatsapp || profile.phone || '+241 07 45 88 12',
      createdAt: new Date().toISOString(),
    };

    return (
      <ProProfileView
        seller={seller}
        products={products}
        reviews={reviews}
        orders={orders}
        isOwner={isOwner}
      />
    );
  }

  // Profil Vendeur Standard (UX Style Vinted)
  return (
    <StandardProfileView
      user={{
        id: profile.id,
        name: profile.name,
        username: profile.username,
        avatar: profile.avatar,
        city: profile.city,
        district: profile.district,
        ratingAvg: profile.ratingAvg,
        ratingCount: profile.ratingCount,
        completedSalesCount: profile.completedSalesCount,
        escrowBalance: profile.escrowBalance || 0,
      }}
      products={products}
      reviews={reviews}
      orders={orders}
      isOwner={isOwner}
    />
  );
}
