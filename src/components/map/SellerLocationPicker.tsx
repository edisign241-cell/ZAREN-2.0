'use client';

import React, { useState } from 'react';

interface SellerLocationPickerProps {
  initialAddress?: string;
  initialLat?: number;
  initialLng?: number;
  onSaveLocation?: (location: { address: string; lat: number; lng: number; city: string; district: string }) => void;
}

export default function SellerLocationPicker({
  initialAddress = 'Boulevard Quaben, Quartier Louis',
  initialLat = 0.4045,
  initialLng = 9.4431,
  onSaveLocation
}: SellerLocationPickerProps) {
  const [address, setAddress] = useState(initialAddress);
  const [city, setCity] = useState('Libreville');
  const [district, setDistrict] = useState('Louis');
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const handleGeocode = () => {
    setGeocoding(true);
    // Simulation du géocodage vers les coordonnées de quartier
    setTimeout(() => {
      setGeocoding(false);
      setSavedSuccess(false);
    }, 400);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    if (onSaveLocation) {
      onSaveLocation({ address, lat, lng, city, district });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-md max-w-2xl mx-auto space-y-6">
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="text-lg font-black italic uppercase text-[#065f46] flex items-center gap-2">
          <span>📍</span>
          <span>Localisation de ma Boutique / Point de Vente</span>
        </h2>
        <p className="text-xs text-neutral-500 font-medium mt-0.5">
          Permettez aux acheteurs à proximité de trouver votre magasin et de venir retirer leurs colis ou de commander en livraison rapide.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-black italic uppercase tracking-wider text-[#111827] mb-1">
            Adresse exacte ou point de repère *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Boulevard Quaben, en face de l'Hôtel Le Cristal"
              className="flex-1 text-xs font-medium p-3.5 border border-neutral-300 rounded-lg outline-hidden focus:border-[#065f46]"
            />
            <button
              type="button"
              onClick={handleGeocode}
              className="px-4 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold rounded-lg border border-neutral-300"
            >
              {geocoding ? 'Recherche...' : 'Vérifier 🔍'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black italic uppercase tracking-wider text-[#111827] mb-1">
              Ville *
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full text-xs font-medium p-3.5 border border-neutral-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-black italic uppercase tracking-wider text-[#111827] mb-1">
              Quartier
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full text-xs font-medium p-3.5 border border-neutral-300 rounded-lg"
            />
          </div>
        </div>

        {/* Aperçu Carte avec Marqueur Déplaçable */}
        <div className="space-y-2">
          <label className="block text-xs font-black italic uppercase tracking-wider text-[#111827]">
            Aperçu de la position sur la carte (GPS : {lat.toFixed(4)}, {lng.toFixed(4)})
          </label>
          
          <div className="relative aspect-[16/9] w-full bg-[#e5e3df] rounded-xl overflow-hidden border border-neutral-300 flex items-center justify-center">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#065f46_1px,transparent_1px)] [background-size:20px_20px]"></div>
            
            {/* Punaise boutique */}
            <div className="relative flex flex-col items-center cursor-move hover:scale-110 transition-transform">
              <div className="bg-[#065f46] text-white px-3 py-1 rounded-full text-xs font-black italic shadow-xl border-2 border-white flex items-center gap-1.5">
                <span>🏪</span>
                <span>Votre Boutique</span>
              </div>
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#065f46] -mt-0.5"></div>
            </div>

            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-neutral-600 shadow-xs">
              📍 {district}, {city} • Position confirmée
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-black italic text-[#065f46]">
            ✓ Localisation de la boutique enregistrée et visible sur la carte Zarén !
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-[#065f46] hover:bg-[#044332] text-white font-black italic text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-98"
        >
          Enregistrer la position de ma boutique
        </button>
      </form>
    </div>
  );
}
