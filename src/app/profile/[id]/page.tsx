'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import UserProfileView from '@/components/profile/UserProfileView';
import { zarenStore } from '@/db/store';
import { useAuth } from '@/context/AuthContext';
import { Review, Product, Order, SellerProfile, Profile } from '@/types';

export default function UserPublicProfilePage() {
  const params = useParams();
  const { currentUser } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const seller: SellerProfile = zarenStore.getSellerProfile();

  useEffect(() => {
    setReviews(zarenStore.getReviews());
    setProducts(zarenStore.getProducts());
    setOrders(
      zarenStore
        .getOrders()
        .filter((o) => o.status === 'COMPLETED' || o.status === 'DELIVERED' || o.status === 'PAID')
    );
  }, []);

  // Déterminer le tier du profil : Standard (Vinted) ou Pro (Marchand)
  const isOwner = currentUser ? (params.id === currentUser.id || params.id === 'usr_seller_1') : false;
  const isPro = isOwner 
    ? (currentUser?.account_tier === 'PRO' || currentUser?.plan === 'PRO') 
    : (seller.account_tier === 'PRO' || seller.plan === 'PRO');

  // Construction du profil polymorphique avec discriminant strict
  const profile: Profile = isPro
    ? {
        account_tier: 'PRO',
        plan: 'PRO',
        id: currentUser?.id || seller.id,
        name: currentUser?.name || seller.businessName,
        username: currentUser?.username || seller.username || '@boutique_pro',
        businessName: currentUser?.businessName || seller.businessName,
        slug: seller.slug,
        bio: seller.bio,
        logoUrl: currentUser?.avatar || seller.logoUrl,
        bannerUrl: seller.bannerUrl,
        avatar: currentUser?.avatar || seller.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        city: currentUser?.city || seller.city || 'Libreville',
        district: currentUser?.district || seller.district || 'Quartier Louis',
        ratingAvg: currentUser?.ratingAvg || seller.ratingAvg || 4.95,
        ratingCount: currentUser?.ratingCount || seller.ratingCount || 28,
        completedSalesCount: currentUser?.completedSalesCount || seller.completedSalesCount || 45,
        isVerified: true,
        payoutMethod: seller.payoutMethod || 'AIRTEL_MONEY',
        payoutAccountNumber: seller.payoutAccountNumber || '+24107458812',
      }
    : {
        account_tier: 'STANDARD',
        plan: 'STANDARD',
        id: currentUser?.id || 'usr_seller_standard',
        name: currentUser?.name || 'Marlène Obame',
        username: currentUser?.username || '@marlene_dressing',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        city: currentUser?.city || 'Libreville',
        district: currentUser?.district || 'Quartier Louis',
        ratingAvg: currentUser?.ratingAvg || 4.9,
        ratingCount: currentUser?.ratingCount || 12,
        completedSalesCount: currentUser?.completedSalesCount || 24,
        escrowBalance: currentUser?.escrowBalance || 482000,
      };

  return (
    <>
      <Navbar />
      <UserProfileView
        profile={profile}
        products={products}
        reviews={reviews}
        orders={orders}
        isOwner={isOwner}
      />
    </>
  );
}

