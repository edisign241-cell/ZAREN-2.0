'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import SecurityEscrow from '@/components/SecurityEscrow';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import {
  Heart,
  Play,
  MapPin,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Zap,
  X,
  ArrowRight,
  Sparkles,
  Phone,
  Lock,
  Store,
  TrendingUp,
  PlusCircle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES = [
  { id: 'TOUT', label: 'Tout le flux' },
  { id: 'PHONES', label: '📱 Smartphones & High-Tech' },
  { id: 'SNEAKERS', label: '👟 Sneakers & Chaussures' },
  { id: 'BEAUTY', label: '💇‍♀️ Perruques HD & Beauté' },
  { id: 'WOMEN_FASHION', label: '👗 Robes & Mode Femme' },
  { id: 'MEN_FASHION', label: '👔 Mode Homme & Jeans' },
  { id: 'TECH_GAMING', label: '🎮 PS5 & Informatique' },
  { id: 'HOME', label: '🍳 Air Fryer & Électro' }
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    category: 'PHONES',
    shortCode: 'zrn-ip14',
    title: 'iPhone 14 Pro Max 256Go Deep Purple - État Neuf Batterie 96%',
    description: 'iPhone authentique importé de France, vendu avec boîte d\'origine, câble Lightning et coque MagSafe. Zéro rayure.',
    price: 480000,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    seller: 'iStore Libreville Premium',
    city: 'Libreville',
    district: 'Louis',
    urgentBadge: 'Stock limité • 1 pièce',
    isSaved: false
  },
  {
    id: 'prod_2',
    category: 'BEAUTY',
    shortCode: 'zrn-wig1',
    title: 'Perruque Lace Front HD 13x4 Cheveux 100% Naturels Brésiliens 26 Pouces',
    description: 'Dentelle HD invisible ultra-fondue, cheveux doux soyeux sans perte. Teinte naturelle 1B, prête à poser.',
    price: 85000,
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: null,
    seller: 'Glamour Hair Batterie IV',
    city: 'Libreville',
    district: 'Batterie IV',
    urgentBadge: 'Qualité 12A Certifiée',
    isSaved: false
  },
  {
    id: 'prod_3',
    category: 'SNEAKERS',
    shortCode: 'zrn-aj4c',
    title: 'Nike Air Jordan 4 Retro SE Craft Olive - Boîte d\'Origine & Facture',
    description: 'Pointures disponibles du 40 au 45. Cuir et daim premium. Remise en main propre ou livraison sécurisée.',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    seller: 'Kicks K-Store Gabon',
    city: 'Libreville',
    district: 'Mont-Bouët',
    urgentBadge: null,
    isSaved: false
  },
  {
    id: 'prod_4',
    category: 'TECH_GAMING',
    shortCode: 'zrn-ps5s',
    title: 'PlayStation 5 Slim Édition Standard 1To + 2 Manettes DualSense + FIFA 25',
    description: 'Pack PS5 neuf scellé avec facture et garantie 12 mois. Câbles et socle inclus.',
    price: 395000,
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: null,
    seller: 'Gamer Zone Akanda',
    city: 'Akanda',
    district: 'Avorbam',
    urgentBadge: 'Pack Exclusif',
    isSaved: false
  }
];

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn, currentUser, openLoginModal } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState('TOUT');
  const [selectedCity, setSelectedCity] = useState('Toutes les villes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'video'>('recent');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Vue explicite de la landing page pour un utilisateur connecté qui clique sur "Découvrir"
  const [showLandingExplicit, setShowLandingExplicit] = useState(false);

  // Modale Vidéo interactive
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Modale Achat Express Mobile Money
  const [quickBuyProduct, setQuickBuyProduct] = useState<any | null>(null);
  const [selectedOperator, setSelectedOperator] = useState('Airtel Money');
  const [buyerPhone, setBuyerPhone] = useState('+241 ');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextSaved = !p.isSaved;
          showToast(nextSaved ? '❤️ Article ajouté à vos favoris' : '🤍 Article retiré des favoris');
          return { ...p, isSaved: nextSaved };
        }
        return p;
      })
    );
  };

  const openVideoModal = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveVideoUrl(url);
  };

  const openQuickBuy = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickBuyProduct(product);
  };

  const handleQuickPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (err) {}

      const orderId = 'ord_' + Date.now();
      showToast('🎉 Paiement Mobile Money validé & Fonds séquestrés !');
      setQuickBuyProduct(null);
      router.push(`/orders/${orderId}`);
    }, 1500);
  };

  // Filtrage et Tri dynamiques
  let filteredProducts = products.filter(p => {
    const matchCity = selectedCity === 'Toutes les villes' || p.city === selectedCity;
    const matchCat = selectedCategory === 'TOUT' || p.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchQuery =
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.district.toLowerCase().includes(query) ||
      p.seller.toLowerCase().includes(query);

    return matchCity && matchCat && matchQuery;
  });

  if (sortBy === 'price_asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'video') {
    filteredProducts = [...filteredProducts].filter(p => p.videoUrl !== null);
  }

  // =========================================================================
  // 1. UTILISATEUR NON CONNECTÉ (OU DÉCONNECTÉ) -> LANDING PAGE COMPLETE
  // =========================================================================
  if (!isLoggedIn || showLandingExplicit) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8F8F8]">
        {/* Toast Notification Flottant */}
        {toastMessage && (
          <div className="fixed top-20 right-4 z-50 px-4 py-3 bg-[#111827] text-white text-xs font-bold rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-2 animate-slide-up">
            <Sparkles className="w-4 h-4 text-[#008A45]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Navbar */}
        <Navbar />

        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Bannière Dynamique Séquestre Live */}
        <section className="bg-emerald-50/80 border-y border-emerald-200/60 py-3.5 px-4">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008A45] animate-ping" />
              <span className="font-black italic text-[#111111] uppercase tracking-wider">
                Séquestre en direct
              </span>
              <span className="text-gray-500 font-medium hidden sm:inline">• 0 Arnaque Garantie</span>
            </div>

            <div className="flex items-center gap-4 font-mono">
              <span className="text-[#008A45] font-black">
                🔒 14 850 000 FCFA sécurisés aujourd'hui
              </span>
              <span className="text-gray-600 font-bold hidden md:inline">
                ⚡ Déblocage instantané Mobile Money
              </span>
            </div>
          </div>
        </section>

        {/* 4. Aperçu du Marché Public */}
        <section id="marche" className="py-12 px-4 max-w-6xl mx-auto w-full space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black italic text-[#111111]">
                Aperçu du Grand Marché
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Vendez et achetez sous séquestre certifié en Afrique Centrale
              </p>
            </div>

            <button
              onClick={openLoginModal}
              className="px-5 py-2.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <span>Rejoindre ZARÉN & Publier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(p => (
              <div
                key={p.id}
                className="card-product group flex flex-col bg-white p-3 rounded-2xl border border-[#E5E5E5] hover:border-[#008A45] transition-all shadow-xs"
              >
                <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden rounded-xl mb-3">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#008A45] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md tracking-wider shadow-sm">
                    SÉQUESTRE
                  </div>
                </div>

                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm sm:text-base font-black text-[#111111]">
                    {new Intl.NumberFormat('fr-FR').format(p.price)} FCFA
                  </span>
                  <span className="text-[10px] text-[#008A45] font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    ✓ Garanti
                  </span>
                </div>

                <h3 className="text-xs text-[#111111] font-black italic line-clamp-2 leading-snug mb-2">
                  {p.title}
                </h3>

                <div className="space-y-2 mt-auto pt-2 border-t border-gray-100">
                  <button
                    onClick={openLoginModal}
                    className="w-full py-2 bg-emerald-50 hover:bg-[#008A45] text-[#008A45] hover:text-white border border-emerald-200 text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Acheter sous Séquestre</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Comment ça marche (#concept) */}
        <HowItWorks />

        {/* 6. Sécurité Escrow (#securite) */}
        <SecurityEscrow />

        {/* 7. Tarifs & Pass Pro (#tarifs) */}
        <Pricing />

        {/* 8. Footer */}
        <Footer />
      </div>
    );
  }

  // =========================================================================
  // 2. UTILISATEUR CONNECTÉ -> AFFICHAGE DIRECT DU GRAND MARCHÉ ZARÉN
  // =========================================================================
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8F8]">
      {/* Toast Notification Flottant */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 px-4 py-3 bg-[#111827] text-white text-xs font-bold rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-2 animate-slide-up">
          <Sparkles className="w-4 h-4 text-[#008A45]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar Minimaliste avec Hamburger Drawer */}
      <Navbar />

      {/* Bandeau de Bienvenue Vendeur Pro Connecté */}
      <section className="bg-white border-b border-[#E5E5E5] px-4 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#008A45] shrink-0">
              <img src={currentUser?.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black italic text-[#111111]">
                  Bonjour {currentUser?.name.split(' ')[0]} 👋
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-[#008A45]">
                  Pass Pro Actif
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-medium">
                🔒 {new Intl.NumberFormat('fr-FR').format(currentUser?.escrowBalance || 0)} FCFA sécurisés sous séquestre
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/seller/dashboard"
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#008A45] text-xs font-bold uppercase tracking-wider border border-emerald-200 flex items-center gap-1.5 transition"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Tableau de Bord</span>
            </Link>

            <Link
              href="/seller/new"
              className="px-4 py-2 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Vendre</span>
            </Link>
          </div>
        </div>
      </section>

      {/* LE GRAND MARCHÉ INTERACTIF (AFFICHÉ DIRECTEMENT) */}
      <main className="flex-1 py-8 px-4 max-w-7xl mx-auto w-full space-y-6">
        
        {/* En-tête et Recherche Dynamique */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black italic text-[#111111] tracking-tight">
              Le Grand Marché ZARÉN
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {filteredProducts.length} annonce(s) vérifiée(s) disponibles avec séquestre Mobile Money Garanti
            </p>
          </div>

          {/* Barre de Recherche Temps Réel */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par article, quartier, marque (ex: iPhone, Louis)..."
              className="w-full text-xs font-semibold pl-10 pr-8 py-3 bg-white border border-[#E5E5E5] focus:border-[#008A45] rounded-full outline-hidden transition shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Barre de Filtres par Villes et Tri */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E5E5E5]">
          
          {/* Filtres de Ville */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {['Toutes les villes', 'Libreville', 'Akanda', 'Port-Gentil', 'Douala', 'Yaoundé'].map(cityName => (
              <button
                key={cityName}
                onClick={() => setSelectedCity(cityName)}
                className={`px-3.5 py-1.5 rounded-full border whitespace-nowrap transition cursor-pointer ${
                  selectedCity === cityName
                    ? 'bg-[#008A45] text-white border-[#008A45] font-bold shadow-xs'
                    : 'bg-[#F8F8F8] text-[#111111] border-[#E5E5E5] hover:border-[#111111] font-medium'
                }`}
              >
                {cityName}
              </button>
            ))}
          </div>

          {/* Sélecteur de Tri */}
          <div className="flex items-center gap-2 shrink-0 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="text-xs font-semibold bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl px-3 py-1.5 outline-hidden focus:border-[#008A45]"
            >
              <option value="recent">⚡ Plus récents</option>
              <option value="price_asc">💰 Prix croissant</option>
              <option value="price_desc">💎 Prix décroissant</option>
              <option value="video">🎥 Vidéo HD uniquement</option>
            </select>
          </div>
        </div>

        {/* Pilules de catégories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#111111] text-white font-bold shadow-xs'
                  : 'bg-white text-gray-600 hover:text-[#111111] hover:bg-gray-100 font-medium border border-[#E5E5E5]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grille des produits */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E5E5E5] space-y-3">
            <Search className="w-8 h-8 text-gray-300 mx-auto" />
            <h3 className="text-sm font-bold text-gray-800">Aucun article ne correspond à votre recherche</h3>
            <p className="text-xs text-gray-500">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('TOUT');
                setSelectedCity('Toutes les villes');
              }}
              className="px-4 py-2 bg-[#008A45] text-white text-xs font-bold rounded-xl"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(p => (
              <div
                key={p.id}
                className="card-product group flex flex-col bg-white p-3 rounded-2xl border border-[#E5E5E5] hover:border-[#008A45] transition-all shadow-xs"
              >
                <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden rounded-xl mb-3">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Bouton Favori ❤️ */}
                  <button
                    onClick={(e) => toggleSave(p.id, e)}
                    className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md hover:bg-white transition cursor-pointer"
                  >
                    <span className="text-xs">{p.isSaved ? '❤️' : '🤍'}</span>
                  </button>

                  <div className="absolute top-2.5 left-2.5 bg-[#008A45] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md tracking-wider shadow-sm">
                    SÉQUESTRE
                  </div>

                  {/* Badge Vidéo Interactif */}
                  {p.videoUrl && (
                    <button
                      onClick={(e) => openVideoModal(p.videoUrl!, e)}
                      className="absolute top-2.5 right-2.5 bg-black/80 hover:bg-black text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md cursor-pointer transition hover:scale-105"
                    >
                      <Play className="w-2.5 h-2.5 fill-white" />
                      <span>Vidéo Démo</span>
                    </button>
                  )}

                  {p.urgentBadge && (
                    <div className="absolute bottom-2.5 left-2.5 bg-[#d97706] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">
                      {p.urgentBadge}
                    </div>
                  )}
                </div>

                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm sm:text-base font-black text-[#111111]">
                    {new Intl.NumberFormat('fr-FR').format(p.price)} FCFA
                  </span>
                  <span className="text-[10px] text-[#008A45] font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    ✓ Garanti
                  </span>
                </div>

                <Link
                  href={`/p/${p.shortCode}`}
                  className="text-xs text-[#111111] font-black italic line-clamp-2 leading-snug mb-2 group-hover:text-[#008A45] transition-colors"
                >
                  {p.title}
                </Link>

                {/* Bouton Achat Express Séquestre */}
                <div className="space-y-2 mt-auto pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-[10px] text-gray-500">
                    <span className="truncate font-medium">📍 {p.city} ({p.district})</span>
                    <span className="font-mono text-[#008A45] font-bold uppercase">{p.shortCode}</span>
                  </div>

                  <button
                    onClick={(e) => openQuickBuy(p, e)}
                    className="w-full py-2 bg-emerald-50 hover:bg-[#008A45] text-[#008A45] hover:text-white border border-emerald-200 text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Achat Express Séquestre</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lien discret pour consulter la Landing Page */}
        <div className="text-center py-6 border-t border-gray-200">
          <button
            onClick={() => setShowLandingExplicit(true)}
            className="text-xs text-gray-500 hover:text-[#008A45] font-semibold underline cursor-pointer"
          >
            ℹ️ Découvrir le fonctionnement du séquestre & les tarifs (Landing Page)
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* MODALE VIDÉO HD */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src={activeVideoUrl}
              controls
              autoPlay
              playsInline
              className="w-full aspect-video object-contain"
            />
          </div>
        </div>
      )}

      {/* MODALE ACHAT EXPRESS MOBILE MONEY */}
      {quickBuyProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#E5E5E5] space-y-4 animate-slide-up">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#008A45] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black italic text-sm text-[#111111]">Achat Sécurisé ZARÉN</h3>
                  <span className="text-[10px] text-gray-500 font-medium">Séquestre automatique Mobile Money</span>
                </div>
              </div>
              <button
                onClick={() => setQuickBuyProduct(null)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Article Récapitulatif */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5]">
              <img
                src={quickBuyProduct.images[0]}
                alt=""
                className="w-12 h-12 rounded-xl object-cover border border-[#E5E5E5]"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#111111] truncate">{quickBuyProduct.title}</h4>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs font-black text-[#008A45]">
                    {new Intl.NumberFormat('fr-FR').format(quickBuyProduct.price)} FCFA
                  </span>
                  <span className="text-[10px] text-gray-500">📍 {quickBuyProduct.city}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleQuickPaymentSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                  Moyen de paiement Mobile Money
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {['Airtel Money', 'Moov Money', 'MTN Money', 'Orange Money'].map(op => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setSelectedOperator(op)}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        selectedOperator === op
                          ? 'border-[#008A45] bg-emerald-50 text-[#008A45]'
                          : 'border-[#E5E5E5] bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Numéro Mobile Money pour validation push
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+241 07 00 00 00"
                    className="w-full text-xs font-mono font-bold pl-10 pr-3 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] focus:bg-white outline-hidden focus:border-[#008A45]"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 leading-relaxed font-medium">
                🔒 <strong>Garantie Séquestre :</strong> L'argent reste consigné sur Zarén. Le vendeur n'est payé qu'après votre confirmation de livraison.
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {isProcessingPayment
                    ? 'Séquestration en cours...'
                    : `Bloquer & Payer ${new Intl.NumberFormat('fr-FR').format(quickBuyProduct.price)} FCFA`}
                </span>
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
