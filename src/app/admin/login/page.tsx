'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Lock, Mail, ArrowRight, Sparkles, KeyRound, AlertTriangle } from 'lucide-react';
import { adminAuthService, SUPER_ADMIN_EMAIL } from '@/lib/adminAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(SUPER_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFirstSetup, setIsFirstSetup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminAuthService.isAuthenticated()) {
      router.replace('/admin');
    } else {
      setIsFirstSetup(!adminAuthService.isPasswordSet());
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = adminAuthService.login(email, password);
      if (res.success) {
        router.push('/admin');
      } else {
        setError(res.error || 'Identifiants invalides.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6">
        
        {/* Logo & Titre */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-[#008A45] shadow-lg shadow-emerald-950">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono">
              PORTAIL DE GOUVERNANCE SÉCURISÉ
            </span>
            <h1 className="text-2xl font-black italic tracking-tight text-white mt-0.5">
              ZARÉN SUPER ADMIN
            </h1>
          </div>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Console de gestion centrale du séquestre, arbitrage des litiges et modération des partenariats.
          </p>
        </div>

        {/* Formulaire Admin */}
        <div className="bg-[#131B2A] rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-2xl space-y-5">
          {isFirstSetup && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Première configuration Administrateur :</strong>
                <span>Entrez le mot de passe de votre choix pour le compte <strong>{SUPER_ADMIN_EMAIL}</strong> afin de verrouiller la console.</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Email Administrateur */}
            <div>
              <label className="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                Identifiant Administrateur Général
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  readOnly
                  className="w-full pl-9 pr-4 py-3 bg-[#0B0F17] rounded-xl border border-gray-700 text-gray-200 font-mono text-xs focus:outline-hidden cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Mot de Passe Admin */}
            <div>
              <label className="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                {isFirstSetup ? 'Créez votre mot de passe administrateur' : 'Mot de passe administrateur'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-[#0B0F17] rounded-xl border border-gray-700 text-white font-mono text-xs focus:outline-hidden focus:border-[#008A45] focus:ring-1 focus:ring-[#008A45]"
                />
                <KeyRound className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Bouton de Connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Vérification des accès...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{isFirstSetup ? 'Activer la Console Super Admin' : 'Connexion Super Admin'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Retour au site public */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-300 font-medium transition"
          >
            ← Retourner sur la marketplace publique ZARÉN
          </Link>
        </div>

      </div>
    </div>
  );
}
