'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const { isLoggedIn, openRegisterModal } = useAuth();
  const router = useRouter();

  const handlePublishClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openRegisterModal();
    } else {
      router.push('/seller/new');
    }
  };
  return (
    <footer className="border-t border-[#E5E5E5] py-12 bg-white text-xs text-gray-500 pb-24 md:pb-12">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Col 1 : Logo & Mission */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <div className="h-8 px-2.5 py-1 rounded-xl bg-[#111827] border border-gray-800 inline-flex items-center justify-center shadow-sm">
                <img src="/logo.png" alt="ZARÉN" className="h-5 w-auto object-contain" />
              </div>
              <span className="font-black italic text-base tracking-tight text-[#111111]">
                ZARÉN
              </span>
            </Link>
            <p className="leading-relaxed font-medium">
              Le moyen simple et sécurisé de vendre et acheter en ligne en Afrique Centrale sans boutique avec séquestre Mobile Money.
            </p>
            <div className="text-[#008A45] font-bold text-xs">
              ✓ Zéro arnaque • 100 % Garanti
            </div>
          </div>

          {/* Col 2 : Navigation */}
          <div>
            <h4 className="font-black italic text-[#111111] uppercase tracking-wider text-xs mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/#marche" className="hover:text-[#111111] transition">
                  Le Grand Marché
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-[#111111] transition">
                  Carte des Boutiques
                </Link>
              </li>
              <li>
                <Link href="/profile/settings" className="hover:text-[#111111] transition">
                  Paramètres du Profil
                </Link>
              </li>
              <li>
                <Link href="/#concept" className="hover:text-[#111111] transition">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="/#securite" className="hover:text-[#111111] transition">
                  Sécurité Séquestre
                </Link>
              </li>
              <li>
                <Link href="/#tarifs" className="hover:text-[#111111] transition">
                  Tarifs & Pass Pro
                </Link>
              </li>
              <li>
                <Link href="/seller/dashboard" className="hover:text-[#111111] transition">
                  Espace Vendeur
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 : Moyens de paiement */}
          <div>
            <h4 className="font-black italic text-[#111111] uppercase tracking-wider text-xs mb-3">
              Paiements Pris en Charge
            </h4>
            <ul className="space-y-2 font-medium">
              <li>Airtel Money</li>
              <li>Moov Money</li>
              <li>MTN Mobile Money</li>
              <li>Orange Money</li>
              <li>M-Pesa</li>
            </ul>
          </div>

          {/* Col 4 : CTA Vendre */}
          <div>
            <h4 className="font-black italic text-[#111111] uppercase tracking-wider text-xs mb-3">
              Vendez en 30s
            </h4>
            <p className="mb-3 font-medium">
              Ajoutez vos photos et vidéos et partagez votre lien direct sur WhatsApp.
            </p>
            <button
              type="button"
              onClick={handlePublishClick}
              className="block w-full py-2.5 bg-[#008A45] hover:bg-[#007339] text-white font-bold rounded-xl shadow-sm text-center transition active:scale-95 cursor-pointer"
            >
              + Publier une annonce
            </button>
          </div>
        </div>

        {/* Ligne Bas Footer */}
        <div className="border-t border-[#E5E5E5] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#111827] border border-gray-800 inline-flex items-center justify-center p-0.5">
              <img src="/logo.png" alt="ZARÉN" className="w-full h-full object-contain" />
            </div>
            <span>© 2026 ZARÉN Technologies. Tous droits réservés.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/#concept" className="hover:text-[#111111] transition">
              Conditions Générales
            </Link>
            <Link href="/#securite" className="hover:text-[#111111] transition">
              Politique de Sécurité
            </Link>
            <Link href="/seller/dashboard" className="hover:text-[#111111] transition">
              Support & Litiges
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
