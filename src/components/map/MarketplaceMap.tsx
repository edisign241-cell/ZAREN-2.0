'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ShopLocation, MapFilterState } from '@/types';
import { zarenStore } from '@/db/store';
import {
  Search,
  MapPin,
  Compass,
  Store,
  Star,
  ShieldCheck,
  Navigation,
  ExternalLink,
  Layers,
  Phone,
  CheckCircle2,
  X,
  Plus,
  Minus
} from 'lucide-react';

// Formule de Haversine pour calcul exact de distance en km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const CATEGORIES = [
  'Toutes les catégories',
  'Smartphones & High-Tech',
  'Perruques HD & Beauté',
  'Sneakers & Chaussures',
  'Air Fryer & Électro',
  'Robes & Mode Femme',
  'PS5 & Informatique',
  'Mode Homme & Jeans',
  'Parfums & Beauté'
];

const RADIUS_OPTIONS = [
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
  { value: 100, label: '100 km' },
  { value: 500, label: '500 km' }
];

export default function MarketplaceMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const leafletModuleRef = useRef<any>(null);

  const [mapType, setMapType] = useState<'STREETS' | 'SATELLITE'>('STREETS');
  const [mapLoaded, setMapLoaded] = useState(false);

  // Position utilisateur
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Filtres
  const [filters, setFilters] = useState<MapFilterState>({
    searchQuery: '',
    category: 'Toutes les catégories',
    radiusKm: 50,
    minRating: 0,
    onlyVerified: false
  });

  // Boutique sélectionnée
  const [selectedShop, setSelectedShop] = useState<ShopLocation | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Centre par défaut : Libreville, Gabon
  const defaultCenter = { lat: 0.4162, lng: 9.4673 };

  // 1. Initialisation Leaflet via import dynamique local
  useEffect(() => {
    let isMounted = true;

    const setupMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      try {
        const leaflet = await import('leaflet');
        const L = leaflet.default || leaflet;
        leafletModuleRef.current = L;

        if (!isMounted || !mapContainerRef.current) return;

        // Détruire toute instance précédente
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
          center: [defaultCenter.lat, defaultCenter.lng],
          zoom: 13,
          zoomControl: false,
          attributionControl: false
        });

        // Tuiles Rues Modernes CartoDB
        const streetTiles = L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          { maxZoom: 19 }
        );

        // Tuiles Satellite HD Esri
        const satelliteTiles = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 19 }
        );

        streetTiles.addTo(map);
        (map as any)._streetTiles = streetTiles;
        (map as any)._satelliteTiles = satelliteTiles;

        const markersGroup = L.layerGroup().addTo(map);
        markersGroupRef.current = markersGroup;
        mapInstanceRef.current = map;

        setMapLoaded(true);

        // Invalidation de taille immédiate et différée
        map.invalidateSize();
        setTimeout(() => {
          if (map) map.invalidateSize();
        }, 300);
      } catch (err) {
        console.error('Erreur initialisation Leaflet:', err);
      }
    };

    setupMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Bascule du type de carte (Plan / Satellite)
  const toggleMapType = () => {
    const nextType = mapType === 'STREETS' ? 'SATELLITE' : 'STREETS';
    setMapType(nextType);

    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      if (nextType === 'SATELLITE') {
        if (map._streetTiles) map.removeLayer(map._streetTiles);
        if (map._satelliteTiles) map._satelliteTiles.addTo(map);
      } else {
        if (map._satelliteTiles) map.removeLayer(map._satelliteTiles);
        if (map._streetTiles) map._streetTiles.addTo(map);
      }
    }
  };

  // 3. Géolocalisation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoError("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setLocatingUser(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserLocation(coords);
        setLocatingUser(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 15, { duration: 1.2 });
        }
      },
      (err) => {
        setLocatingUser(false);
        setGeoError("Position GPS indisponible. Affichage centré sur Libreville.");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // 4. Récupération des boutiques réelles
  const availableShops: ShopLocation[] = useMemo(() => {
    const seller = zarenStore.getSellerProfile();
    const list: ShopLocation[] = [
      {
        id: seller.id || 'shop_pro_1',
        name: seller.businessName || 'Boutique Officielle ZARÉN',
        photo: seller.logoUrl || seller.bannerUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        latitude: 0.4045,
        longitude: 9.4431,
        address: seller.address || 'Quartier Louis, Libreville',
        city: seller.city || 'Libreville',
        district: seller.district || 'Louis',
        category: 'Smartphones & High-Tech',
        rating: seller.ratingAvg || 5.0,
        reviewCount: seller.ratingCount || 0,
        description: seller.bio || 'Vendeur vérifié sous séquestre ZARÉN.',
        phone: seller.whatsapp || seller.payoutAccountNumber || '+241 07 45 88 12',
        isVerified: seller.isVerified,
        isOpen: true
      }
    ];
    return list;
  }, []);

  // 4. Filtrage et tri des boutiques
  const shopsWithDistance = useMemo(() => {
    return availableShops.map((shop) => {
      let distanceKm: number | undefined;
      if (userLocation) {
        distanceKm = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          shop.latitude,
          shop.longitude
        );
      }
      return { ...shop, distanceKm };
    }).filter((shop) => {
      if (filters.category !== 'Toutes les catégories' && shop.category !== filters.category) {
        return false;
      }
      if (filters.minRating > 0 && shop.rating < filters.minRating) {
        return false;
      }
      if (filters.onlyVerified && !shop.isVerified) {
        return false;
      }
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const match =
          shop.name.toLowerCase().includes(q) ||
          shop.address.toLowerCase().includes(q) ||
          shop.city.toLowerCase().includes(q) ||
          (shop.district && shop.district.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (shop.distanceKm !== undefined && shop.distanceKm > filters.radiusKm) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
        return a.distanceKm - b.distanceKm;
      }
      return b.rating - a.rating;
    });
  }, [availableShops, userLocation, filters]);

  // 5. Rendu des marqueurs sur Leaflet
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !markersGroupRef.current || !leafletModuleRef.current) return;
    const L = leafletModuleRef.current;
    const group = markersGroupRef.current;
    group.clearLayers();

    // Marqueur utilisateur
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-pulse-icon',
        html: `
          <div style="position:relative; width:28px; height:28px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:28px; height:28px; border-radius:50%; background:rgba(0,138,69,0.35); animation:pulse 1.5s infinite;"></div>
            <div style="width:14px; height:14px; border-radius:50%; background:#008A45; border:3px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(group);
    }

    // Marqueurs boutiques
    shopsWithDistance.forEach((shop) => {
      const isSelected = selectedShop?.id === shop.id;
      const markerHtml = `
        <div style="cursor:pointer; transform:${isSelected ? 'scale(1.15)' : 'scale(1)'}; transition:all 0.2s ease; display:flex; flex-direction:column; align-items:center;">
          <div style="background:${isSelected ? '#008A45' : '#111827'}; color:#ffffff; padding:5px 10px; border-radius:12px; font-weight:800; font-size:11px; font-style:italic; display:flex; align-items:center; gap:5px; box-shadow:0 4px 12px rgba(0,0,0,0.3); border:2px solid ${isSelected ? '#ffffff' : '#008A45'}; white-space:nowrap;">
            <span>🏪</span>
            <span style="max-width:120px; overflow:hidden; text-overflow:ellipsis;">${shop.name}</span>
          </div>
          <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:8px solid ${isSelected ? '#008A45' : '#111827'};"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-shop-pin',
        html: markerHtml,
        iconSize: [140, 40],
        iconAnchor: [70, 36]
      });

      const marker = L.marker([shop.latitude, shop.longitude], { icon: customIcon });
      marker.on('click', () => {
        setSelectedShop(shop);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([shop.latitude, shop.longitude], 15, { duration: 0.8 });
        }
      });

      marker.addTo(group);
    });
  }, [mapLoaded, shopsWithDistance, selectedShop, userLocation]);

  // Contrôles de zoom
  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      if (delta > 0) mapInstanceRef.current.zoomIn();
      else mapInstanceRef.current.zoomOut();
    }
  };

  // Ouverture d'itinéraire GPS Google Maps
  const handleOpenDirections = (shop: ShopLocation) => {
    const origin = userLocation
      ? `${userLocation.lat},${userLocation.lng}`
      : encodeURIComponent(`${shop.district || ''}, ${shop.city}`);
    const dest = `${shop.latitude},${shop.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8F8] text-[#111111]">
      {/* NAVBAR AVEC MENU DÉROULANT, LOGO ET TITRE */}
      <Navbar />

      {/* BARRE DE RECHERCHE ET FILTRES D'AFRIQUE CENTRALE */}
      <div className="bg-white border-b border-[#E5E5E5] px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Recherche */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Rechercher une boutique, quartier (Louis, Akwa, Bastos...)"
              className="w-full text-xs font-medium pl-9 pr-4 py-2.5 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-full outline-hidden transition"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Filtres Catégories, Rayon et Localisation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="text-xs font-semibold px-3 py-2 bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45] cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filters.radiusKm}
              onChange={(e) => setFilters({ ...filters, radiusKm: Number(e.target.value) })}
              className="text-xs font-semibold px-3 py-2 bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45] cursor-pointer"
            >
              {RADIUS_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>Rayon : {r.label}</option>
              ))}
            </select>

            {/* Bouton Me Localiser */}
            <button
              onClick={handleLocateMe}
              disabled={locatingUser}
              className={`px-3.5 py-2 rounded-xl text-xs font-black italic uppercase tracking-wider flex items-center gap-1.5 transition shadow-xs shrink-0 cursor-pointer ${
                userLocation
                  ? 'bg-emerald-100 text-[#008A45] border border-emerald-300'
                  : 'bg-[#008A45] hover:bg-[#007339] text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{locatingUser ? 'Localisation...' : userLocation ? 'Autour de moi ✓' : 'Me localiser'}</span>
            </button>
          </div>
        </div>

        {geoError && (
          <div className="text-[11px] text-[#d97706] font-medium mt-1.5 text-center">
            ⚠️ {geoError}
          </div>
        )}
      </div>

      {/* DISPOSITION PRINCIPALE : [ LISTE DES BOUTIQUES ] | [ CARTE INTERACTIVE ] */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative" style={{ minHeight: 'calc(100vh - 135px)' }}>
        
        {/* Volet Liste des Boutiques */}
        <div
          className={`w-full md:w-96 lg:w-[420px] bg-white border-r border-[#E5E5E5] flex flex-col shrink-0 z-20 transition-all duration-300 ${
            mobileDrawerOpen ? 'h-[75vh] fixed bottom-0 left-0 right-0 shadow-2xl rounded-t-3xl' : 'hidden md:flex'
          }`}
        >
          {/* En-tête de la liste */}
          <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between bg-[#F8F8F8]">
            <div>
              <h2 className="text-xs font-black italic uppercase tracking-wider text-[#008A45]">
                Boutiques & Vendeurs Pro
              </h2>
              <span className="text-[11px] text-gray-500 font-medium">
                {shopsWithDistance.length} point(s) de vente trouvé(s)
              </span>
            </div>

            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="md:hidden p-1.5 text-gray-400 hover:text-[#111111] text-xs font-bold"
            >
              ✕ Fermer
            </button>
          </div>

          {/* Liste défilante des boutiques */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {shopsWithDistance.length === 0 ? (
              <div className="text-center py-16 text-gray-400 space-y-2">
                <Store className="w-10 h-10 mx-auto text-gray-300" />
                <p className="text-xs font-black italic uppercase text-gray-600">Aucune boutique dans ce rayon</p>
                <p className="text-[11px]">Augmentez le rayon de recherche ou modifiez la catégorie.</p>
              </div>
            ) : (
              shopsWithDistance.map((shop) => {
                const isSelected = selectedShop?.id === shop.id;
                return (
                  <div
                    key={shop.id}
                    onClick={() => {
                      setSelectedShop(shop);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo([shop.latitude, shop.longitude], 15, { duration: 0.8 });
                      }
                      setMobileDrawerOpen(false);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                      isSelected
                        ? 'border-[#008A45] bg-emerald-50/50 shadow-md ring-2 ring-emerald-200'
                        : 'border-[#E5E5E5] bg-white hover:border-gray-400 hover:shadow-xs'
                    }`}
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-gray-100">
                      <img src={shop.photo} alt={shop.name} className="w-full h-full object-cover" />
                      {shop.isVerified && (
                        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-[#008A45] rounded-full border border-white"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-xs font-black italic text-[#111111] truncate">{shop.name}</h3>
                        <span className="text-[10px] font-black text-[#008A45] bg-emerald-100 px-1.5 py-0.5 rounded">
                          ✓ Vérifié
                        </span>
                      </div>

                      <span className="text-[10px] text-gray-500 font-medium block truncate">
                        {shop.category} • {shop.district || shop.city}
                      </span>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-amber-500 font-bold flex items-center gap-0.5">
                          ★ {shop.rating} <span className="text-gray-400 font-normal">({shop.reviewCount})</span>
                        </span>

                        {shop.distanceKm !== undefined ? (
                          <span className="font-bold text-[#008A45]">
                            📍 à {shop.distanceKm} km
                          </span>
                        ) : (
                          <span className="text-gray-400">📍 {shop.city}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CONTENEUR CARTE AVEC SURFACE ACTIVE LEAFLET */}
        <div className="flex-1 h-full relative bg-[#e5e3df] overflow-hidden" style={{ minHeight: '600px' }}>
          
          {/* Surface de rendu Leaflet réelle */}
          <div
            ref={mapContainerRef}
            className="absolute inset-0 w-full h-full z-10"
            style={{ width: '100%', height: '100%' }}
          />

          {/* Bouton Commutateur Plan / Satellite HD */}
          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={toggleMapType}
              className="py-2.5 px-4 bg-white/95 hover:bg-white text-[#111111] text-xs font-bold rounded-2xl border border-[#E5E5E5] shadow-xl flex items-center gap-2 backdrop-blur-md transition active:scale-95 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#008A45]" />
              <span>{mapType === 'STREETS' ? 'Vue Satellite HD' : 'Vue Plan Rues'}</span>
            </button>
          </div>

          {/* Contrôles de Zoom Flottants */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 shadow-xl">
            <button
              onClick={() => handleZoom(1)}
              className="w-10 h-10 bg-white/95 hover:bg-white text-[#111111] rounded-xl border border-[#E5E5E5] flex items-center justify-center font-bold text-base transition shadow-sm cursor-pointer"
              title="Zoomer"
            >
              <Plus className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => handleZoom(-1)}
              className="w-10 h-10 bg-white/95 hover:bg-white text-[#111111] rounded-xl border border-[#E5E5E5] flex items-center justify-center font-bold text-base transition shadow-sm cursor-pointer"
              title="Dézoomer"
            >
              <Minus className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Bouton Mobile "Voir les Boutiques" */}
          <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="px-5 py-3 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-black italic uppercase tracking-wider rounded-full shadow-2xl flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>Voir les {shopsWithDistance.length} boutiques</span>
            </button>
          </div>

          {/* FICHE POPUP DE LA BOUTIQUE SÉLECTIONNÉE */}
          {selectedShop && (
            <div className="absolute bottom-6 right-6 left-6 md:left-auto md:w-96 bg-white p-5 rounded-3xl border border-[#E5E5E5] shadow-2xl z-30 animate-scale-in">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedShop.photo}
                    alt={selectedShop.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-gray-100"
                  />
                  <div>
                    <h3 className="text-xs font-black italic uppercase text-[#111111]">
                      {selectedShop.name}
                    </h3>
                    <span className="text-[10px] text-gray-500 font-bold block">
                      {selectedShop.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedShop(null)}
                  className="text-gray-400 hover:text-[#111111] p-1 rounded-full hover:bg-gray-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-600 font-medium mb-3 leading-relaxed">
                {selectedShop.description}
              </p>

              <div className="text-xs text-gray-500 mb-4 space-y-1.5 p-3 bg-[#F8F8F8] rounded-2xl border border-gray-100">
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#008A45] shrink-0" />
                  <span className="text-gray-800 font-bold">{selectedShop.address}</span>
                </div>
                {selectedShop.distanceKm !== undefined && (
                  <div className="flex items-center gap-1.5 text-[#008A45] font-bold">
                    <Compass className="w-3.5 h-3.5 shrink-0" />
                    <span>Distance : à {selectedShop.distanceKm} km de vous</span>
                  </div>
                )}
                {selectedShop.phone && (
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-700 font-bold">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{selectedShop.phone}</span>
                  </div>
                )}
              </div>

              {/* Boutons d'Action */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => handleOpenDirections(selectedShop)}
                  className="py-3 bg-emerald-50 hover:bg-emerald-100 text-[#008A45] text-xs font-bold uppercase tracking-wider rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Itinéraire</span>
                </button>

                <Link
                  href="/shop/marlene-dressing"
                  className="py-3 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-1.5 transition text-center"
                >
                  <span>Vitrine →</span>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
