import { User, SellerProfile, Product, Order, Transaction, Review, ShopLocation } from '@/types';

export const MOCK_USERS: User[] = [
  {
    id: 'usr_seller_1',
    phoneNumber: '+24107458812',
    fullName: 'Marlène Obame',
    city: 'Libreville',
    district: 'Louis',
    role: 'USER',
    account_tier: 'PRO',
    plan: 'PRO',
    isActive: true,
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'usr_buyer_1',
    phoneNumber: '+241062334455',
    fullName: 'Patrick Nguema',
    city: 'Libreville',
    district: 'Batterie IV',
    role: 'USER',
    account_tier: 'STANDARD',
    plan: 'STANDARD',
    isActive: true,
    createdAt: '2026-02-14T14:30:00Z',
  }
];

export const MOCK_SHOPS: ShopLocation[] = [
  {
    id: 'shop_istore_lbv',
    name: 'iStore Libreville Premium',
    photo: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    latitude: 0.4045,
    longitude: 9.4431,
    address: 'Boulevard Quaben, Quartier Louis',
    city: 'Libreville',
    district: 'Louis',
    category: 'Smartphones & High-Tech',
    rating: 5.0,
    reviewCount: 64,
    description: 'Boutique certifiée Apple & High-Tech d\'origine. Smartphones, tablettes et accessoires garantis.',
    phone: '+241 07 45 88 12',
    isVerified: true,
    isOpen: true
  },
  {
    id: 'shop_glamour_hair',
    name: 'Glamour Hair Batterie IV',
    photo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    latitude: 0.4285,
    longitude: 9.4320,
    address: 'Avenue de la Batterie IV, Résidence des Palmiers',
    city: 'Libreville',
    district: 'Batterie IV',
    category: 'Perruques HD & Beauté',
    rating: 4.9,
    reviewCount: 42,
    description: 'Spécialiste de la perruque Lace Front HD invisible, mèches brésiliennes et soins capillaires de luxe.',
    phone: '+241 06 12 34 56',
    isVerified: true,
    isOpen: true
  },
  {
    id: 'shop_kicks_gabon',
    name: 'Kicks K-Store Gabon',
    photo: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    latitude: 0.3920,
    longitude: 9.4580,
    address: 'Galerie Marchande, Mont-Bouët Centre',
    city: 'Libreville',
    district: 'Mont-Bouët',
    category: 'Sneakers & Chaussures',
    rating: 4.9,
    reviewCount: 58,
    description: 'Sneakers streetwear authentiques (Jordan, Nike, Adidas Yeezy, New Balance) avec boîte d\'origine et facture.',
    phone: '+241 07 99 88 77',
    isVerified: true,
    isOpen: true
  },
  {
    id: 'shop_electro_akanda',
    name: 'Électro Chic Akanda',
    photo: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
    latitude: 0.5120,
    longitude: 9.4180,
    address: 'Carrefour Amissa Bongo, Angondjé',
    city: 'Akanda',
    district: 'Angondjé',
    category: 'Air Fryer & Électro',
    rating: 4.8,
    reviewCount: 31,
    description: 'Électroménager moderne, Air Fryers XXL, blenders et robots culinaires pour la cuisine saine.',
    phone: '+241 07 22 44 66',
    isVerified: true,
    isOpen: true
  },
  {
    id: 'shop_diva_dressing',
    name: 'Diva Dressing Libreville',
    photo: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    latitude: 0.4410,
    longitude: 9.4550,
    address: 'Voie Express, Entrée Charbonnages',
    city: 'Libreville',
    district: 'Charbonnages',
    category: 'Robes & Mode Femme',
    rating: 4.9,
    reviewCount: 29,
    description: 'Robes de cocktail, tenues de soirée satinées, ensembles chic pour réceptions et cérémonies.',
    phone: '+241 06 77 88 99',
    isVerified: true,
    isOpen: true
  },
  {
    id: 'shop_gaming_zone',
    name: 'Gaming Zone Libreville',
    photo: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    latitude: 0.3880,
    longitude: 9.4490,
    address: 'Rue Alsace Lorraine, Centre-Ville',
    city: 'Libreville',
    district: 'Centre-ville',
    category: 'PS5 & Informatique',
    rating: 5.0,
    reviewCount: 75,
    description: 'Consoles PlayStation 5, Xbox Series X, PC Gamer, casques immersifs et jeux vidéo récents sous blister.',
    phone: '+241 07 55 11 22',
    isVerified: true,
    isOpen: true
  },
  {
    id: 'shop_pog_denim',
    name: 'Port-Gentil Denim House',
    photo: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    latitude: 0.7167,
    longitude: 8.7833,
    address: 'Boulevard Savorgnan de Brazza',
    city: 'Port-Gentil',
    district: 'Cap Lopez',
    category: 'Mode Homme & Jeans',
    rating: 4.7,
    reviewCount: 19,
    description: 'Jeans denim power stretch, chemises tendance et streetwear pour hommes.',
    phone: '+241 06 44 22 11',
    isVerified: true,
    isOpen: true
  },
  {
    id: 'shop_parfums_luxe',
    name: 'Parfums de Luxe Glass',
    photo: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    latitude: 0.3780,
    longitude: 9.4520,
    address: 'Carrefour Glass, près de la pharmacie',
    city: 'Libreville',
    district: 'Glass',
    category: 'Parfums & Beauté',
    rating: 4.9,
    reviewCount: 53,
    description: 'Parfums orientaux de Dubaï (Lattafa, Armaf), huiles précieuses et encens Oud.',
    phone: '+241 07 88 55 33',
    isVerified: true,
    isOpen: true
  },
  {
    id: 'shop_douala_tech',
    name: 'Akwa Tech Douala',
    photo: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    latitude: 4.0511,
    longitude: 9.7085,
    address: 'Boulevard de la Liberté, Akwa',
    city: 'Douala',
    district: 'Akwa',
    category: 'Smartphones & High-Tech',
    rating: 4.8,
    reviewCount: 88,
    description: 'High-Tech, smartphones Samsung et iPhones avec garantie officielle.',
    phone: '+237 67 00 11 22',
    isVerified: true,
    isOpen: true
  }
];

