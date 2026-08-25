'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StandardProfileView from '@/components/profile/StandardProfileView';
import ProProfileView from '@/components/profile/ProProfileView';
import { zarenStore } from '@/db/store';
import { useAuth } from '@/context/AuthContext';
import { Review, Product, Order, SellerProfile } from '@/types';

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

  return (
    <>
      <Navbar />
      {isPro ? (
        <ProProfileView
          seller={{
            ...seller,
            businessName: currentUser?.businessName || seller.businessName,
            logoUrl: currentUser?.avatar || seller.logoUrl,
            city: currentUser?.city || seller.city,
            district: currentUser?.district || seller.district,
            ratingAvg: currentUser?.ratingAvg || seller.ratingAvg,
            ratingCount: currentUser?.ratingCount || seller.ratingCount,
            completedSalesCount: currentUser?.completedSalesCount || seller.completedSalesCount,
          }}
          products={products}
          reviews={reviews}
          orders={orders}
          isOwner={isOwner}
        />
      ) : (
        <StandardProfileView
          user={{
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
          }}
          products={products}
          reviews={reviews}
          orders={orders}
          isOwner={isOwner}
        />
      )}
    </>
  );
}
