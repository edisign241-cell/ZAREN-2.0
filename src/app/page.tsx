'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
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
  Award,
  ShoppingBag,
  ShoppingCart
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { zarenStore } from '@/db/store';
import { Product } from '@/types';

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

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn, currentUser, openLoginModal } = useAuth();
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState('TOUT');
  const [selectedCity, setSelectedCity] = useState('Toutes les villes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'video'>('recent');
  const [products, setProducts] = useState<Product[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setProducts(zarenStore.getProducts());
  }, []);

  // Modale Vidéo interactive
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Modale Achat Express Mobile Money
  const [quickBuyProduct, setQuickBuyProduct] = useState<any | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextSaved = !p.isSaved;
          showToast(nextSaved ? '❤️ Article ajouté à vos favoris' : '🤍 Article retiré des favoris');
          return { ...p, isSaved: nextSaved };
        }
        return p;
      })
    );
  };

  const handleAddToCart = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: p.id,
      shortCode: p.shortCode,
      title: p.title,
      price: p.price,
      image: p.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
      sellerName: p.seller?.businessName || 'Vendeur ZARÉN',
      city: p.city,
      district: p.district
    });
    showToast('🛒 Article ajouté au panier !');
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
  let filteredProducts = products.filter((p) => {
    const matchCity = selectedCity === 'Toutes les villes' || p.city === selectedCity;
    const matchCat = selectedCategory === 'TOUT' || p.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchQuery =
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      (p.district && p.district.toLowerCase().includes(query)) ||
      (p.seller?.businessName && p.seller.businessName.toLowerCase().includes(query));

    return matchCity && matchCat && matchQuery;
  });

  if (sortBy === 'price_asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'video') {
    filteredProducts = [...filteredProducts].filter((p) => !!p.videoUrl);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8F8] font-sans">
      {/* Toast Notification Flottant */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 px-4 py-3 bg-[#111827] text-white text-xs font-bold rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-2 animate-slide-up">
          <Sparkles className="w-4 h-4 text-[#008A45]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Navbar Principale */}
      <Navbar />

      {/* 2. SI L'UTILISATEUR N'EST PAS CONNECTÉ : AFFICHER L'HERO SECTION ET LE BANDEAU LIVE */}
      {!isLoggedIn && (
        <>
          <Hero />
          <section className="bg-emerald-50/80 border-y border-emerald-200/60 py-3 px-4">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#008A45] animate-ping" />
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
        </>
      )}

      {/* 3. BARRE HORIZONTALE DES CATÉGORIES */}
      <div className="bg-white border-b border-gray-200 py-2.5 px-4 overflow-x-auto no-scrollbar shadow-2xs sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-2 shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                const el = document.getElementById('marche');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#008A45] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. LE GRAND MARCHÉ ZARÉN (ACCESSIBLE À TOUS, PRIORITAIRE POUR L'UTILISATEUR CONNECTÉ) */}
      <main id="marche" className="flex-1 py-8 px-4 max-w-7xl mx-auto w-full space-y-6">
        
        {/* En-tête et Recherche Dynamique */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black italic text-[#111111] tracking-tight">
                Le Grand Marché ZARÉN
              </h2>
              {isLoggedIn && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#008A45] text-[10px] font-black uppercase tracking-wider">
                  En Direct
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {filteredProducts.length} annonce(s) vérifiée(s) sous séquestre Mobile Money Garanti (0 Arnaque)
            </p>
          </div>

          {/* Barre de Recherche Temps Réel */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un article, un quartier (ex: iPhone, Louis)..."
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E5E5E5] shadow-2xs">
          
          {/* Filtres de Ville */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {['Toutes les villes', 'Libreville', 'Akanda', 'Port-Gentil', 'Douala', 'Yaoundé'].map((cityName) => (
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

        {/* Grille des produits */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E5E5E5] space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#008A45] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black italic text-gray-900">
                {products.length === 0
                  ? 'Le Grand Marché ZARÉN est prêt pour vos articles !'
                  : 'Aucun article ne correspond à votre recherche'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {products.length === 0
                  ? 'Soyez le premier vendeur à publier un article avec séquestre Mobile Money certifié.'
                  : 'Essayez d\'ajuster vos filtres de ville ou de catégorie pour découvrir d\'autres opportunités.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              {products.length === 0 ? (
                <Link
                  href="/seller/new"
                  className="px-5 py-3 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition"
                >
                  + Vendre un article maintenant
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('TOUT');
                    setSelectedCity('Toutes les villes');
                  }}
                  className="px-4 py-2.5 bg-[#008A45] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((p) => (
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
                    title="Ajouter aux favoris"
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
                      <span>Vidéo HD</span>
                    </button>
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

                {/* Actions Article : Ajouter au panier & Achat Express */}
                <div className="space-y-2 mt-auto pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-[10px] text-gray-500">
                    <span className="truncate font-medium">📍 {p.city} ({p.district})</span>
                    <span className="font-mono text-[#008A45] font-bold uppercase">{p.shortCode}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={(e) => handleAddToCart(p, e)}
                      className="py-2 px-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                      title="Ajouter au Panier"
                    >
                      <ShoppingCart className="w-3 h-3 text-[#008A45]" />
                      <span>Panier</span>
                    </button>

                    <button
                      onClick={(e) => openQuickBuy(p, e)}
                      className="py-2 px-2 bg-emerald-50 hover:bg-[#008A45] text-[#008A45] hover:text-white border border-emerald-200 text-[11px] font-bold uppercase rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                      title="Achat Express Séquestre"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Acheter</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* 5. SI L'UTILISATEUR N'EST PAS CONNECTÉ : AFFICHER LES SECTIONS D'INFORMATIONS DU BAS */}
      {!isLoggedIn && (
        <>
          <HowItWorks />
          <SecurityEscrow />
          <Pricing />
        </>
      )}

      {/* 6. Footer */}
      <Footer />

      {/* MODALE VIDÉO HD */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src={activeVideoUrl}
              controls
              autoPlay
              className="w-full aspect-video object-contain"
            />
          </div>
        </div>
      )}

      {/* MODALE ACHAT EXPRESS SÉQUESTRÉ */}
      {quickBuyProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#008A45] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black italic text-gray-900">
                  Achat Sécurisé sous Séquestre
                </h3>
              </div>
              <button
                onClick={() => setQuickBuyProduct(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl flex items-center gap-3 border border-gray-100">
              <img
                src={quickBuyProduct.images?.[0]}
                alt={quickBuyProduct.title}
                className="w-14 h-14 rounded-xl object-cover border border-gray-200"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black italic text-gray-900 truncate">
                  {quickBuyProduct.title}
                </h4>
                <div className="text-xs font-black text-[#008A45] font-mono">
                  {new Intl.NumberFormat('fr-FR').format(quickBuyProduct.price)} FCFA
                </div>
                <div className="text-[10px] text-gray-400">
                  📍 {quickBuyProduct.city} ({quickBuyProduct.district})
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-950 font-medium space-y-1">
              <div className="font-bold flex items-center gap-1 text-emerald-900">
                <Lock className="w-3.5 h-3.5 text-[#008A45]" />
                <span>Garantie ZARÉN Séquestre :</span>
              </div>
              <p className="leading-relaxed">
                Votre argent est consigné sous séquestre et versé au vendeur uniquement après réception et inspection de l'article.
              </p>
            </div>

            <form onSubmit={handleQuickPaymentSubmit} className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Numéro Mobile Money (Airtel / Moov)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+241 07 XX XX XX"
                  defaultValue="+241 07 45 88 12"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold font-mono focus:border-[#008A45] outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-3.5 px-4 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <span>Paiement en cours...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Payer {new Intl.NumberFormat('fr-FR').format(quickBuyProduct.price)} FCFA sous Séquestre →</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