export const MOCK_SELLER: SellerProfile = {
  id: 'sel_kicks_1',
  userId: 'usr_seller_1',
  businessName: 'iStore Libreville Premium',
  slug: 'istore-lbv',
  bio: 'Smartphones & High-Tech 100% Authentiques. Expédition express et garantie sous séquestre.',
  logoUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80',
  isVerified: true,
  ratingAvg: 5.0,
  ratingCount: 64,
  totalSalesCount: 230,
  payoutMethod: 'AIRTEL_MONEY',
  payoutAccountNumber: '+24107458812',
  payoutAccountName: 'Marlène Obame (iStore)',
  responseTimeMinutes: 8,
  latitude: 0.4045,
  longitude: 9.4431,
  address: 'Boulevard Quaben, Quartier Louis',
  city: 'Libreville',
  district: 'Louis',
  category: 'Smartphones & High-Tech',
  createdAt: '2026-01-10T10:30:00Z',
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    sellerId: 'sel_kicks_1',
    shortCode: 'zrn-ip14',
    title: 'iPhone 14 Pro Max 256Go Deep Purple - État Neuf Batterie 96%',
    description: 'iPhone authentique importé de France, vendu avec boîte d\'origine, câble Lightning et coque MagSafe. Zéro rayure.',
    price: 480000,
    currency: 'XAF',
    stockQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Libreville',
    district: 'Louis',
    latitude: 0.4045,
    longitude: 9.4431,
    address: 'Boulevard Quaben, Quartier Louis',
    deliveryFee: 2000,
    pickupAvailable: true,
    status: 'ACTIVE',
    viewsCount: 420,
    sharesCount: 52,
    category: 'PHONES',
    createdAt: '2026-08-20T09:00:00Z',
    seller: MOCK_SELLER,
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord_ga_9482',
    orderNumber: 'ZRN-GA-9482',
    buyerId: 'usr_buyer_1',
    sellerId: 'sel_kicks_1',
    productId: 'prod_1',
    quantity: 1,
    unitPrice: 480000,
    deliveryFee: 2000,
    platformFee: 0,
    totalAmount: 482000,
    currency: 'XAF',
    status: 'DELIVERED',
    deliveryMode: 'SELLER_DELIVERY',
    deliveryAddress: {
      city: 'Libreville',
      district: 'Louis',
      phone: '+241 07 45 88 12',
      landmark: 'En face de l\'Hôtel Le Cristal'
    },
    buyerNotes: 'Appeler avant de livrer s\'il vous plaît.',
    createdAt: '2026-08-24T18:00:00Z',
    paidAt: '2026-08-24T18:02:00Z',
    inTransitAt: '2026-08-24T18:15:00Z',
    deliveredAt: '2026-08-24T18:40:00Z'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    orderId: 'ord_ga_9482',
    authorId: 'usr_buyer_1',
    authorName: 'Patrick Nguema',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    targetSellerId: 'sel_kicks_1',
    rating: 5,
    comment: 'Produit 100% authentique reçu en moins de 30 minutes au quartier Louis. Séquestre validé sans souci !',
    productTitle: 'iPhone 14 Pro Max 256Go Deep Purple',
    verifiedPurchase: true,
    createdAt: '2026-08-24T19:00:00Z'
  },
  {
    id: 'rev_2',
    orderId: 'ord_ga_8821',
    authorId: 'usr_buyer_2',
    authorName: 'Sandrine Mba',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    targetSellerId: 'sel_kicks_1',
    rating: 5,
    comment: 'Vendeuse très pro et réactive sur la messagerie. Colis très bien emballé.',
    productTitle: 'AirPods Pro 2ème Génération',
    verifiedPurchase: true,
    createdAt: '2026-08-23T14:30:00Z'
  },
  {
    id: 'rev_3',
    orderId: 'ord_ga_7714',
    authorId: 'usr_buyer_3',
    authorName: 'Jean-Marc Ondo',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    targetSellerId: 'sel_kicks_1',
    rating: 5,
    comment: 'Transaction impeccable, le séquestre Zarén donne une confiance totale.',
    productTitle: 'Chargeur Rapide Apple 20W Original',
    verifiedPurchase: true,
    createdAt: '2026-08-21T11:15:00Z'
  },
  {
    id: 'rev_4',
    orderId: 'ord_ga_6620',
    authorId: 'usr_buyer_4',
    authorName: 'Carine Eyeghe',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    targetSellerId: 'sel_kicks_1',
    rating: 4,
    comment: 'Très bon article, juste un léger retard de 15 min du livreur à cause de la pluie mais service au top.',
    productTitle: 'Coque Silicone MagSafe Deep Purple',
    verifiedPurchase: true,
    createdAt: '2026-08-18T16:45:00Z'
  }
];

