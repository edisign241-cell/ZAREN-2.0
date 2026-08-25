'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function LoginModal() {
  const {
    isLoginModalOpen,
    closeLoginModal,
    openRegisterModal,
    openForgotPasswordModal,
    login,
    sendOtp,
    verifyOtp
  } = useAuth();

  // Mode: 'PASSWORD' (email/phone + mot de passe) ou 'OTP' (connexion directe par SMS)
  const [authMethod, setAuthMethod] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  
  // Champs
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // État OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [generatedOtpDisplay, setGeneratedOtpDisplay] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim()) {
      setErrorMsg('Veuillez renseigner votre email ou numéro de téléphone.');
      return;
    }

    if (!password) {
      setErrorMsg('Veuillez saisir votre mot de passe.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login({ identifier, password });
      setIsLoading(false);
    }, 500);
  };

  const handleSendOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim()) {
      setErrorMsg('Veuillez renseigner votre numéro de téléphone.');
      return;
    }

    setIsLoading(true);
    const res = await sendOtp(identifier);
    setIsLoading(false);

    if (res.success) {
      setOtpSent(true);
      setGeneratedOtpDisplay(res.code);
      setCountdown(60);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const next = [...otpCode];
    next[index] = val;
    setOtpCode(next);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`login-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join('');
    if (fullCode.length < 6) {
      setErrorMsg('Veuillez saisir les 6 chiffres du code SMS reçu.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const isValid = verifyOtp(identifier, fullCode);
      if (isValid) {
        login({ identifier });
      } else {
        setErrorMsg('Code de sécurité incorrect. Veuillez réessayer.');
      }
      setIsLoading(false);
    }, 400);
  };

  const fillSimulatedOtp = () => {
    if (generatedOtpDisplay && generatedOtpDisplay.length === 6) {
      setOtpCode(generatedOtpDisplay.split(''));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop sombre flouté */}
      <div
        onClick={closeLoginModal}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* Boîte Modale */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E5E5E5] overflow-hidden z-10 flex flex-col animate-scale-in">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-[#111827] to-[#1F2937] text-white relative">
          <button
            onClick={closeLoginModal}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008A45]/20 border border-[#008A45]/40 text-[#4ade80] text-[11px] font-black italic tracking-wide mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ESPACE SÉCURISÉ ZARÉN</span>
          </div>

          <h2 className="text-xl font-black italic tracking-tight">
            Connexion à votre compte
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            Accédez à vos commandes, dressing et transactions sécurisées.
          </p>

          {/* Onglets de méthode de connexion */}
          <div className="flex bg-white/10 p-1 rounded-xl mt-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('PASSWORD');
                setErrorMsg(null);
                setOtpSent(false);
              }}
              className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                authMethod === 'PASSWORD' ? 'bg-[#008A45] text-white shadow-sm' : 'text-gray-300 hover:text-white'
              }`}
            >
              Email / Mot de passe
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('OTP');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                authMethod === 'OTP' ? 'bg-[#008A45] text-white shadow-sm' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>SMS OTP Direct</span>
            </button>
          </div>
        </div>

        {/* Corps */}
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. CONNEXION PAR EMAIL / TÉLÉPHONE + MOT DE PASSE */}
          {authMethod === 'PASSWORD' && (
            <form onSubmit={handlePasswordLogin} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Adresse Email ou Numéro de Téléphone
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ex: marlene@zaren.ga ou +241 07 45 88 12"
                    className="w-full text-xs font-semibold pl-10 pr-3 py-3 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] focus:bg-white outline-hidden focus:border-[#008A45]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-gray-700">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={openForgotPasswordModal}
                    className="text-[11px] font-bold text-[#008A45] hover:underline cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs font-semibold pl-10 pr-10 py-3 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] focus:bg-white outline-hidden focus:border-[#008A45]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 leading-relaxed font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#008A45] shrink-0" />
                <span>Protection par séquestre et chiffrement de vos données ZARÉN.</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Connexion en cours...' : 'Se Connecter →'}</span>
              </button>
            </form>
          )}

          {/* 2. CONNEXION DIRECTE PAR CODE SMS OTP */}
          {authMethod === 'OTP' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtpLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Numéro de téléphone (Mobile Money)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="+241 07 45 88 12"
                        className="w-full text-xs font-mono font-bold pl-10 pr-3 py-3 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] focus:bg-white outline-hidden focus:border-[#008A45]"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    Un code de sécurité à 6 chiffres vous sera envoyé par SMS pour valider instantanément votre identité.
                  </p>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{isLoading ? 'Envoi du SMS...' : 'Recevoir mon Code OTP SMS →'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtpLogin} className="space-y-4">
                  {/* Simulation SMS Notification */}
                  {generatedOtpDisplay && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 animate-fade-in">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                        <span className="flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                          <span>Simulation SMS ZARÉN :</span>
                        </span>
                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-sm font-black text-[#008A45]">
                          {generatedOtpDisplay}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={fillSimulatedOtp}
                        className="w-full text-[11px] font-bold text-[#008A45] hover:underline text-left cursor-pointer"
                      >
                        ⚡ Cliquez ici pour remplir automatiquement le code ({generatedOtpDisplay})
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 text-center mb-2">
                      Saisissez le code à 6 chiffres envoyé au <span className="font-mono text-[#008A45]">{identifier}</span>
                    </label>
                    <div className="flex justify-center gap-2">
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`login-otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          className="w-11 h-12 text-center text-lg font-mono font-black border-2 border-gray-200 rounded-xl focus:border-[#008A45] focus:bg-emerald-50/40 outline-hidden transition"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isLoading ? 'Vérification...' : 'Valider & Se Connecter →'}</span>
                  </button>

                  <div className="text-center text-xs">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-gray-500 hover:text-gray-800 font-medium cursor-pointer"
                    >
                      ← Changer de numéro
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Pied de modale */}
          <div className="pt-3 border-t border-gray-100 text-center text-xs text-gray-500 space-y-1.5">
            <div>
              <span>Vous n'avez pas encore de compte ? </span>
              <button
                type="button"
                onClick={openRegisterModal}
                className="font-bold text-[#008A45] hover:underline cursor-pointer"
              >
                Créer un compte ZARÉN
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
