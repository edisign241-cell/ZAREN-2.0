'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Store,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Share2,
  CheckCircle2,
  Play,
  Heart,
  Zap,
  ThumbsUp,
  Award,
  ArrowLeft,
  X,
  Lock,
  Search,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

const MOCK_SHOP_DETAILS = {
  id: 'marlene-dressing',
  name: 'Marlène Dressing & High-Tech',
  slogan: 'Vêtements chics importés & Accessoires Apple d\'origine certifiée',
  description: 'Boutique premium certifiée à Libreville depuis 2022. Tous nos produits sont neufs, testés et garantis conformes sous séquestre ZARÉN.',
  logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
  city: 'Libreville',
  district: 'Quartier Louis',
  address: 'Galerie Marchande Louis, Rez-de-chaussée, Boutique N°14',
  phone: '+241 07 45 88 12',
  whatsapp: '+24107458812',
  openingHours: 'Lun - Sam : 08h30 - 19h00 • Dimanche : 10h00 - 16h00',
  rating: 4.9,
  reviewsCount: 84,
  salesCount: 142,
  satisfactionRate: '99%',
  isVerified: true,
  isProSubscriber: true,
  badges: [
    'Badge Vendeur Vérifié ZARÉN',
    'Expédition Express < 2h',
    'Retour Gratuit sous 48h',
    'Paiement Séquestre 100% Garanti'
  ]
};

const MOCK_SHOP_PRODUCTS = [
  {
    id: 'prod_1',
    shortCode: 'zrn-ip14',
    title: 'iPhone 14 Pro Max 256Go Deep Purple - État Neuf Batterie 96%',
    price: 480000,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'PHONES',
    isSaved: false,
    rating: 5.0,
    reviews: 28
  },
  {
    id: 'prod_2',
    shortCode: 'zrn-wig1',
    title: 'Perruque Lace Front HD 13x4 Cheveux 100% Naturels Brésiliens 26 Pouces',
    price: 85000,
    images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'],
    videoUrl: null,
    category: 'BEAUTY',
    isSaved: false,
    rating: 4.9,
    reviews: 19
  },
  {
    id: 'prod_5',
    shortCode: 'zrn-dr01',
    title: 'Robe de Soirée Élégante Haute Couture Soie Satinée Émeraude',
    price: 55000,
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'],
    videoUrl: null,
    category: 'WOMEN_FASHION',
    isSaved: false,
    rating: 4.8,
    reviews: 14
  },
  {
    id: 'prod_6',
    shortCode: 'zrn-airp',
    title: 'Apple AirPods Pro 2ème Génération USB-C avec Réduction de Bruit Active',
    price: 165000,
    images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    category: 'PHONES',
    isSaved: false,
    rating: 5.0,
    reviews: 23
  }
];

const INITIAL_REVIEWS = [
  {
    id: 'rev_1',
    buyerName: 'Éric Mba',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Il y a 2 jours',
    productTitle: 'iPhone 14 Pro Max 256Go Deep Purple',
    comment: 'Téléphone 100% conforme à l\'annonce ! Batterie impeccable et reçu avec tous les accessoires. J\'ai validé le déblocage des fonds dès la remise par le livreur. Vendeuse très pro !',
    verifiedEscrow: true
  },
  {
    id: 'rev_2',
    buyerName: 'Christelle Nze',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Il y a 5 jours',
    productTitle: 'Perruque Lace Front HD 13x4 26 Pouces',
    comment: 'La dentelle est vraiment invisible et les mèches sont soyeuses. Livraison en moins de 2h au Quartier Louis. Je recommande les yeux fermés !',
    verifiedEscrow: true
  },
  {
    id: 'rev_3',
    buyerName: 'Patrick Ondo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Il y a 1 semaine',
    productTitle: 'AirPods Pro 2 USB-C',
    comment: 'Superbe produit scellé d\'origine, son parfait et réduction active incroyable. Le séquestre Zarén rassure énormément pour ce type d\'achat.',
    verifiedEscrow: true
  }
];

