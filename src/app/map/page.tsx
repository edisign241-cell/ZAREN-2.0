import React from 'react';
import MarketplaceMap from '@/components/map/MarketplaceMap';

export const metadata = {
  title: 'Carte des Boutiques & Vendeurs | ZARÉN',
  description: 'Trouvez les boutiques et vendeurs professionnels à proximité en Afrique Centrale avec Google Maps.',
};

export default function MapPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <MarketplaceMap />
    </div>
  );
}
