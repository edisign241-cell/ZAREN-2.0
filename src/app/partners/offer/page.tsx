'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  CheckCircle2,
  Upload,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Building2,
  Sparkles,
  Printer,
  ArrowRight,
  Check,
  Share2,
  Copy,
  Phone,
  Mail,
  Eye,
  FileText
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { partnerAdService } from '@/lib/partners';
import { CENTRAL_AFRICA_COUNTRIES } from '@/lib/geo/countries';

export default function PartnerShareableOfferPage() {
  // Form State
  const [partnerName, setPartnerName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [country, setCountry] = useState('Gabon');
  const [city, setCity] = useState('Libreville');

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80');
  const [targetUrl, setTargetUrl] = useState('https://');
  const [ctaText, setCtaText] = useState('Visiter le site partenaire ↗');

  const [selectedPack, setSelectedPack] = useState<'DISCOVERY_7D' | 'VISIBILITY_30D' | 'VIP_HERO_90D'>('VISIBILITY_30D');
  const [paymentMethod, setPaymentMethod] = useState<'AIRTEL_MONEY' | 'MOOV_MONEY' | 'BANK_TRANSFER'>('AIRTEL_MONEY');
  const [paymentPhone, setPaymentPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const packsConfig = {
    DISCOVERY_7D: {
      name: 'Pack Découverte (7 Jours)',
      duration: '7 jours de diffusion',
      price: 25000,
      badge: '🥉 Essai Commercial',
      features: [
        'Emplacement sur le smartphone Hero ZARÉN',
        'Redirection directe vers votre site ou WhatsApp',
        'Compteur d’impressions et de clics en temps réel',
        'Facture Proforma officielle ZARÉN'
      ]
    },
    VISIBILITY_30D: {
      name: 'Pack Visibilité Continue (30 Jours)',
      duration: '30 jours de diffusion continue',
      price: 75000,
      badge: '🥈 Recommandé • Meilleur ROI',
      features: [
        'Priorité d’affichage élevée sur l’écran d’accueil',
        'Carrousel sponsorisé avec média HD ou vidéo',
        'Bouton d’action personnalisé avec lien direct',
        'Rapport de performance hebdomadaire',
        'Support commercial & technique dédié'
      ]
    },
    VIP_HERO_90D: {
      name: 'Pack VIP Hero Partenaire (3 Mois)',
      duration: '90 jours de visibilité maximale',
      price: 180000,
      badge: '🥇 VIP Partenaire Officiel',
      features: [
        'Position N°1 permanente sur le smartphone Hero',
        'Badge certifié « Partenaire Officiel ZARÉN »',
        'Campagne ciblée multi-pays (Gabon, Cameroun, Congo)',
        'Assistance et mise à jour des visuels illimitée'
      ]
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyOfferLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSubmitCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !contactEmail || !contactPhone || !title || !targetUrl) {
      alert('Veuillez remplir tous les champs obligatoires du formulaire.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newAd = partnerAdService.saveAd({
        partnerName,
        contactPerson: contactPerson || partnerName,
        contactEmail,
        contactPhone,
        city,
        country,
        title,
        tagline: tagline || title,
        mediaUrl,
        mediaType: 'image',
        targetUrl: targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`,
        ctaText,
        pack: selectedPack,
        priceFcfa: packsConfig[selectedPack].price,
        paymentMethod,
        paymentStatus: 'PAID',
        adStatus: 'ACTIVE'
      });

      setCreatedInvoice({
        ...newAd,
        packDetails: packsConfig[selectedPack]
      });

      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 font-sans pb-24 text-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER AVEC LOGO OFFICIEL ZARÉN */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#111827] text-white rounded-3xl shadow-xl border border-gray-800">
          <div className="flex items-center gap-3.5">
            <div className="h-12 px-3 py-1.5 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-md">
              <img src="/logo.png" alt="ZARÉN" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black italic text-xl tracking-tight">ZARÉN</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#008A45] px-2.5 py-0.5 rounded-full text-white">
                  OFFRE PARTENARIAT & SPONSORING
                </span>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                Plateforme de visibilité & séquestre en Afrique Centrale
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyOfferLink}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/20 transition cursor-pointer active:scale-95"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Lien d'offre copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-300" />
                  <span>Copier le lien d'offre</span>
                </>
              )}
            </button>

            <Link
              href="/"
              target="_blank"
              className="py-2.5 px-4 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <span>Marketplace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* CONFIRMATION & FACTURE PROFORMA OFFICIELLE */}
        {createdInvoice ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl space-y-6 animate-scale-in">
            <div className="text-center space-y-2 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#008A45] flex items-center justify-center mx-auto mb-2 shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h1 className="text-2xl font-black text-gray-900">
                Campagne Validée & Facture Proforma Générée
              </h1>
              <p className="text-xs text-gray-600 max-w-lg mx-auto">
                Votre publicité est programmée avec succès et est activée en direct sur l'écran d'accueil ZARÉN.
              </p>
            </div>

            {/* Fiche Facture avec Logo ZARÉN */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-5 font-mono text-xs text-gray-800">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 px-2.5 py-1 rounded-xl bg-[#111827] flex items-center justify-center">
                    <img src="/logo.png" alt="ZARÉN" className="h-7 w-auto object-contain" />
                  </div>
                  <div>
                    <span className="font-black italic text-base tracking-tight text-gray-900 block">ZARÉN TECHNOLOGIES</span>
                    <span className="text-[10px] text-gray-500 font-sans">Régie Publicitaire & Séquestre Central Africa</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-gray-900 block">{createdInvoice.invoiceNumber}</span>
                  <span className="text-[10px] text-gray-500">Date : {new Date(createdInvoice.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-sans">
                <div>
                  <span className="text-gray-400 block uppercase text-[9px] font-bold">Entreprise Partenaire :</span>
                  <strong className="text-gray-900 text-sm block">{createdInvoice.partnerName}</strong>
                  <span className="text-gray-600">{createdInvoice.contactPerson} • {createdInvoice.contactEmail}</span>
                  <span className="text-gray-600 block">{createdInvoice.contactPhone} — {createdInvoice.city}, {createdInvoice.country}</span>
                </div>

                <div className="sm:text-right">
                  <span className="text-gray-400 block uppercase text-[9px] font-bold">Règlement & Validation :</span>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                    ✓ VALIDÉ & RÉGLÉ VIA {createdInvoice.paymentMethod}
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-1">Séquestre Publicitaire Garanti</span>
                </div>
              </div>

              {/* Ligne Prestation */}
              <div className="border-t border-gray-200 pt-3">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="text-[10px] text-gray-400 border-b border-gray-200 uppercase font-bold">
                      <th className="pb-2">Désignation de la Prestation</th>
                      <th className="pb-2 text-center">Période</th>
                      <th className="pb-2 text-right">Montant Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3">
                        <strong className="text-gray-900 block text-xs">{createdInvoice.packDetails?.name}</strong>
                        <span className="text-[11px] text-gray-600 block mt-0.5">Titre : « {createdInvoice.title} »</span>
                        <a
                          href={createdInvoice.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-[#008A45] font-mono hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          <span>Redirection : {createdInvoice.targetUrl}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>
                      <td className="py-3 text-center text-gray-700 font-medium">{createdInvoice.packDetails?.duration}</td>
                      <td className="py-3 text-right font-black text-sm text-gray-900 font-mono">{formatPrice(createdInvoice.priceFcfa)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="font-bold text-gray-700 font-sans">Total Net à Payer TTC :</span>
                <span className="text-xl font-black text-[#008A45] font-mono">{formatPrice(createdInvoice.priceFcfa)}</span>
              </div>
            </div>

            {/* Actions Facture */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3.5 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer la Facture Proforma</span>
              </button>

              <Link
                href="/"
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer text-center shadow-md"
              >
                <span>Voir ma publicité sur la page d'accueil ZARÉN</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* FORMULAIRE OFFICIEL DE SOUSCRIPTION PARTENAIRE */
          <div className="space-y-8">
            
            {/* 1. PRÉSENTATION DE LA PRESTATION & AVANTAGES */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#008A45]">
                <Megaphone className="w-4 h-4" />
                <span>Descriptif de la Prestation Publicitaire</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Offrez à votre entreprise une visibilité maximale auprès de milliers d'acheteurs actifs.
              </h1>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
                En tant que partenaire officiel de <strong>ZARÉN</strong>, votre publicité vidéo ou photo est diffusée en position <strong>N°1 sur le smartphone de la Hero section</strong> (première chose vue par chaque visiteur). Les utilisateurs sont redirigés en un clic directement vers votre plateforme web ou votre contact WhatsApp commercial.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs">
                  <strong className="text-emerald-950 block font-bold">🎯 Audience Qualifiée</strong>
                  <span className="text-emerald-800 text-[11px]">Acheteurs et vendeurs actifs dotés de comptes Mobile Money.</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 text-xs">
                  <strong className="text-blue-950 block font-bold">📲 Redirection Directe</strong>
                  <span className="text-blue-800 text-[11px]">Lien direct vers votre site internet, catalogue ou discussion WhatsApp.</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-xs">
                  <strong className="text-purple-950 block font-bold">🛡️ Facturation Officielle</strong>
                  <span className="text-purple-800 text-[11px]">Facture Proforma avec cachet ZARÉN générée immédiatement.</span>
                </div>
              </div>
            </div>

            {/* 2. CHOIX DU PACK DE DIFFUSION & TARIFS */}
            <div className="space-y-4">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#008A45]" />
                <span>Sélectionnez votre Pack de Diffusion</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.keys(packsConfig) as Array<keyof typeof packsConfig>).map((key) => {
                  const p = packsConfig[key];
                  const isSelected = selectedPack === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedPack(key)}
                      className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'border-[#008A45] bg-emerald-50/40 shadow-md ring-2 ring-[#008A45]/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                          {p.badge}
                        </span>
                        <h3 className="text-sm font-black text-gray-900">{p.name}</h3>
                        <div className="text-2xl font-black text-[#008A45] font-mono">
                          {formatPrice(p.price)}
                        </div>
                        <span className="text-xs text-gray-500 font-medium block">
                          {p.duration}
                        </span>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-gray-200/80 text-xs text-gray-600">
                        {p.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                            <Check className="w-3.5 h-3.5 text-[#008A45] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. FORMULAIRE COMPLET D'INFORMATIONS DU PARTENAIRE */}
            <form onSubmit={handleSubmitCampaign} className="space-y-6">
              
              {/* Coordonnées */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black uppercase text-gray-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#008A45]" />
                  <span>1. Coordonnées de l'Entreprise Partenaire</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Nom de l'entreprise / Marque *</label>
                    <input
                      type="text"
                      required
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Ex: BGFIBank, Airtel Money, Canal+..."
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] focus:bg-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Nom du contact responsable</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="Ex: Direction Marketing"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] focus:bg-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Email de facturation *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="contact@entreprise.com"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] focus:bg-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Téléphone / WhatsApp commercial *</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+241 07 00 00 00"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] focus:bg-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Pays CEMAC</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] text-xs font-medium"
                    >
                      {CENTRAL_AFRICA_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Ville</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Libreville, Douala, Brazzaville..."
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Contenu & Médias */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black uppercase text-gray-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#008A45]" />
                  <span>2. Visuel & Lien de Redirection</span>
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Titre de la publicité (court et percutant) *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Airtel Money • 0 Frais de Séquestre sur vos Achats"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Slogan ou Description courte de l'offre</label>
                    <textarea
                      rows={2}
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Ex: Profitez dès aujourd'hui de notre service sécurisé avec livraison express."
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] text-xs font-medium resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Lien de votre site web ou WhatsApp *</label>
                      <input
                        type="text"
                        required
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="https://entreprise.com ou https://wa.me/24107000000"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Texte du bouton CTA</label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        placeholder="Visiter le site partenaire ↗"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Télécharger votre visuel publicitaire (Photo HD / Bannière)</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <label className="py-3 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold border border-gray-300 flex items-center gap-2 cursor-pointer transition">
                        <Upload className="w-4 h-4 text-[#008A45]" />
                        <span>Sélectionner une photo HD</span>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                      <span className="text-[10px] text-gray-500">Format recommandé : 800x800 ou 1080x1080 pixels (Carré)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mode de Règlement & Validation */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black uppercase text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#008A45]" />
                  <span>3. Mode de Règlement Mobile Money & Génération Facture</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('AIRTEL_MONEY')}
                    className={`p-3.5 rounded-2xl border text-center transition cursor-pointer ${
                      paymentMethod === 'AIRTEL_MONEY'
                        ? 'border-red-500 bg-red-50 font-bold text-red-700 shadow-xs'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700 text-xs'
                    }`}
                  >
                    <span className="block text-xs font-black">Airtel Money</span>
                    <span className="text-[9px] text-gray-500">Gabon / Congo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('MOOV_MONEY')}
                    className={`p-3.5 rounded-2xl border text-center transition cursor-pointer ${
                      paymentMethod === 'MOOV_MONEY'
                        ? 'border-blue-500 bg-blue-50 font-bold text-blue-700 shadow-xs'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700 text-xs'
                    }`}
                  >
                    <span className="block text-xs font-black">Moov Money</span>
                    <span className="text-[9px] text-gray-500">Gabon / CEMAC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('BANK_TRANSFER')}
                    className={`p-3.5 rounded-2xl border text-center transition cursor-pointer ${
                      paymentMethod === 'BANK_TRANSFER'
                        ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-800 shadow-xs'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700 text-xs'
                    }`}
                  >
                    <span className="block text-xs font-black">Virement Bancaire</span>
                    <span className="text-[9px] text-gray-500">BGFIBank / UBA</span>
                  </button>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold text-xs mb-1">
                    Numéro Mobile Money du paiement
                  </label>
                  <input
                    type="tel"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    placeholder="+241 07 00 00 00"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] text-xs font-medium"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition active:scale-98 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Génération de votre facture proforma...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Valider la Campagne ({formatPrice(packsConfig[selectedPack].price)}) & Obtenir la Facture Proforma</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
