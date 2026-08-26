export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  phonePrefix: string;
  currency: string;
  mobileMoneyOperators: {
    id: string;
    name: string;
    color: string;
  }[];
  cities: string[];
  defaultCity: string;
  defaultDistrict: string;
}

export const CENTRAL_AFRICA_COUNTRIES: CountryConfig[] = [
  {
    code: 'GA',
    name: 'Gabon',
    flag: '🇬🇦',
    phonePrefix: '+241',
    currency: 'FCFA',
    mobileMoneyOperators: [
      { id: 'AIRTEL_MONEY', name: 'Airtel Money', color: 'red' },
      { id: 'MOOV_MONEY', name: 'Moov Money', color: 'blue' },
    ],
    cities: [
      'Libreville',
      'Akanda',
      'Owendo',
      'Port-Gentil',
      'Franceville',
      'Oyem',
      'Moanda',
      'Lambaréné',
      'Mouila',
      'Tchibanga',
      'Koulamoutou',
      'Bitam',
      'Gamba',
    ],
    defaultCity: 'Libreville',
    defaultDistrict: 'Quartier Louis',
  },
  {
    code: 'CM',
    name: 'Cameroun',
    flag: '🇨🇲',
    phonePrefix: '+237',
    currency: 'FCFA',
    mobileMoneyOperators: [
      { id: 'MTN_MONEY', name: 'MTN Mobile Money', color: 'amber' },
      { id: 'ORANGE_MONEY', name: 'Orange Money', color: 'orange' },
    ],
    cities: [
      'Douala',
      'Yaoundé',
      'Bafoussam',
      'Garoua',
      'Bamenda',
      'Maroua',
      'Ngaoundéré',
      'Kribi',
      'Limbe',
      'Bertoua',
      'Ebolowa',
    ],
    defaultCity: 'Douala',
    defaultDistrict: 'Akwa',
  },
  {
    code: 'CG',
    name: 'Congo',
    flag: '🇨🇬',
    phonePrefix: '+242',
    currency: 'FCFA',
    mobileMoneyOperators: [
      { id: 'MTN_MONEY', name: 'MTN Mobile Money', color: 'amber' },
      { id: 'AIRTEL_MONEY', name: 'Airtel Money', color: 'red' },
    ],
    cities: [
      'Brazzaville',
      'Pointe-Noire',
      'Dolisie',
      'Nkayi',
      'Oyo',
      'Ouesso',
      'Impfondo',
    ],
    defaultCity: 'Brazzaville',
    defaultDistrict: 'Centre-Ville',
  },
  {
    code: 'CD',
    name: 'RD Congo',
    flag: '🇨🇩',
    phonePrefix: '+243',
    currency: 'FCFA',
    mobileMoneyOperators: [
      { id: 'M_PESA', name: 'M-Pesa', color: 'red' },
      { id: 'AIRTEL_MONEY', name: 'Airtel Money', color: 'red' },
      { id: 'ORANGE_MONEY', name: 'Orange Money', color: 'orange' },
    ],
    cities: [
      'Kinshasa',
      'Lubumbashi',
      'Goma',
      'Bukavu',
      'Kisangani',
      'Matadi',
      'Kolwezi',
      'Kananga',
      'Mbuji-Mayi',
    ],
    defaultCity: 'Kinshasa',
    defaultDistrict: 'Gombe',
  },
  {
    code: 'TD',
    name: 'Tchad',
    flag: '🇹🇩',
    phonePrefix: '+235',
    currency: 'FCFA',
    mobileMoneyOperators: [
      { id: 'AIRTEL_MONEY', name: 'Airtel Money', color: 'red' },
      { id: 'MOOV_MONEY', name: 'Moov Money', color: 'blue' },
    ],
    cities: [
      "N'Djamena",
      'Moundou',
      'Sarh',
      'Abéché',
      'Kélo',
      'Koumra',
      'Pala',
    ],
    defaultCity: "N'Djamena",
    defaultDistrict: 'Centre',
  },
  {
    code: 'GQ',
    name: 'Guinée Équatoriale',
    flag: '🇬🇶',
    phonePrefix: '+240',
    currency: 'FCFA',
    mobileMoneyOperators: [
      { id: 'BGFI_MOBILE', name: 'BGFIMobile', color: 'emerald' },
    ],
    cities: ['Malabo', 'Bata', 'Oyala', 'Ebebiyín', 'Mongomo', 'Luba'],
    defaultCity: 'Malabo',
    defaultDistrict: 'Centre',
  },
  {
    code: 'CF',
    name: 'Centrafrique',
    flag: '🇨🇫',
    phonePrefix: '+236',
    currency: 'FCFA',
    mobileMoneyOperators: [
      { id: 'ORANGE_MONEY', name: 'Orange Money', color: 'orange' },
      { id: 'TELECEL_MONEY', name: 'Telecel Money', color: 'blue' },
    ],
    cities: ['Bangui', 'Bimbo', 'Berbérati', 'Carnot', 'Bouar', 'Bambari'],
    defaultCity: 'Bangui',
    defaultDistrict: 'Centre',
  },
];

export function getCountryByCode(code?: string): CountryConfig {
  return (
    CENTRAL_AFRICA_COUNTRIES.find(
      (c) => c.code.toUpperCase() === (code || '').toUpperCase()
    ) || CENTRAL_AFRICA_COUNTRIES[0]
  );
}