export default function ShopShowcasePage() {
  const params = useParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'about'>('products');
  const [products, setProducts] = useState(MOCK_SHOP_PRODUCTS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Modale Déposer un avis
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewProduct, setNewReviewProduct] = useState('iPhone 14 Pro Max');

  // Modale Achat Express
  const [quickBuyProduct, setQuickBuyProduct] = useState<any | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const shop = MOCK_SHOP_DETAILS;

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const newRev = {
      id: 'rev_' + Date.now(),
      buyerName: 'Client Vérifié',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: newRating,
      date: 'À l\'instant',
      productTitle: newReviewProduct,
      comment: newReviewComment.trim(),
      verifiedEscrow: true
    };

    setReviews([newRev, ...reviews]);
    setShowReviewModal(false);
    setNewReviewComment('');
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    } catch (err) {}
    alert('🎉 Merci ! Votre avis vérifié a été publié.');
  };

  const handleQuickPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (err) {}
      const orderId = 'ord_' + Date.now();
      setQuickBuyProduct(null);
      router.push(`/orders/${orderId}`);
    }, 1500);
  };

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchQuery = !searchQuery.trim() || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        
        {/* BOUTON RETOUR MARCHÉ */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#111111] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au Marché ZARÉN</span>
        </Link>

        {/* 1. GRANDE BANNIÈRE & PROFIL DE LA VITRINE BOUTIQUE */}
        <div className="bg-white rounded-3xl border border-[#E5E5E5] overflow-hidden shadow-sm">
          
          {/* Image de couverture / Bannière */}
          <div className="relative h-48 sm:h-64 md:h-72 w-full bg-neutral-900 overflow-hidden">
            <img
              src={shop.banner}
              alt={shop.name}
              className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Badge Abonnement Pass Pro Actif */}
            <div className="absolute top-4 right-4 bg-[#008A45] text-white text-[10px] sm:text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 font-mono">
              <Award className="w-3.5 h-3.5" />
              <span>Boutique Partenaire Pass Pro</span>
            </div>
          </div>

          {/* En-tête Boutique / Infos Clés */}
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
              
              {/* Logo & Identité */}
              <div className="flex items-end gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white shrink-0">
                  <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#008A45] border-2 border-white shadow-xs" title="En ligne"></span>
                </div>

                <div className="space-y-1 pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black italic text-[#111111] tracking-tight">
                      {shop.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black italic bg-emerald-50 text-[#008A45] border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> VÉRIFIÉ
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 font-medium line-clamp-1 max-w-xl">
                    {shop.slogan}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-500 font-medium flex-wrap pt-0.5">
                    <span className="flex items-center gap-1 text-[#d97706] font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{shop.rating}</span>
                      <span className="text-gray-400 font-normal">({shop.reviewsCount} avis certifiés)</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#008A45]" />
                      <span>{shop.city} ({shop.district})</span>
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-800">
                      ⚡ {shop.salesCount} ventes sous séquestre
                    </span>
                  </div>
                </div>
              </div>

              {/* Boutons d'Action Vendeur */}
              <div className="flex items-center gap-2.5 w-full md:w-auto pt-2 md:pt-0">
                <a
                  href={`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(`Bonjour ${shop.name}, je vous contacte depuis votre vitrine sécurisée ZARÉN.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 md:flex-none px-4 py-2.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Boutique</span>
                </a>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('📋 Lien de la vitrine copié !');
                  }}
                  className="p-2.5 bg-[#F8F8F8] hover:bg-gray-200 text-[#111111] rounded-xl border border-[#E5E5E5] transition"
                  title="Partager la vitrine"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Badges de Confiance Boutique */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-gray-100 text-[11px] font-bold text-gray-700">
              {shop.badges.map((b, idx) => (
                <div key={idx} className="p-2 bg-[#F8F8F8] rounded-xl border border-gray-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#008A45] shrink-0" />
                  <span className="truncate">{b}</span>
                </div>
              ))}
            </div>

          </div>

          {/* 2. NAVIGATION PAR ONGLETS : ARTICLES / AVIS / À PROPOS */}
          <div className="flex items-center border-t border-[#E5E5E5] bg-[#F8F8F8] px-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-3.5 px-4 text-xs font-black italic uppercase tracking-wider border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'products'
                  ? 'border-[#008A45] text-[#008A45] bg-white'
                  : 'border-transparent text-gray-500 hover:text-[#111111]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Articles en vente ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3.5 px-4 text-xs font-black italic uppercase tracking-wider border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-[#008A45] text-[#008A45] bg-white'
                  : 'border-transparent text-gray-500 hover:text-[#111111]'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Avis & Confiance ({reviews.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`py-3.5 px-4 text-xs font-black italic uppercase tracking-wider border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'about'
                  ? 'border-[#008A45] text-[#008A45] bg-white'
                  : 'border-transparent text-gray-500 hover:text-[#111111]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Horaires & Contact</span>
            </button>
          </div>

        </div>

        {/* 3. CONTENU DE L'ONGLET SÉLECTIONNÉ */}

        {/* ONGLET A : ARTICLES EN VENTE */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Barre de Recherche Boutique */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher dans cette boutique..."
                  className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-white border border-[#E5E5E5] focus:border-[#008A45] rounded-full outline-hidden transition shadow-xs"
                />
              </div>

              {/* Filtres Catégories Boutique */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'ALL', label: 'Tous les articles' },
                  { id: 'PHONES', label: '📱 High-Tech' },
                  { id: 'BEAUTY', label: '💇‍♀️ Beauté' },
                  { id: 'WOMEN_FASHION', label: '👗 Mode Femme' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full border whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#008A45] text-white font-bold border-[#008A45] shadow-xs'
                        : 'bg-white text-gray-700 border-[#E5E5E5] hover:border-gray-400 font-medium'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grille des Articles */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  className="card-product group flex flex-col bg-white p-3 rounded-2xl border border-[#E5E5E5] hover:border-[#008A45] transition shadow-xs"
                >
                  <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden rounded-xl mb-3">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />

                    <button
                      onClick={(e) => toggleSave(p.id, e)}
                      className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md hover:bg-white cursor-pointer"
                    >
                      <span className="text-xs">{p.isSaved ? '❤️' : '🤍'}</span>
                    </button>

                    <div className="absolute top-2.5 left-2.5 bg-[#008A45] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md tracking-wider shadow-sm">
                      SÉQUESTRE
                    </div>

                    {p.videoUrl && (
                      <div className="absolute top-2.5 right-2.5 bg-black/80 text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                        <Play className="w-2.5 h-2.5 fill-white" />
                        <span>Vidéo Démo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-sm sm:text-base font-black text-[#111111]">
                      {new Intl.NumberFormat('fr-FR').format(p.price)} FCFA
                    </span>
                    <span className="text-[10px] text-[#008A45] font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                      ★ {p.rating}
                    </span>
                  </div>

                  <Link
                    href={`/p/${p.shortCode}`}
                    className="text-xs text-[#111111] font-black italic line-clamp-2 leading-snug mb-2 group-hover:text-[#008A45] transition"
                  >
                    {p.title}
                  </Link>

                  <div className="mt-auto pt-2 border-t border-gray-100 space-y-2">
                    <button
                      onClick={() => setQuickBuyProduct(p)}
                      className="w-full py-2 bg-emerald-50 hover:bg-[#008A45] text-[#008A45] hover:text-white border border-emerald-200 text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Achat Express Séquestre</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET B : AVIS CLIENTS & CONFIANCE SÉQUESTRE */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Carte Récapitulative des Notes */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E5E5E5] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-4 text-center md:border-r md:border-gray-100 md:pr-6 space-y-1">
                <div className="text-4xl sm:text-5xl font-black italic text-[#111111] font-mono">
                  {shop.rating}
                </div>
                <div className="flex items-center justify-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-gray-500 font-medium">Basé sur {shop.reviewsCount} achats vérifiés par Séquestre</p>
              </div>

              <div className="md:col-span-5 space-y-2 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-6 text-gray-500">5★</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#008A45] rounded-full w-[92%]"></div>
                  </div>
                  <span className="w-8 text-right text-gray-500">92%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-gray-500">4★</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#008A45] rounded-full w-[7%]"></div>
                  </div>
                  <span className="w-8 text-right text-gray-500">7%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-gray-500">3★</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#008A45] rounded-full w-[1%]"></div>
                  </div>
                  <span className="w-8 text-right text-gray-500">1%</span>
                </div>
              </div>

              <div className="md:col-span-3 text-center md:text-right">
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="w-full py-3 px-4 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-md transition cursor-pointer"
                >
                  ✍️ Donner un avis
                </button>
              </div>

            </div>

            {/* Liste des Avis Certifiés */}
            <div className="space-y-3">
              <h3 className="text-xs font-black italic uppercase tracking-wider text-[#111111]">
                Derniers avis certifiés ({reviews.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="bg-white p-5 rounded-2xl border border-[#E5E5E5] space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={rev.avatar} alt={rev.buyerName} className="w-10 h-10 rounded-full object-cover border border-[#E5E5E5]" />
                        <div>
                          <h4 className="text-xs font-bold text-[#111111]">{rev.buyerName}</h4>
                          <span className="text-[10px] text-gray-400 font-medium">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                    </div>

                    <div className="p-2 bg-[#F8F8F8] rounded-xl border border-gray-100 text-[11px] text-gray-600 font-medium">
                      Article acheté : <strong>{rev.productTitle}</strong>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      « {rev.comment} »
                    </p>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                      <span className="inline-flex items-center gap-1 text-[#008A45] font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Achat vérifié par Séquestre
                      </span>
                      <span className="text-gray-400">✓ Livré à Libreville</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ONGLET C : À PROPOS, HORAIRES & CONTACT */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E5E5] shadow-xs space-y-6 animate-fade-in">
            <div>
              <h2 className="text-base font-black italic uppercase text-[#111111] mb-2">
                À propos de {shop.name}
              </h2>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                {shop.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#008A45] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#111111]">Point de Retrait & Boutique Physique</h3>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">{shop.address}</p>
                    <span className="text-[10px] text-[#008A45] font-bold block mt-1">📍 {shop.city} ({shop.district})</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#008A45] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#111111]">Horaires d'Ouverture</h3>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">{shop.openingHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#008A45] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#111111]">Service Client & SAV</h3>
                    <p className="text-xs font-mono font-bold text-gray-800 mt-0.5">{shop.phone}</p>
                  </div>
                </div>
              </div>

              {/* Encadré Réassurance Séquestre */}
              <div className="p-6 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#008A45] font-black italic text-xs uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Garantie Totale ZARÉN</span>
                  </div>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    Toutes les commandes passées auprès de cette boutique bénéficient du séquestre officiel ZARÉN. Vous ne réglez qu'une fois votre colis vérifié à la livraison ou en boutique.
                  </p>
                </div>

                <a
                  href={`https://wa.me/${shop.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Poser une question sur WhatsApp</span>
                </a>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* MODALE DÉPOSER UN AVIS */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#E5E5E5] space-y-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black italic text-sm text-[#111111]">Donner un avis sur la boutique</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Votre note globale</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Produit acheté</label>
                <input
                  type="text"
                  value={newReviewProduct}
                  onChange={(e) => setNewReviewProduct(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Votre commentaire d'expérience</label>
                <textarea
                  rows={3}
                  required
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Qualité du produit, rapidité de livraison, emballage..."
                  className="w-full text-xs p-3 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase rounded-2xl shadow-lg cursor-pointer transition"
              >
                Publier mon avis certifié
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODALE ACHAT EXPRESS */}
      {quickBuyProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#E5E5E5] space-y-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#008A45] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black italic text-sm text-[#111111]">Achat Sécurisé {shop.name}</h3>
                  <span className="text-[10px] text-gray-500 font-medium">Séquestre Mobile Money Garanti</span>
                </div>
              </div>
              <button onClick={() => setQuickBuyProduct(null)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5]">
              <img src={quickBuyProduct.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#111111] truncate">{quickBuyProduct.title}</h4>
                <span className="text-xs font-black text-[#008A45]">{new Intl.NumberFormat('fr-FR').format(quickBuyProduct.price)} FCFA</span>
              </div>
            </div>

            <form onSubmit={handleQuickPaymentSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Numéro Mobile Money (Airtel / Moov)</label>
                <input type="tel" required defaultValue="+241 07 45 88 12" className="w-full text-xs font-mono font-bold p-3 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8]" />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 leading-relaxed font-medium">
                🔒 Les fonds sont bloqués sur Zarén jusqu'à validation de conformité.
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase rounded-2xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isProcessingPayment ? 'Séquestration en cours...' : `Payer ${new Intl.NumberFormat('fr-FR').format(quickBuyProduct.price)} FCFA`}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