export const MOCK_OFFERS: import('@/types').ProductOffer[] = [
  {
    id: 'off_101',
    productId: 'prod_1',
    productTitle: 'iPhone 14 Pro Max 256Go Deep Purple',
    productImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80',
    originalPrice: 480000,
    offeredPrice: 450000,
    currency: 'XAF',
    buyerId: 'usr_buyer_1',
    buyerName: 'Patrick Nguema',
    buyerPhone: '+241062334455',
    sellerId: 'sel_kicks_1',
    sellerName: 'iStore Libreville Premium',
    status: 'ACCEPTED',
    notes: 'Paiement immédiat Airtel Money si remise en mains propres aujourd\'hui.',
    createdAt: '2026-08-24T17:30:00Z'
  }
];

export const MOCK_CONVERSATIONS: import('@/types').Conversation[] = [
  {
    id: 'conv_1',
    participantIds: ['usr_buyer_1', 'usr_seller_1'],
    participants: [
      {
        id: 'usr_buyer_1',
        name: 'Patrick Nguema',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        phone: '+241062334455',
        isVerified: true
      },
      {
        id: 'usr_seller_1',
        name: 'iStore Libreville (Marlène)',
        avatar: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=150&q=80',
        phone: '+24107458812',
        isPro: true,
        isVerified: true
      }
    ],
    productId: 'prod_1',
    productTitle: 'iPhone 14 Pro Max 256Go Deep Purple',
    productPrice: 480000,
    productImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80',
    offerId: 'off_101',
    lastMessage: 'Offre acceptée à 450 000 FCFA ! Vous pouvez procéder au paiement sous séquestre.',
    lastMessageAt: '2026-08-24T17:35:00Z',
    unreadCount: 0
  }
];

export const MOCK_MESSAGES: import('@/types').Message[] = [
  {
    id: 'msg_1',
    conversationId: 'conv_1',
    senderId: 'usr_buyer_1',
    senderName: 'Patrick Nguema',
    text: 'Bonjour, l\'iPhone est-il toujours disponible avec sa boîte ?',
    createdAt: '2026-08-24T17:25:00Z',
    isRead: true
  },
  {
    id: 'msg_2',
    conversationId: 'conv_1',
    senderId: 'usr_seller_1',
    senderName: 'iStore Libreville',
    text: 'Bonjour Patrick, oui parfaitement disponible avec boîte d\'origine et facture !',
    createdAt: '2026-08-24T17:28:00Z',
    isRead: true
  },
  {
    id: 'msg_3',
    conversationId: 'conv_1',
    senderId: 'usr_buyer_1',
    senderName: 'Patrick Nguema',
    text: '🤝 J\'ai fait une offre de prix à 450 000 FCFA.',
    offerId: 'off_101',
    createdAt: '2026-08-24T17:30:00Z',
    isRead: true
  },
  {
    id: 'msg_4',
    conversationId: 'conv_1',
    senderId: 'usr_seller_1',
    senderName: 'iStore Libreville',
    text: '✨ Offre acceptée à 450 000 FCFA ! Vous pouvez procéder au paiement sous séquestre.',
    createdAt: '2026-08-24T17:35:00Z',
    isRead: true
  }
];
