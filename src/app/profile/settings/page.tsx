'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowLeft,
  Camera,
  ShieldCheck,
  User,
  Store,
  Bell,
  Check,
  LogOut,
  Trash2,
  Award,
  Sparkles,
  Clock,
  MapPin,
  Phone,
  Eye,
  ExternalLink,
  UploadCloud,
  ImageIcon,
  Tag,
  DollarSign,
  Zap,
  CheckCircle2
} from 'lucide-react';

const PRESET_BANNERS = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80'
];

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { logout, currentUser, switchAccountTier, upgradeToPro, downgradeToStandard } = useAuth();
  
  const currentTier = currentUser?.account_tier || (currentUser?.plan === 'PRO' ? 'PRO' : 'STANDARD');
  const isPro = currentTier === 'PRO';

  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
  const [fullName, setFullName] = useState(currentUser?.name || 'Marlène Obame');
  const [username, setUsername] = useState(currentUser?.username || '@marlene_dressing');
  const [phone, setPhone] = useState(currentUser?.phone || '+241 07 45 88 12');
  const [city, setCity] = useState(currentUser?.city || 'Libreville');
  const [district, setDistrict] = useState(currentUser?.district || 'Quartier Louis');
  
  // Section Vendeur Pro
  const [businessName, setBusinessName] = useState(currentUser?.businessName || 'Marlène Dressing & High-Tech');
  const [businessSlogan, setBusinessSlogan] = useState('Vêtements chics importés & Accessoires Apple d\'origine certifiée');
  const [businessDescription, setBusinessDescription] = useState('Boutique premium certifiée à Libreville depuis 2022. Tous nos produits sont neufs, testés et garantis conformes sous séquestre ZARÉN.');
  const [shopBannerUrl, setShopBannerUrl] = useState('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80');
  const [shopLogoUrl, setShopLogoUrl] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
  const [shopAddress, setShopAddress] = useState('Galerie Marchande Louis, Rez-de-chaussée, Boutique N°14');
  const [shopHours, setShopHours] = useState('Lun - Sam : 08h30 - 19h00 • Dimanche : 10h00 - 16h00');
  const [shopWhatsapp, setShopWhatsapp] = useState('+241 07 45 88 12');
  
  const [payoutMethod, setPayoutMethod] = useState('AIRTEL_MONEY');
  const [payoutPhone, setPayoutPhone] = useState('07 45 88 12');

  // Préférences
  const [notifWhatsApp, setNotifWhatsApp] = useState(true);
  const [notifSms, setNotifSms] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('✅ Vos informations de profil ont été enregistrées avec succès !');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setShopBannerUrl(url);
    }
  };

  const handleShopLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setShopLogoUrl(url);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#111111] py-6 px-4 font-sans">
      <div className="max-w-xl mx-auto space-y-5 pb-16">
        
        {/* En-tête de la page */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white border border-[#E5E5E5] text-[#111111] hover:bg-neutral-50 shadow-xs transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-black italic text-[#111111] tracking-tight">Paramètres du profil</h1>
              <span className="text-xs text-gray-500 font-medium">
                {isPro ? 'Gestion du compte Marchand Pro & Vitrine' : 'Gestion du compte Vendeur Standard (Style Vinted)'}
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black italic bg-emerald-50 text-[#008A45] border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> VÉRIFIÉ
          </span>
        </div>

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="p-3 bg-[#111111] text-white text-xs font-bold rounded-xl shadow-lg border border-neutral-700 flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-[#008A45]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* SELECTEUR DE FORMULE (POUR TESTER OU BASCULER FACILEMENT) */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#E5E5E5] shadow-xs flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-gray-400">Formule actuelle du compte</span>
            <div className="flex items-center gap-1.5 font-bold text-xs">
              {isPro ? (
                <span className="text-amber-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Vendeur Pro (Pass Pro 4 500 FCFA/mois)
                </span>
              ) : (
                <span className="text-gray-700 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#008A45]" /> Vendeur Standard (500 FCFA / annonce)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                switchAccountTier('STANDARD');
                setToastMessage('Bascule en Vendeur Standard (500 FCFA/acte)');
              }}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition cursor-pointer ${
                !isPro ? 'bg-[#111827] text-white border-black' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => {
                switchAccountTier('PRO');
                setToastMessage('⭐ Bascule en Vendeur Pro (Pass Pro 4 500 FCFA/mois)');
              }}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition cursor-pointer ${
                isPro ? 'bg-[#008A45] text-white border-emerald-600' : 'bg-emerald-50 text-[#008A45] border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Pro
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* CARTE 1 : INFORMATIONS PERSONNELLES */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E5E5] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-3">
              <User className="w-4 h-4 text-[#008A45]" />
              <h2 className="text-xs font-black italic uppercase tracking-wider text-[#111111]">
                1. Informations personnelles
              </h2>
            </div>

            {/* Photo / Avatar */}
            <div className="flex items-center gap-4 pt-1">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#008A45] shadow-sm shrink-0 bg-neutral-100">
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1.5 flex-1">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#008A45] text-xs font-bold rounded-xl border border-emerald-200 cursor-pointer shadow-xs transition">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Changer la photo de profil</span>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
                <p className="text-[10px] text-gray-500 font-medium">Visible sur votre profil et vos annonces</p>
              </div>
            </div>

            {/* Nom complet */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase text-gray-600">Nom et prénom *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Marlène Obame"
                className="w-full text-xs font-semibold px-3.5 py-3 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
              />
            </div>

            {/* Pseudo @username */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase text-gray-600">Nom d'utilisateur (@pseudo) *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="@marlene_dressing"
                  className="w-full text-xs font-mono font-bold px-3.5 py-3 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                />
              </div>
              <span className="text-[10px] text-gray-400">Identifiant public pour votre dressing ZARÉN</span>
            </div>

            {/* Téléphone */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase text-gray-600">Numéro Mobile Money (Airtel / Moov) *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+241 07 45 88 12"
                className="w-full text-xs font-mono font-bold px-3.5 py-3 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
              />
            </div>

            {/* Ville & Quartier */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase text-gray-600">Ville</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs font-bold px-3.5 py-3 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                >
                  <option value="Libreville">Libreville (Gabon)</option>
                  <option value="Port-Gentil">Port-Gentil (Gabon)</option>
                  <option value="Franceville">Franceville (Gabon)</option>
                  <option value="Oyem">Oyem (Gabon)</option>
                  <option value="Douala">Douala (Cameroun)</option>
                  <option value="Yaoundé">Yaoundé (Cameroun)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase text-gray-600">Quartier / Localisation</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Ex: Louis, Akanda, Glass"
                  className="w-full text-xs font-semibold px-3.5 py-3 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                />
              </div>
            </div>
          </div>

          {/* CAS 1 : SI VENDEUR STANDARD -> BANNIÈRE & CTA D'UPGRADE PRO (SANS FORMULAIRES BOUTIQUE) */}
          {!isPro ? (
            <div className="bg-linear-to-br from-neutral-900 via-neutral-900 to-neutral-800 rounded-3xl p-6 text-white border border-neutral-700 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black italic text-white">
                    Passez au Pass Pro (4 500 FCFA / mois)
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-neutral-950">
                  RECOMMANDÉ
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Vous utilisez actuellement la formule <strong className="text-white">Vendeur Standard</strong> avec facturation unitaire de <strong className="text-white">500 FCFA / publication</strong>.
              </p>

              <div className="space-y-2 pt-2 border-t border-neutral-700/80 text-xs">
                <div className="flex items-center gap-2 text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0" />
                  <span><strong>Publications illimitées</strong> sans frais unitaires</span>
                </div>
                <div className="flex items-center gap-2 text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0" />
                  <span><strong>Vitrine Boutique Marchande</strong> avec bannière HD & logo officiel</span>
                </div>
                <div className="flex items-center gap-2 text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0" />
                  <span><strong>Badge officiel</strong> « Vendeur Vérifié ZARÉN »</span>
                </div>
                <div className="flex items-center gap-2 text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0" />
                  <span><strong>Assistant commercial IA</strong> <em>SellerCoach</em> illimité</span>
                </div>
                <div className="flex items-center gap-2 text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-[#008A45] shrink-0" />
                  <span><strong>Déblocage prioritaire</strong> des fonds de vente</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  upgradeToPro();
                  setToastMessage('⭐ Félicitations ! Votre compte est maintenant Vendeur Pro.');
                }}
                className="w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer mt-3"
              >
                <Zap className="w-4 h-4" />
                <span>Activer le Pass Pro (4 500 FCFA/mois)</span>
              </button>
            </div>
          ) : (
            /* CAS 2 : SI VENDEUR PRO -> SECTION PERSONNALISATION BOUTIQUE COMPLÈTE */
            <div className="bg-white rounded-2xl p-5 border border-[#E5E5E5] shadow-xs space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#008A45]" />
                  <h2 className="text-xs font-black italic uppercase tracking-wider text-[#111111]">
                    2. Vitrine Boutique Marchande & Pass Pro
                  </h2>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black italic bg-amber-100 text-amber-900 border border-amber-200">
                  PASS PRO ACTIF
                </span>
              </div>

              {/* BANNIÈRE DE COUVERTURE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase text-gray-700">
                    Bannière de couverture de la boutique *
                  </label>
                  <span className="text-[10px] text-gray-400 font-mono">Format 16:9</span>
                </div>

                <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-[#E5E5E5] bg-neutral-900 group shadow-inner">
                  <img
                    src={shopBannerUrl}
                    alt="Bannière Boutique"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <label className="px-3 py-1.5 bg-white/90 hover:bg-white text-[#111111] text-xs font-bold rounded-xl cursor-pointer shadow-md flex items-center gap-1.5 transition">
                      <UploadCloud className="w-3.5 h-3.5 text-[#008A45]" />
                      <span>Changer la bannière HD</span>
                      <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-gray-500 font-bold">Thèmes :</span>
                  {PRESET_BANNERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setShopBannerUrl(preset)}
                      className={`w-12 h-7 rounded-lg overflow-hidden border-2 transition ${shopBannerUrl === preset ? 'border-[#008A45] scale-105 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={preset} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* LOGO BOUTIQUE */}
              <div className="flex items-center gap-4 p-3 bg-[#F8F8F8] rounded-2xl border border-[#E5E5E5]">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#E5E5E5] bg-white shrink-0 shadow-xs">
                  <img src={shopLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 flex-1">
                  <span className="text-xs font-bold text-[#111111] block">Logo de l'enseigne marchande</span>
                  <label className="inline-flex items-center gap-1 text-[11px] font-bold text-[#008A45] hover:underline cursor-pointer">
                    <Camera className="w-3 h-3" />
                    <span>Modifier le logo de vitrine</span>
                    <input type="file" accept="image/*" onChange={handleShopLogoChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* NOM DE L'ENSEIGNE */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase text-gray-600">Nom officiel de l'enseigne *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ex: Marlène Dressing & High-Tech"
                  className="w-full text-xs font-semibold px-3.5 py-3 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                />
              </div>

              {/* SLOGAN & DESCRIPTION */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase text-gray-600">Slogan commercial</label>
                <input
                  type="text"
                  value={businessSlogan}
                  onChange={(e) => setBusinessSlogan(e.target.value)}
                  placeholder="Ex: Vêtements chics importés & Accessoires d'origine"
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                />
              </div>

              {/* ADRESSE PHYSIQUE & HORAIRES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-gray-600">Adresse du point de retrait</label>
                  <input
                    type="text"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    placeholder="Ex: Galerie Louis N°14"
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-gray-600">WhatsApp direct boutique</label>
                  <input
                    type="tel"
                    value={shopWhatsapp}
                    onChange={(e) => setShopWhatsapp(e.target.value)}
                    placeholder="+241 07 45 88 12"
                    className="w-full text-xs font-mono font-bold px-3.5 py-2.5 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                  />
                </div>
              </div>

              {/* RÉTROGRADATION OPTIONNELLE */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100">
                <span className="text-gray-500">Abonnement Pro mensuel actif</span>
                <button
                  type="button"
                  onClick={() => {
                    downgradeToStandard();
                    setToastMessage('Rétrogradé en Vendeur Standard (500 FCFA/acte)');
                  }}
                  className="text-gray-400 hover:text-red-500 text-[11px] font-medium hover:underline cursor-pointer"
                >
                  Basculer vers Standard (500 FCFA/acte)
                </button>
              </div>

            </div>
          )}

          {/* CARTE 3 : PARAMÈTRES DE PAIEMENT & SÉQUESTRE */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E5E5] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-3">
              <ShieldCheck className="w-4 h-4 text-[#008A45]" />
              <h2 className="text-xs font-black italic uppercase tracking-wider text-[#111111]">
                3. Compte de Retrait Mobile Money (Séquestre)
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayoutMethod('AIRTEL_MONEY')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2 ${
                  payoutMethod === 'AIRTEL_MONEY'
                    ? 'border-[#008A45] bg-emerald-50/50 text-[#008A45]'
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                <div className="w-3 h-3 rounded-full border-2 border-current flex items-center justify-center">
                  {payoutMethod === 'AIRTEL_MONEY' && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                </div>
                <span className="text-xs font-bold">🇬🇦 Airtel Money</span>
              </button>

              <button
                type="button"
                onClick={() => setPayoutMethod('MOOV_MONEY')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2 ${
                  payoutMethod === 'MOOV_MONEY'
                    ? 'border-[#008A45] bg-emerald-50/50 text-[#008A45]'
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                <div className="w-3 h-3 rounded-full border-2 border-current flex items-center justify-center">
                  {payoutMethod === 'MOOV_MONEY' && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                </div>
                <span className="text-xs font-bold">🇬🇦 Moov Money</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase text-gray-600">Numéro de transfert des fonds</label>
              <input
                type="tel"
                value={payoutPhone}
                onChange={(e) => setPayoutPhone(e.target.value)}
                placeholder="07 45 88 12"
                className="w-full text-xs font-mono font-bold px-3.5 py-3 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
              />
              <span className="text-[10px] text-gray-400">Les fonds de vos ventes y seront transférés instantanément après livraison.</span>
            </div>
          </div>

          {/* BOUTON ENREGISTRER */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-2 text-center"
            >
              <Check className="w-4 h-4" />
              <span>Enregistrer les modifications</span>
            </button>
          </div>

          {/* DÉCONNEXION */}
          <div className="pt-2">
            <button
              type="button"
              onClick={logout}
              className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold uppercase rounded-2xl transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
