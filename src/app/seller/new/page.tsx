'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Sparkles,
  Camera,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Check,
  Share2,
  Copy,
  Bot,
  MessageSquare,
  Globe,
  MapPin,
  Building,
  Navigation
} from 'lucide-react';
import { zarenStore } from '@/db/store';
import { generateShortCode, formatPrice } from '@/lib/utils';
import AIProductEnhancerModal from '@/components/seller/AIProductEnhancerModal';
import { generateProductCopy, AICopyResult } from '@/lib/ai/geminiCopywriter';
import PublishPaymentModal from '@/components/seller/PublishPaymentModal';
import { useAuth } from '@/context/AuthContext';
import confetti from 'canvas-confetti';

const COUNTRIES = [
  {
    code: 'GA',
    name: 'Gabon',
    flag: '🇬🇦',
    currency: 'FCFA',
    cities: ['Libreville', 'Akanda', 'Owendo', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda', 'Lambaréné', 'Mouila', 'Tchibanga', 'Koulamoutou', 'Makokou', 'Bitam', 'Gamba']
  },
  {
    code: 'CM',
    name: 'Cameroun',
    flag: '🇨🇲',
    currency: 'FCFA',
    cities: ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Bamenda', 'Maroua', 'Ngaoundéré', 'Kribi', 'Limbe', 'Bertoua', 'Ebolowa']
  },
  {
    code: 'CG',
    name: 'Congo-Brazzaville',
    flag: '🇨🇬',
    currency: 'FCFA',
    cities: ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Oyo', 'Ouesso', 'Impfondo']
  },
  {
    code: 'CD',
    name: 'RD Congo',
    flag: '🇨🇩',
    currency: 'FCFA',
    cities: ['Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Kisangani', 'Matadi', 'Kolwezi', 'Kananga', 'Mbuji-Mayi']
  },
  {
    code: 'TD',
    name: 'Tchad',
    flag: '🇹🇩',
    currency: 'FCFA',
    cities: ["N'Djamena", 'Moundou', 'Sarh', 'Abéché', 'Kélo', 'Koumra', 'Pala']
  },
  {
    code: 'GQ',
    name: 'Guinée Équatoriale',
    flag: '🇬🇶',
    currency: 'FCFA',
    cities: ['Malabo', 'Bata', 'Oyala', 'Ebebiyín', 'Mongomo', 'Luba']
  },
  {
    code: 'CF',
    name: 'Centrafrique',
    flag: '🇨🇫',
    currency: 'FCFA',
    cities: ['Bangui', 'Bimbo', 'Berbérati', 'Carnot', 'Bouar', 'Bambari']
  }
];

export default function NewProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState('iPhone 14 Pro Max 256Go Deep Purple');
  const [description, setDescription] = useState(
`✨ POINTS FORTS (SellerCoach) :
• iPhone 14 Pro Max 256Go Deep Purple d'origine
• Batterie à 96%, écran Retina OLED sans rayure
• Vendu avec boîte d'origine, câble et coque MagSafe
• Localisation : Gabon (Libreville - Quartier Louis)

🛡️ SÉCURITÉ SÉQUESTRE ZARÉN :
Paiement consigné sur compte séquestre. Les fonds ne sont versés au vendeur qu'après confirmation de votre conformité !`
  );
  const [price, setPrice] = useState<number | ''>(480000);
  const [stockQuantity, setStockQuantity] = useState(1);
  
  // Localisation détaillée
  const [selectedCountryCode, setSelectedCountryCode] = useState('GA');
  const [city, setCity] = useState('Libreville');
  const [district, setDistrict] = useState('Quartier Louis');
  const [landmark, setLandmark] = useState('En face de la Pharmacie des Forestiers, Immeuble ABC');
  
  const [deliveryFee, setDeliveryFee] = useState<number | ''>(2000);
  const [pickupAvailable, setPickupAvailable] = useState(true);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);
  const [isAIOptimizing, setIsAIOptimizing] = useState(false);
  const { currentUser } = useAuth();
  const isPro = currentUser?.account_tier === 'PRO' || currentUser?.plan === 'PRO';

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<any>(null);

  const [createdProduct, setCreatedProduct] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);

  const selectedCountry = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];

  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    const countryObj = COUNTRIES.find(c => c.code === code) || COUNTRIES[0];
    if (countryObj.cities.length > 0) {
      setCity(countryObj.cities[0]);
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Optimisation IA Invisible SellerCoach en direct
  const handleInvisibleAIOptimize = async () => {
    setIsAIOptimizing(true);
    try {
      const res = await generateProductCopy(title || 'Article de mode & high-tech', 'qualité, séquestre');
      setTitle(res.suggestedTitle);
      setDescription(
`${res.suggestedDescription}

📍 LOCALISATION :
${selectedCountry.flag} ${selectedCountry.name} • ${city} (${district})${landmark ? ` - ${landmark}` : ''}

🛡️ SÉCURITÉ SÉQUESTRE ZARÉN :
Votre argent reste bloqué sur ZARÉN et n'est remis au vendeur qu'après vérification de votre colis !`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsAIOptimizing(false);
    }
  };

  const handleApplyAI = (aiResult: AICopyResult) => {
    setTitle(aiResult.suggestedTitle);
    setDescription(aiResult.suggestedDescription);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || Number(price) <= 0) {
      alert('Veuillez renseigner au minimum un titre et un prix valide.');
      return;
    }

    const seller = zarenStore.getSellerProfile();
    const shortCode = `zrn-${generateShortCode(4).toLowerCase()}`;

    const newProd = zarenStore.addProduct({
      sellerId: seller.id,
      shortCode,
      title: title.trim(),
      description: description.trim() || 'Article vérifié par Zarén.',
      price: Number(price),
      currency: 'XAF',
      stockQuantity: Number(stockQuantity),
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'],
      city: `${selectedCountry.flag} ${selectedCountry.name} - ${city}`,
      district: `${district}${landmark ? ` (${landmark})` : ''}`,
      deliveryFee: Number(deliveryFee) || 0,
      pickupAvailable,
      status: isPro ? 'ACTIVE' : 'OUT_OF_STOCK', // Standard: inactive until fee is paid
    });

    const productPayload = {
      ...newProd,
      countryName: selectedCountry.name,
      countryFlag: selectedCountry.flag,
      cityName: city,
      districtName: district,
      landmarkName: landmark,
    };

    // INTERCEPTION MÉTIER : Si Vendeur Standard -> Déclenchement du paiement 500 FCFA
    if (!isPro) {
      setPendingProduct(productPayload);
      setIsPaymentModalOpen(true);
      return;
    }

    // Si Vendeur Pro -> Publication directe sans frais
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (err) {}

    setCreatedProduct(productPayload);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    if (pendingProduct) {
      zarenStore.updateProductStatus(pendingProduct.id, 'ACTIVE');
      setCreatedProduct(pendingProduct);
    }
  };

  const getShareUrl = () => {
    if (typeof window !== 'undefined' && createdProduct) {
      return `${window.location.origin}/p/${createdProduct.shortCode}`;
    }
    return `https://zaren.app/p/${createdProduct?.shortCode}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getWhatsAppStatusText = () => {
    if (!createdProduct) return '';
    return `🔥 DISPONIBLE : ${createdProduct.title}
💰 Prix : ${formatPrice(createdProduct.price)}
📍 ${createdProduct.countryFlag} ${createdProduct.countryName} • ${createdProduct.cityName} (${createdProduct.districtName})${createdProduct.landmarkName ? `\n🏢 Lieu-dit : ${createdProduct.landmarkName}` : ''}
🛡️ Paiement sécurisé par Séquestre ZARÉN (Zéro arnaque)

👉 Voir les photos et commander en toute sécurité :
${getShareUrl()}`;
  };

  const getFacebookText = () => {
    if (!createdProduct) return '';
    return `📢 NOUVEL ARRIVAGE : ${createdProduct.title}
💵 Prix : ${formatPrice(createdProduct.price)}
📍 ${createdProduct.countryFlag} ${createdProduct.countryName} - ${createdProduct.cityName} (${createdProduct.districtName})
✅ Garanti conforme ou remboursé sous Séquestre ZARÉN.
Lien d'achat direct : ${getShareUrl()}`;
  };

  const copyWhatsAppStatus = () => {
    navigator.clipboard.writeText(getWhatsAppStatusText());
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* NAVBAR AVEC UNIQUEMENT MENU, LOGO ET TITRE */}
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 pb-28">
        
        {/* ÉCRAN DE PARTAGE VIRAL IMMÉDIAT (SELLERCOACH WORKFLOW) */}
        {createdProduct ? (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E5E5] shadow-md my-4 space-y-6 animate-fade-in text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#008A45] flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-xl font-black italic text-[#111111] mb-1">
                Article publié avec succès !
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Vos templates de diffusion virale <strong>SellerCoach</strong> sont prêts avec la localisation exacte.
              </p>
            </div>

            {/* Récapitulatif Localisation */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center justify-center gap-2">
              <span>{createdProduct.countryFlag} {createdProduct.countryName}</span>
              <span>•</span>
              <span>{createdProduct.cityName}</span>
              <span>•</span>
              <span>{createdProduct.districtName}</span>
              {createdProduct.landmarkName && (
                <>
                  <span>•</span>
                  <span className="font-normal text-emerald-800 italic">{createdProduct.landmarkName}</span>
                </>
              )}
            </div>

            {/* Deep Link Court */}
            <div className="p-4 bg-[#F8F8F8] rounded-2xl border border-[#E5E5E5] text-left space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Deep Link Court ZARÉN
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getShareUrl()}
                  className="bg-white text-xs font-mono font-bold p-2.5 rounded-xl border border-[#E5E5E5] flex-1 outline-hidden"
                />
                <button
                  onClick={copyLink}
                  className="py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold transition cursor-pointer"
                >
                  {copied ? 'Copié !' : 'Copier'}
                </button>
              </div>
            </div>

            {/* TEMPLATES SELLERCOACH VIRAUX */}
            <div className="space-y-4 text-left pt-2">
              <h3 className="text-xs font-black italic uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Templates de Partage Réseaux Sociaux (SellerCoach)</span>
              </h3>

              {/* Option A : WhatsApp Status */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>💬</span> Template WhatsApp Status & Groupes
                  </span>
                  <button
                    onClick={copyWhatsAppStatus}
                    className="text-[10px] font-bold text-[#008A45] hover:underline cursor-pointer"
                  >
                    {copiedStatus ? '✓ Texte copié !' : 'Copier le texte'}
                  </button>
                </div>
                <p className="text-xs text-gray-700 font-mono whitespace-pre-line bg-white p-3 rounded-xl border border-emerald-100 leading-relaxed">
                  {getWhatsAppStatusText()}
                </p>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getWhatsAppStatusText())}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-2 shadow-sm text-center transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Partager directement sur WhatsApp</span>
                </a>
              </div>

              {/* Option B : Facebook & Telegram */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                    <span>📱</span> Template Facebook & Telegram
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getFacebookText());
                      alert('Template Facebook copié !');
                    }}
                    className="text-[10px] font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    Copier le texte
                  </button>
                </div>
                <p className="text-xs text-gray-700 font-mono whitespace-pre-line bg-white p-3 rounded-xl border border-blue-100 leading-relaxed">
                  {getFacebookText()}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-4">
              <Link
                href={`/p/${createdProduct.shortCode}`}
                className="flex-1 py-3 bg-[#F8F8F8] hover:bg-gray-200 text-[#111111] text-xs font-bold rounded-xl border border-[#E5E5E5] text-center transition"
              >
                Voir la fiche acheteur
              </Link>
              <Link
                href="/seller/dashboard"
                className="flex-1 py-3 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold rounded-xl shadow-xs text-center transition"
              >
                Espace Vendeur
              </Link>
            </div>

          </div>
        ) : (
          /* FORMULAIRE DE PUBLICATION COMPLET AVEC CHOIX PAYS, VILLE, QUARTIER ET LIEU-DIT */
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#E5E5E5] shadow-sm my-4 space-y-6 animate-fade-in">
            
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
              <div>
                <h1 className="text-lg font-black italic uppercase text-[#111111]">
                  Déposer une annonce
                </h1>
                <span className="text-xs text-gray-500 font-medium">
                  Afrique Centrale • Assistant IA SellerCoach & Séquestre garanti
                </span>
              </div>

              <button
                type="button"
                onClick={handleInvisibleAIOptimize}
                disabled={isAIOptimizing}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>{isAIOptimizing ? 'Optimisation...' : '✨ IA SellerCoach'}</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* SECTION PHOTOS DU PRODUIT */}
              <div className="space-y-2">
                <label className="block text-xs font-black italic uppercase tracking-wider text-[#111111]">
                  Photos du produit ({images.length}) *
                </label>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-[#E5E5E5] bg-neutral-100 group shadow-xs">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-[#008A45] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm">
                          Principale
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Bouton Ajouter Photo */}
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#008A45] hover:bg-emerald-50/40 bg-[#F8F8F8] flex flex-col items-center justify-center p-2 text-center cursor-pointer transition">
                    <Camera className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-[10px] text-gray-600 font-bold">+ Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          files.forEach(f => {
                            const url = URL.createObjectURL(f);
                            setImages(prev => [...prev, url]);
                          });
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* TITRE DE L'ARTICLE */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black italic uppercase tracking-wider text-[#111111]">
                    Titre de l'article *
                  </label>
                  <button
                    type="button"
                    onClick={handleInvisibleAIOptimize}
                    className="text-[10px] text-purple-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>Optimiser avec SellerCoach</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: iPhone 14 Pro Max 256Go Deep Purple"
                  className="w-full text-xs font-semibold p-3.5 border border-[#E5E5E5] bg-[#F8F8F8] focus:bg-white rounded-xl outline-hidden focus:border-[#008A45] transition"
                />
              </div>

              {/* PRIX ET STOCK */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-black italic uppercase tracking-wider text-[#111111]">Prix ({selectedCountry.currency}) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="480000"
                    className="w-full text-xs font-black text-[#008A45] p-3.5 border border-[#E5E5E5] bg-[#F8F8F8] focus:bg-white rounded-xl outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-black italic uppercase tracking-wider text-[#111111]">Stock disponible</label>
                  <input
                    type="number"
                    min={1}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full text-xs font-medium p-3.5 border border-[#E5E5E5] bg-[#F8F8F8] rounded-xl outline-hidden"
                  />
                </div>
              </div>

              {/* DESCRIPTION SELLERCOACH */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black italic uppercase tracking-wider text-[#111111]">
                    Description (Format Réseaux Sociaux & Bullet Points)
                  </label>
                  <span className="text-[10px] text-gray-400 font-mono">Format ultra-concis</span>
                </div>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="L'IA SellerCoach mettra en forme vos points forts..."
                  className="w-full text-xs font-medium p-3.5 border border-[#E5E5E5] bg-[#F8F8F8] focus:bg-white rounded-xl outline-hidden focus:border-[#008A45] transition whitespace-pre-line font-mono leading-relaxed"
                />
              </div>

              {/* ========================================================= */}
              {/* SECTION LOCALISATION : PAYS, VILLES, QUARTIERS & LIEU-DIT */}
              {/* ========================================================= */}
              <div className="p-4 sm:p-5 bg-[#F8F8F8] rounded-2xl border border-[#E5E5E5] space-y-3.5">
                <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-2.5">
                  <MapPin className="w-4 h-4 text-[#008A45]" />
                  <h3 className="text-xs font-black italic uppercase tracking-wider text-[#111111]">
                    Localisation de l'article (Afrique Centrale)
                  </h3>
                </div>

                {/* 1. CHOIX DU PAYS */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-gray-600 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-[#008A45]" />
                    <span>Pays *</span>
                  </label>
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full text-xs font-bold p-3 bg-white border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45] transition cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.currency})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. CHOIX DE LA VILLE ET QUARTIER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Ville */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-gray-600 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-[#008A45]" />
                      <span>Ville *</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs font-medium p-3 bg-white border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45] transition cursor-pointer"
                    >
                      {selectedCountry.cities.map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quartier */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-gray-600">Quartier *</label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Ex: Quartier Louis, Bastos, Akwa..."
                      className="w-full text-xs font-semibold p-3 bg-white border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45] transition"
                    />
                  </div>

                </div>

                {/* 3. LIEU-DIT / REPÈRE DE LIVRAISON EXACT */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-gray-600 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-[#008A45]" />
                    <span>Lieu-dit & Repère de livraison exact *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Ex: En face de la Pharmacie des Forestiers, Immeuble ABC 2e étage"
                    className="w-full text-xs font-medium p-3 bg-white border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45] transition"
                  />
                  <p className="text-[10px] text-gray-500">Précision pour le livreur et la remise en main propre sous séquestre.</p>
                </div>

              </div>

              {/* BOUTON DE SOUMISSION */}
              <button
                type="submit"
                className="w-full py-4 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg mt-4 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
              >
                <Share2 className="w-4 h-4" />
                <span>Publier & Générer le Partage Viral WhatsApp</span>
              </button>
            </form>

            {/* AI Modal */}
            <AIProductEnhancerModal
              isOpen={showAIModal}
              currentTitle={title}
              onClose={() => setShowAIModal(false)}
              onApply={handleApplyAI}
            />

            {/* Standard Seller 500 FCFA Publication Payment Modal */}
            <PublishPaymentModal
              isOpen={isPaymentModalOpen}
              onClose={() => setIsPaymentModalOpen(false)}
              productId={pendingProduct?.id || ''}
              productTitle={pendingProduct?.title || title}
              productPrice={Number(pendingProduct?.price || price || 0)}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        )}

      </main>
    </div>
  );
}
