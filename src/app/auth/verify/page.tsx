'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '+241 07 45 88 12';
  const email = searchParams.get('email') || 'client@zaren.ga';
  const channel = (searchParams.get('channel') || 'WHATSAPP').toUpperCase();
  const targetDestination = channel === 'EMAIL' ? email : phone;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (val: string, index: number) => {
    if (/^[0-9]?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);

      // Auto-focus next input
      if (val && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // If all 6 digits are filled
      if (newOtp.every((digit) => digit !== '') && index === 5) {
        verifyCode(newOtp.join(''));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyCode = (code: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.5 }
        });
      } catch (e) {}
      router.push('/seller/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-[85vh] p-6 flex flex-col justify-between animate-fade-in bg-white max-w-md mx-auto rounded-3xl border border-[#E5E5E5] shadow-xs my-8 font-sans">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#111111] mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Modifier mes coordonnées</span>
        </button>

        <div className="mb-8">
          <span className="text-xl font-black italic tracking-tight text-[#111111] block mb-1">
            Vérification du code de sécurité
          </span>
          <p className="text-xs text-gray-500 leading-relaxed">
            Nous avons envoyé un code de confirmation à 6 chiffres par{' '}
            <strong className="text-[#111111]">
              {channel === 'EMAIL' ? 'E-mail' : channel === 'WHATSAPP' ? 'WhatsApp' : 'SMS'}
            </strong>{' '}
            à :{' '}
            <strong className="text-[#008A45]">{targetDestination}</strong>.
          </p>
        </div>

        {/* 6 Digit Inputs */}
        <div className="flex items-center justify-between gap-2 mb-8">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-12 h-14 text-center text-xl font-black rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] outline-hidden focus:border-[#008A45] focus:bg-white focus:ring-1 focus:ring-[#008A45] transition-all shadow-xs"
            />
          ))}
        </div>

        <button
          onClick={() => verifyCode(otp.join(''))}
          disabled={isVerifying || otp.some((d) => d === '')}
          className="w-full py-4 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-xs font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
        >
          <span>{isVerifying ? 'Vérification...' : 'Valider le code'}</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>

        {/* Resend link */}
        <div className="text-center mt-6">
          {timer > 0 ? (
            <span className="text-xs text-gray-400 font-medium">
              Renvoyer le code dans <strong>{timer}s</strong>
            </span>
          ) : (
            <button
              onClick={() => setTimer(45)}
              className="text-xs font-bold text-[#008A45] hover:underline inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Renvoyer un nouveau code</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-gray-500">Chargement...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
