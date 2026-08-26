'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Megaphone,
  CheckCircle2,
  Upload,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Phone,
  Building2,
  Sparkles,
  Printer,
  Download,
  ArrowRight,
  MapPin,
  Eye,
  MousePointerClick,
  Check,
  Star,
  FileText
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { partnerAdService } from '@/lib/partners';
import { CENTRAL_AFRICA_COUNTRIES } from '@/lib/geo/countries';

export default function PartnerAdvertisePage() {
  const router = useRouter();

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

  const packsConfig = {
    DISCOVERY_7D: {
      name: 'Pack Découverte (7 Jours)',
      duration: '7 jours de diffusion',
      price: 25000,
      badge: '🥉 Standard',
      features: ['Diffusion sur le smartphone Hero ZARÉN', 'Redirection vers votre site ou WhatsApp', 'Statistiques de clics de base']
    },
    VISIBILITY_30D: {
      name: 'Pack Visibilité (30 Jours)',
      duration: '30 jours de diffusion continue',
      price: 75000,
      badge: '🥈 Recommandé • Plus populaire',
      features: ['Priorité d’affichage élevée sur l’écran d’accueil', 'Redirection vers site web ou réseaux sociaux', 'Rapport de performance hebdomadaire', 'Support commercial prioritaire']
    },
    VIP_HERO_90D: {
      name: 'Pack VIP Hero (3 Mois)',
      duration: '90 jours de visibilité maximale',
      price: 180000,
      badge: '🥇 VIP Partenaire Officiel',
      features: ['Position N°1 permanente sur le smartphone Hero', 'Badge « Partenaire Officiel ZARÉN »', 'Lien dofollow + campagne ciblée CEMAC', 'Gestionnaire de compte dédié']
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
        targetUrl,
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
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10 px-4 font-sans pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Retour */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1.5"
          >
            ← Retour à l'accueil ZARÉN
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#008A45] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Régie Publicitaire ZARÉN</span>
            </span>
          </div>
        </div>

        {/* SI LA FACTURE EST GÉNÉRÉE (CONFIRMATION & TÉLÉCHARGEMENT) */}
        {createdInvoice ? (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-6 animate-scale-in">
            <div className="text-center space-y-2 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#008A45] flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h1 className="text-2xl font-black text-gray-900">
                Campagne Activée & Facture Proforma Générée !
              </h1>
              <p className="text-xs text-gray-600 max-w-lg mx-auto">
                Votre publicité est désormais programmée et apparaîtra en direct sur le smartphone de la Hero section ZARÉN.
              </p>
            </div>

            {/* Fiche Facture Officielle */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-5 font-mono text-xs text-gray-800">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="ZARÉN" className="h-6 w-auto object-contain bg-[#111827] p-1 rounded-md" />
                    <span className="font-black italic text-base tracking-tight text-gray-900">ZARÉN RÉGIE PUB</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-1">Plateforme Séquestre Central Africa</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900 block">{createdInvoice.invoiceNumber}</span>
                  <span className="text-[10px] text-gray-500">Émise le : {new Date(createdInvoice.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div>
                  <span className="text-gray-400 block uppercase text-[9px]">Partenaire Facturé :</span>
                  <strong className="text-gray-900 block text-xs">{createdInvoice.partnerName}</strong>
                  <span>{createdInvoice.contactPerson} • {createdInvoice.contactEmail}</span>
                  <span className="block">{createdInvoice.contactPhone} — {createdInvoice.city}, {createdInvoice.country}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block uppercase text-[9px]">Statut Règlement :</span>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                    ✓ RÉGLÉ VIA {createdInvoice.paymentMethod}
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-1">Séquestre Publicitaire Validé</span>
                </div>
              </div>

              {/* Ligne de Facturation */}
              <div className="border-t border-gray-200 pt-3">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] text-gray-400 border-b border-gray-200">
                      <th className="pb-2">Description de la prestation</th>
                      <th className="pb-2 text-center">Durée</th>
                      <th className="pb-2 text-right">Montant Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2.5">
                        <strong className="text-gray-900 block">{createdInvoice.packDetails?.name}</strong>
                        <span className="text-[10px] text-gray-500">Titre : « {createdInvoice.title} »</span>
                        <span className="text-[10px] text-[#008A45] block font-mono">Redirection : {createdInvoice.targetUrl}</span>
                      </td>
                      <td className="py-2.5 text-center text-gray-600">{createdInvoice.packDetails?.duration}</td>
                      <td className="py-2.5 text-right font-bold text-gray-900">{formatPrice(createdInvoice.priceFcfa)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="font-bold text-gray-700">Total Net Réglé TTC :</span>
                <span className="text-lg font-black text-[#008A45]">{formatPrice(createdInvoice.priceFcfa)}</span>
              </div>
            </div>

            {/* Actions Facture */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer la Facture Proforma</span>
              </button>

              <Link
                href="/"
                className="flex-1 py-3 px-4 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer text-center"
              >
                <span>Voir ma pub en direct sur la page d'accueil</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* FORMULAIRE PRINCIPAL DE RÉSERVATION ET FACTURATION PUBLICITAIRE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Colonne Gauche : Formulaire Étape par Étape */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* En-tête */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#008A45]">
                  <Megaphone className="w-4 h-4" />
                  <span>Espace Annonceurs & Partenariats</span>
                </div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  Diffusez votre marque auprès de milliers d'acheteurs actifs.
                </h1>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Positionnez votre entreprise, produit ou service directement sur le smartphone de la Hero section ZARÉN avec redirection automatique vers votre site web ou contact WhatsApp.
                </p>
              </div>

              <form onSubmit={handleSubmitCampaign} className="space-y-6">
                
                {/* 1. INFORMATIONS ENTREPRISE */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                  <h2 className="text-xs font-black italic uppercase tracking-wider text-gray-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#008A45]" />
                    <span>1. Informations Entreprise & Contact</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Nom de l'entreprise / Marque *</label>
                      <input
                        type="text"
                        required
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="Ex: BGFIBank, Airtel, Canal+, Mode Libreville..."
                        className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] focus:bg-white text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Nom du contact responsable</label>
                      <input
                        type="text"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder="Ex: M. Jean Ondo"
                        className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] focus:bg-white text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Email professionnel *</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="contact@entreprise.com"
                        className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] focus:bg-white text-xs font-medium"
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
                        className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] focus:bg-white text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Pays CEMAC</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] text-xs font-medium"
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
                        className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CONTENU PUBLICITAIRE & MÉDIAS */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                  <h2 className="text-xs font-black italic uppercase tracking-wider text-gray-900 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#008A45]" />
                    <span>2. Contenu & Médias de la Campagne</span>
                  </h2>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Titre de l'annonce publicitaire *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Promotion Spéciale • 50% de réduction sur notre catalogue"
                        className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Slogan / Description courte</label>
                      <textarea
                        rows={2}
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="Ex: Commandez dès aujourd'hui et bénéficiez de la livraison express partout à Libreville."
                        className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] text-xs font-medium resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Lien de redirection externe *</label>
                        <input
                          type="url"
                          required
                          value={targetUrl}
                          onChange={(e) => setTargetUrl(e.target.value)}
                          placeholder="https://votresite.com ou https://wa.me/24107000000"
                          className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Texte du bouton d'action</label>
                        <input
                          type="text"
                          value={ctaText}
                          onChange={(e) => setCtaText(e.target.value)}
                          placeholder="Visiter le site partenaire ↗"
                          className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] text-xs font-medium"
                        />
                      </div>
                    </div>

                    {/* Upload de média */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Média publicitaire (Photo HD / Bannière)</label>
                      <div className="flex items-center gap-3">
                        <label className="py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold border border-gray-300 flex items-center gap-2 cursor-pointer transition">
                          <Upload className="w-4 h-4 text-[#008A45]" />
                          <span>Télécharger une image HD</span>
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                        <span className="text-[10px] text-gray-400">Format recommandé : 800x800 ou 1080x1080 (Carré)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. CHOIX DU PACK DE DIFFUSION */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                  <h2 className="text-xs font-black italic uppercase tracking-wider text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#008A45]" />
                    <span>3. Choix du Pack Publicitaire ZARÉN</span>
                  </h2>

                  <div className="space-y-3">
                    {(Object.keys(packsConfig) as Array<keyof typeof packsConfig>).map((key) => {
                      const p = packsConfig[key];
                      const isSelected = selectedPack === key;
                      return (
                        <div
                          key={key}
                          onClick={() => setSelectedPack(key)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#008A45] bg-emerald-50/50 shadow-xs'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-xs text-gray-900">{p.name}</span>
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  {p.badge}
                                </span>
                              </div>
                              <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                                {p.duration}
                              </span>
                            </div>
                            <span className="text-base font-black text-gray-900">
                              {formatPrice(p.price)}
                            </span>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-gray-200/60 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-gray-600">
                            {p.features.map((feat, idx) => (
                              <span key={idx} className="flex items-center gap-1">
                                <Check className="w-3 h-3 text-[#008A45] shrink-0" />
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. RÈGLEMENT MOBILE MONEY & FACTURATION */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                  <h2 className="text-xs font-black italic uppercase tracking-wider text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#008A45]" />
                    <span>4. Mode de Paiement & Facturation</span>
                  </h2>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('AIRTEL_MONEY')}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                        paymentMethod === 'AIRTEL_MONEY'
                          ? 'border-red-500 bg-red-50 font-bold text-red-700 shadow-xs'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700 text-xs'
                      }`}
                    >
                      <span className="block text-xs font-black">Airtel Money</span>
                      <span className="text-[9px] text-gray-500">Gabon / Congo / RDC</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('MOOV_MONEY')}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
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
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
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
                      Numéro Mobile Money de facturation
                    </label>
                    <input
                      type="tel"
                      value={paymentPhone}
                      onChange={(e) => setPaymentPhone(e.target.value)}
                      placeholder="+241 07 45 88 12"
                      className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#008A45] text-xs font-medium"
                    />
                  </div>

                  {/* Bouton de validation */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-98 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Traitement de la commande...</span>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Valider la campagne ({formatPrice(packsConfig[selectedPack].price)}) & Obtenir la Facture</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            </div>

            {/* Colonne Droite : APERÇU EN DIRECT DU SMARTPHONE HERO */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black uppercase text-gray-500 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#008A45]" />
                  <span>Aperçu en Direct sur la Hero Section</span>
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                  Format Smartphone
                </span>
              </div>

              {/* Smartphone Mockup */}
              <div className="w-full max-w-[340px] mx-auto bg-white rounded-[2.5rem] p-4 shadow-2xl border-2 border-emerald-500/30 relative">
                {/* Notch */}
                <div className="w-28 h-3.5 bg-[#111827]/10 rounded-full mx-auto mb-3" />
                
                {/* Mockup Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-md bg-[#111827] border border-gray-800 flex items-center justify-center p-0.5 shadow-xs">
                      <img src="/logo.png" alt="Z" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-black italic text-xs tracking-tight text-[#111111]">ZARÉN</span>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide">
                    <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                    <span>Sponsorisé</span>
                  </div>
                </div>

                {/* Ad Preview Card */}
                <div className="mt-3 bg-[#F8F8F8] rounded-2xl p-3 border border-[#E5E5E5] shadow-xs space-y-2">
                  <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden relative shadow-inner">
                    <img 
                      src={mediaUrl} 
                      alt="Publicité" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-2 left-2 bg-[#111827]/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 border border-white/10">
                      <Megaphone className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{partnerName || 'Nom Partenaire'}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black italic text-xs text-[#111111] leading-tight">
                      {title || 'Titre de votre publicité partenaire'}
                    </h3>
                    <p className="text-[10px] text-gray-600 line-clamp-2 mt-1 leading-snug font-medium">
                      {tagline || 'Votre slogan accrocheur ou description de l’offre apparaîtra ici.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 bg-[#008A45] text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{ctaText || 'Visiter le site partenaire'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Trust pill */}
                <div className="mt-3 p-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#008A45] shrink-0" />
                  <p className="text-[9px] text-emerald-950 leading-tight font-medium">
                    Redirection sécurisée vérifiée par ZARÉN.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
