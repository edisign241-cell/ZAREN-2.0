export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  phonePrefix: string;
  currency: string;
  currencySymbol: string;
  cities: { name: string; districts: string[] }[];
  paymentGateways: {
    id: string;
    name: string;
    logoColor: string;
    accentBg: string;
    instructions: string;
  }[];
}

export const CENTRAL_AFRICA_COUNTRIES: CountryConfig[] = [
  {
    code: 'GA',
    name: 'Gabon',
    flag: '🇬🇦',
    phonePrefix: '+241',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    cities: [
      {
        name: 'Libreville',
        districts: ['Louis', 'Mont-Bouët', 'Batterie IV', 'Charbonnages', 'Nzeng-Ayong', 'Glass', 'Sablière', 'Akébé']
      },
      {
        name: 'Akanda',
        districts: ['Cap Estérias', 'Angondjé', 'Avorbam', 'Château']
      },
      {
        name: 'Port-Gentil',
        districts: ['Grand Village', 'Matanda', 'Chavannes', 'Cap Lopez']
      },
      {
        name: 'Owendo',
        districts: ['Alénakiri', 'SNI', 'Port', 'Octra']
      },
      {
        name: 'Franceville',
        districts: ['Potos', 'Mbounda', 'Mamami']
      },
      {
        name: 'Oyem',
        districts: ['Centre-ville', 'Ngouéma', 'Adjougou']
      }
    ],
    paymentGateways: [
      {
        id: 'AIRTEL_MONEY_GA',
        name: 'Airtel Money Gabon',
        logoColor: '#e11d48',
        accentBg: 'bg-rose-50 border-rose-200 text-rose-800',
        instructions: 'Paiement direct sécurisé avec confirmation USSD *150#'
      },
      {
        id: 'MOOV_MONEY_GA',
        name: 'Moov Money Gabon',
        logoColor: '#0284c7',
        accentBg: 'bg-sky-50 border-sky-200 text-sky-800',
        instructions: 'Paiement direct sécurisé avec confirmation USSD *555#'
      }
    ]
  },
  {
    code: 'CM',
    name: 'Cameroun',
    flag: '🇨🇲',
    phonePrefix: '+237',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    cities: [
      {
        name: 'Douala',
        districts: ['Akwa', 'Bonanjo', 'Bonapriso', 'Makepe', 'Deido', 'Bonamoussadi']
      },
      {
        name: 'Yaoundé',
        districts: ['Bastos', 'Omnisports', 'Mimboman', 'Essos', 'Biyem-Assi', 'Mendong']
      },
      {
        name: 'Bafoussam',
        districts: ['Djeleng', 'Banengo', 'Tamda']
      },
      {
        name: 'Kribi',
        districts: ['Grand Batanga', 'Dombé', 'Centre']
      }
    ],
    paymentGateways: [
      {
        id: 'MTN_MOMO_CM',
        name: 'MTN Mobile Money',
        logoColor: '#eab308',
        accentBg: 'bg-amber-50 border-amber-200 text-amber-900',
        instructions: 'Validation immédiate sur votre mobile *126#'
      },
      {
        id: 'ORANGE_MONEY_CM',
        name: 'Orange Money Cameroun',
        logoColor: '#f97316',
        accentBg: 'bg-orange-50 border-orange-200 text-orange-900',
        instructions: 'Validation immédiate sur votre mobile #150#'
      }
    ]
  },
  {
    code: 'CG',
    name: 'Congo-Brazzaville',
    flag: '🇨🇬',
    phonePrefix: '+242',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    cities: [
      {
        name: 'Brazzaville',
        districts: ['Poto-Poto', 'Bacongo', 'Centre-ville', 'Moungali', 'Ouenze', 'Talangaï']
      },
      {
        name: 'Pointe-Noire',
        districts: ['Lumumba', 'Mvou-Mvou', 'Tié-Tié', 'Mongo-Mpoukou']
      }
    ],
    paymentGateways: [
      {
        id: 'AIRTEL_MONEY_CG',
        name: 'Airtel Money Congo',
        logoColor: '#e11d48',
        accentBg: 'bg-rose-50 border-rose-200 text-rose-800',
        instructions: 'Paiement direct sécurisé *128#'
      },
      {
        id: 'MTN_MOMO_CG',
        name: 'MTN MoMo Congo',
        logoColor: '#eab308',
        accentBg: 'bg-amber-50 border-amber-200 text-amber-900',
        instructions: 'Paiement direct sécurisé *105#'
      }
    ]
  },
  {
    code: 'TD',
    name: 'Tchad',
    flag: '🇹🇩',
    phonePrefix: '+235',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    cities: [
      {
        name: "N'Djamena",
        districts: ['Kabalaye', 'Moursal', 'Chagoua', 'Farcha', 'Bololo']
      },
      {
        name: 'Moundou',
        districts: ['Djarabé', 'Dombao', 'Kou-Djafalo']
      }
    ],
    paymentGateways: [
      {
        id: 'AIRTEL_MONEY_TD',
        name: 'Airtel Money Tchad',
        logoColor: '#e11d48',
        accentBg: 'bg-rose-50 border-rose-200 text-rose-800',
        instructions: 'Paiement direct sécurisé'
      },
      {
        id: 'MOOV_MONEY_TD',
        name: 'Moov Africa Tchad',
        logoColor: '#0284c7',
        accentBg: 'bg-sky-50 border-sky-200 text-sky-800',
        instructions: 'Paiement direct sécurisé'
      }
    ]
  },
  {
    code: 'CD',
    name: 'RD Congo',
    flag: '🇨🇩',
    phonePrefix: '+243',
    currency: 'USD',
    currencySymbol: '$',
    cities: [
      {
        name: 'Kinshasa',
        districts: ['Gombe', 'Limete', 'Kalamu', 'Ngaliema', 'Bandalungwa', 'Kintambo']
      },
      {
        name: 'Lubumbashi',
        districts: ['Golf', 'Kenya', 'Katuba', 'Kampemba']
      },
      {
        name: 'Goma',
        districts: ['Les Volcans', 'Himbi', 'Katindo']
      }
    ],
    paymentGateways: [
      {
        id: 'MPESA_CD',
        name: 'Vodacom M-Pesa',
        logoColor: '#e11d48',
        accentBg: 'bg-rose-50 border-rose-200 text-rose-800',
        instructions: 'Paiement mobile instantané'
      },
      {
        id: 'AIRTEL_MONEY_CD',
        name: 'Airtel Money RDC',
        logoColor: '#e11d48',
        accentBg: 'bg-red-50 border-red-200 text-red-800',
        instructions: 'Paiement direct sécurisé'
      },
      {
        id: 'ORANGE_MONEY_CD',
        name: 'Orange Money RDC',
        logoColor: '#f97316',
        accentBg: 'bg-orange-50 border-orange-200 text-orange-900',
        instructions: 'Paiement direct sécurisé'
      }
    ]
  },
  {
    code: 'CF',
    name: 'Centrafrique',
    flag: '🇨🇫',
    phonePrefix: '+236',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    cities: [
      {
        name: 'Bangui',
        districts: ['Centre-ville', 'Sica', 'Fouh', 'Gobongo', 'Km5']
      }
    ],
    paymentGateways: [
      {
        id: 'ORANGE_MONEY_CF',
        name: 'Orange Money RCA',
        logoColor: '#f97316',
        accentBg: 'bg-orange-50 border-orange-200 text-orange-900',
        instructions: 'Paiement direct sécurisé'
      }
    ]
  }
];

export const DEFAULT_COUNTRY = CENTRAL_AFRICA_COUNTRIES[0]; // Gabon
