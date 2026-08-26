import { PartnerAd } from '@/types';

export const DEFAULT_PARTNER_ADS: PartnerAd[] = [
  {
    id: 'ad_airtel_money',
    partnerName: 'Airtel Money Gabon',
    contactPerson: 'Direction Partenariats',
    contactEmail: 'contact@airtel.ga',
    contactPhone: '+241 07 00 00 01',
    city: 'Libreville',
    country: 'Gabon',
    title: 'Airtel Money • 0 Frais Séquestre',
    tagline: 'Payez et retirez vos gains ZARÉN instantanément sans aucun frais.',
    mediaUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80',
    mediaType: 'image',
    targetUrl: 'https://www.airtel.ga',
    ctaText: 'Activer Airtel Money ↗',
    pack: 'VIP_HERO_90D',
    priceFcfa: 180000,
    paymentMethod: 'AIRTEL_MONEY',
    paymentStatus: 'PAID',
    adStatus: 'ACTIVE',
    invoiceNumber: 'FAC-ZRN-2026-001',
    impressionsCount: 14200,
    clicksCount: 890,
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'ad_bgfibank',
    partnerName: 'BGFIBank CEMAC',
    contactPerson: 'Pôle Digital Banking',
    contactEmail: 'digital@bgfibank.com',
    contactPhone: '+241 01 76 23 00',
    city: 'Libreville',
    country: 'Gabon',
    title: 'BGFIBank Mobile • Carte Visa ZARÉN',
    tagline: 'Recevez vos virements marchands sous séquestre directement sur votre compte.',
    mediaUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    mediaType: 'image',
    targetUrl: 'https://www.bgfibank.com',
    ctaText: 'Ouvrir un compte Pro ↗',
    pack: 'VIP_HERO_90D',
    priceFcfa: 180000,
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'PAID',
    adStatus: 'ACTIVE',
    invoiceNumber: 'FAC-ZRN-2026-002',
    impressionsCount: 9800,
    clicksCount: 640,
    createdAt: '2026-02-01T08:30:00.000Z'
  },
  {
    id: 'ad_canal_plus',
    partnerName: 'Canal+ Gabon',
    contactPerson: 'Service Commercial',
    contactEmail: 'reabos@canalplus-gabon.com',
    contactPhone: '+241 07 45 00 00',
    city: 'Libreville',
    country: 'Gabon',
    title: 'Canal+ Afrique • Réabonnement Sécurisé',
    tagline: 'Profitez de la formule TOUT CANAL avec votre compte ZARÉN.',
    mediaUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
    mediaType: 'image',
    targetUrl: 'https://www.canalplus-afrique.com',
    ctaText: 'Profiter de l’offre ↗',
    pack: 'VISIBILITY_30D',
    priceFcfa: 75000,
    paymentMethod: 'MOOV_MONEY',
    paymentStatus: 'PAID',
    adStatus: 'ACTIVE',
    invoiceNumber: 'FAC-ZRN-2026-003',
    impressionsCount: 6300,
    clicksCount: 420,
    createdAt: '2026-02-10T14:00:00.000Z'
  }
];

class PartnerAdService {
  private getStorageKey(): string {
    return 'zaren_partner_ads';
  }

  getAds(): PartnerAd[] {
    if (typeof window === 'undefined') return DEFAULT_PARTNER_ADS;
    const stored = localStorage.getItem(this.getStorageKey());
    if (!stored) {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(DEFAULT_PARTNER_ADS));
      return DEFAULT_PARTNER_ADS;
    }
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PARTNER_ADS;
    } catch {
      return DEFAULT_PARTNER_ADS;
    }
  }

  getActiveAds(): PartnerAd[] {
    const ads = this.getAds();
    const active = ads.filter(a => a.adStatus === 'ACTIVE');
    return active.length > 0 ? active : DEFAULT_PARTNER_ADS;
  }

  saveAd(adData: Omit<PartnerAd, 'id' | 'createdAt' | 'impressionsCount' | 'clicksCount' | 'invoiceNumber'>): PartnerAd {
    const ads = this.getAds();
    const invoiceNumber = `FAC-ZRN-${new Date().getFullYear()}-${String(ads.length + 1).padStart(3, '0')}`;
    const newAd: PartnerAd = {
      ...adData,
      id: `ad_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      invoiceNumber,
      impressionsCount: 0,
      clicksCount: 0,
      createdAt: new Date().toISOString()
    };
    const updated = [newAd, ...ads];
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(updated));
    }
    return newAd;
  }

  updateAdStatus(id: string, status: 'ACTIVE' | 'PENDING_APPROVAL' | 'PAUSED'): void {
    const ads = this.getAds();
    const updated = ads.map(a => a.id === id ? { ...a, adStatus: status } : a);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(updated));
    }
  }

  deleteAd(id: string): void {
    const ads = this.getAds();
    const updated = ads.filter(a => a.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(updated));
    }
  }

  incrementClick(id: string): void {
    const ads = this.getAds();
    const updated = ads.map(a => a.id === id ? { ...a, clicksCount: a.clicksCount + 1 } : a);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(updated));
    }
  }

  incrementImpression(id: string): void {
    const ads = this.getAds();
    const updated = ads.map(a => a.id === id ? { ...a, impressionsCount: a.impressionsCount + 1 } : a);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(updated));
    }
  }
}

export const partnerAdService = new PartnerAdService();
