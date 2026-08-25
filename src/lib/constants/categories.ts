export interface CategoryItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  count: number;
  popularSearch: string;
  description: string;
}

export const FACEBOOK_CENTRAL_AFRICA_CATEGORIES: CategoryItem[] = [
  {
    id: 'TOUT',
    label: 'Toutes les annonces',
    shortLabel: 'Tout',
    icon: 'sparkles',
    count: 248,
    popularSearch: 'Populaires',
    description: 'Toutes les nouveautés vérifiées et sécurisées par séquestre'
  },
  {
    id: 'PHONES',
    label: 'Smartphones & High-Tech',
    shortLabel: 'Smartphones',
    icon: 'smartphone',
    count: 54,
    popularSearch: 'iPhone 13, 14, 15 Pro Max, Samsung S23, AirPods',
    description: 'iPhones scellés/reconditionnés A+, Samsung Galaxy, écouteurs & montres connectées'
  },
  {
    id: 'SNEAKERS',
    label: 'Sneakers & Chaussures',
    shortLabel: 'Sneakers',
    icon: 'footprints',
    count: 42,
    popularSearch: 'Air Jordan 4, Nike Dunk, Yeezy, Talons soirée',
    description: 'Baskets streetwear originales, mocassins luxe, sandales et escarpins'
  },
  {
    id: 'WOMEN_FASHION',
    label: 'Mode Femme & Robes',
    shortLabel: 'Femme & Robes',
    icon: 'shirt',
    count: 68,
    popularSearch: 'Robes de soirée, Ensembles Wax/Soie, Lingerie',
    description: 'Robes chic Libreville, ensembles tailleurs, tenues de fête et lingerie'
  },
  {
    id: 'MEN_FASHION',
    label: 'Mode Homme & Streetwear',
    shortLabel: 'Homme & Jeans',
    icon: 'user-check',
    count: 38,
    popularSearch: 'Jeans cargo, T-shirts oversize, Chemises lin, Costumes',
    description: 'Jeans denim stretch, ensembles streetwear, polos et chemises de sortie'
  },
  {
    id: 'BEAUTY',
    label: 'Perruques, Beauté & Parfums',
    shortLabel: 'Perruques & Beauté',
    icon: 'sparkle',
    count: 31,
    popularSearch: 'Lace Front HD, Mèches vietnamiennes, Parfums Dubaï',
    description: 'Perruques brésiliennes/péruviennes 100% naturelles, parfums orientaux et soins'
  },
  {
    id: 'TECH_GAMING',
    label: 'Informatique & PS5 Gaming',
    shortLabel: 'PC & Gaming',
    icon: 'gamepad-2',
    count: 19,
    popularSearch: 'PlayStation 5, MacBook M2, PC Gamer HP/Dell i7',
    description: 'Consoles de jeux, ordinateurs portables pro et accessoires gaming'
  },
  {
    id: 'HOME',
    label: 'Électroménager & Maison',
    shortLabel: 'Maison & Cuisine',
    icon: 'utensils',
    count: 26,
    popularSearch: 'Air Fryer sans huile, Mixeur blender, Draps luxe',
    description: 'Appareils de cuisine modernes, literie de qualité hôtelière et déco'
  },
  {
    id: 'KIDS',
    label: 'Bébés & Enfants',
    shortLabel: 'Bébés & Enfants',
    icon: 'baby',
    count: 14,
    popularSearch: 'Ensembles enfants, Poussettes, Vêtements rentrée',
    description: 'Mode enfant, jouets éducatifs et accessoires de puériculture'
  }
];
