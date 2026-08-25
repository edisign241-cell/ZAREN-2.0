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
  AlertCircle,
  KeyRound
} from 'lucide-react';

export default function ForgotPasswordModal() {
  const {
    isForgotPasswordModalOpen,
    closeForgotPasswordModal,
    openLoginModal,
    sendOtp,
    verifyOtp,
    resetPassword
  } = useAuth();

  // Étapes: 1 = Demande Identifiant, 2 = Saisie OTP, 3 = Nouveau Mot de Passe, 4 = Succès
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [generatedOtpDisplay, setGeneratedOtpDisplay] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isForgotPasswordModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim()) {
      setErrorMsg('Veuillez renseigner votre email ou numéro de téléphone.');
      return;
    }

    setIsLoading(true);
    const res = await sendOtp(identifier);
    setIsLoading(false);

    if (res.success) {
      setGeneratedOtpDisplay(res.code);
      setStep(2);
    } else {
      setErrorMsg('Erreur lors de l’envoi du code. Veuillez réessayer.');
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const next = [...otpCode];
    next[index] = val;
    setOtpCode(next);

    if (val && index < 5) {
      const nextInput = document.getElementById(`forgot-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const fullCode = otpCode.join('');

    if (fullCode.length < 6) {
      setErrorMsg('Veuillez saisir les 6 chiffres du code SMS reçu.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const isValid = verifyOtp(identifier, fullCode);
      setIsLoading(false);
      if (isValid) {
        setStep(3);
      } else {
        setErrorMsg('Code de sécurité incorrect. Veuillez vérifier le SMS.');
      }
    }, 400);
  };

  const fillSimulatedOtp = () => {
    if (generatedOtpDisplay && generatedOtpDisplay.length === 6) {
      setOtpCode(generatedOtpDisplay.split(''));
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    const res = await resetPassword({
      identifier,
      newPassword,
      otpCode: otpCode.join('')
    });
    setIsLoading(false);

    if (res.success) {
      setStep(4);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={closeForgotPasswordModal}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* Boîte Modale */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E5E5E5] overflow-hidden z-10 flex flex-col animate-scale-in">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-[#111827] to-[#1F2937] text-white relative">
          <button
            onClick={closeForgotPasswordModal}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008A45]/20 border border-[#008A45]/40 text-[#4ade80] text-[11px] font-black italic tracking-wide mb-2.5">
            <KeyRound className="w-3.5 h-3.5" />
            <span>RÉCUPÉRATION DE SÉCURITÉ</span>
          </div>

          <h2 className="text-xl font-black italic tracking-tight">
            Mot de passe oublié
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            Réinitialisez votre accès par vérification SMS sur votre numéro.
          </p>

          {/* Stepper */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-[10px] font-bold">
            <span className={step >= 1 ? 'text-[#4ade80]' : 'text-gray-500'}>1. Identifiant</span>
            <span className="text-gray-500">→</span>
            <span className={step >= 2 ? 'text-[#4ade80]' : 'text-gray-500'}>2. Code OTP</span>
            <span className="text-gray-500">→</span>
            <span className={step >= 3 ? 'text-[#4ade80]' : 'text-gray-500'}>3. Nouveau mot de passe</span>
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

          {/* ÉTAPE 1 : IDENTIFIANT */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Email ou Numéro de Téléphone (Mobile Money)
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

              <p className="text-xs text-gray-500">
                Nous vous enverrons un code de sécurité à 6 chiffres par SMS pour confirmer que vous êtes bien le titulaire du compte.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Smartphone className="w-4 h-4" />
                <span>{isLoading ? 'Envoi du code...' : 'Recevoir le Code OTP SMS →'}</span>
              </button>
            </form>
          )}

          {/* ÉTAPE 2 : SAISIE OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {generatedOtpDisplay && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                      <span>Code OTP envoyé par SMS :</span>
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
                  Code de sécurité reçu par SMS
                </label>
                <div className="flex justify-center gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`forgot-otp-${idx}`}
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
                <span>{isLoading ? 'Vérification...' : 'Valider le code →'}</span>
              </button>

              <div className="text-center text-xs">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-gray-800 font-medium cursor-pointer"
                >
                  ← Modifier l'identifiant
                </button>
              </div>
            </form>
          )}

          {/* ÉTAPE 3 : NOUVEAU MOT DE PASSE */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Au moins 6 caractères"
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

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Retapez le mot de passe"
                    className="w-full text-xs font-semibold pl-10 pr-3 py-3 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] focus:bg-white outline-hidden focus:border-[#008A45]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Enregistrement...' : 'Enregistrer le nouveau mot de passe →'}</span>
              </button>
            </form>
          )}

          {/* ÉTAPE 4 : SUCCÈS */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#008A45] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black italic text-gray-900">
                  Mot de passe mis à jour !
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Votre compte est de nouveau sécurisé et vous êtes désormais connecté.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForgotPasswordModal}
                className="w-full py-3.5 bg-[#008A45] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-md cursor-pointer"
              >
                Accéder au Grand Marché →
              </button>
            </div>
          )}

          {/* Pied de page */}
          {step !== 4 && (
            <div className="pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
              <button
                type="button"
                onClick={openLoginModal}
                className="font-bold text-[#008A45] hover:underline cursor-pointer"
              >
                ← Retour à la connexion
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
