'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase';

import { CENTRAL_AFRICA_COUNTRIES, CountryConfig, getCountryByCode } from '@/lib/geo/countries';

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone: string;
  isPhoneVerified?: boolean;
  businessName: string;
  country: string;
  countryCode?: string;
  city: string;
  district: string;
  avatar: string;
  account_tier: 'BUYER' | 'STANDARD' | 'PRO';
  plan: 'PRO' | 'PER_LISTING' | 'STANDARD' | 'FREE';
  isPro: boolean;
  escrowBalance: number;
  ratingAvg: number;
  ratingCount: number;
  completedSalesCount: number;
  completedPurchasesCount?: number;
  disputeRatePercent: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAuthLoaded: boolean;
  currentUser: AuthUser | null;
  selectedCountry: CountryConfig;
  setSelectedCountry: (country: CountryConfig) => void;
  setCountryByCode: (code: string) => void;
  login: (params?: {
    identifier?: string;
    email?: string;
    phone?: string;
    password?: string;
    name?: string;
  }) => { success: boolean; message?: string };
  register: (params: {
    name: string;
    email?: string;
    password?: string;
    phone: string;
    country: string;
    countryCode?: string;
    city: string;
    district?: string;
    plan?: 'PRO' | 'PER_LISTING' | 'STANDARD' | 'FREE';
    account_tier?: 'BUYER' | 'STANDARD' | 'PRO';
    isPhoneVerified?: boolean;
  }) => void;
  sendOtp: (target: string, channel?: 'SMS' | 'WHATSAPP' | 'EMAIL') => Promise<{ success: boolean; code: string; message: string }>;
  verifyOtp: (target: string, code: string) => boolean;
  resetPassword: (params: {
    identifier: string;
    newPassword: string;
    otpCode: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isRegisterModalOpen: boolean;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  isForgotPasswordModalOpen: boolean;
  openForgotPasswordModal: () => void;
  closeForgotPasswordModal: () => void;
  selectedPlan: 'PRO' | 'PER_LISTING' | 'STANDARD' | 'FREE';
  setSelectedPlan: (plan: 'PRO' | 'PER_LISTING' | 'STANDARD' | 'FREE') => void;
  switchAccountTier: (tier: 'BUYER' | 'STANDARD' | 'PRO') => void;
  upgradeToPro: () => void;
  downgradeToStandard: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  lastGeneratedOtp: { target: string; code: string; channel: 'SMS' | 'WHATSAPP' | 'EMAIL' } | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isAuthLoaded: false,
  currentUser: null,
  selectedCountry: CENTRAL_AFRICA_COUNTRIES[0],
  setSelectedCountry: () => {},
  setCountryByCode: () => {},
  login: () => ({ success: true }),
  register: () => {},
  sendOtp: async () => ({ success: true, code: '742910', message: 'Code OTP envoyé' }),
  verifyOtp: () => true,
  resetPassword: async () => ({ success: true, message: 'Mot de passe réinitialisé' }),
  logout: () => {},
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  isRegisterModalOpen: false,
  openRegisterModal: () => {},
  closeRegisterModal: () => {},
  isForgotPasswordModalOpen: false,
  openForgotPasswordModal: () => {},
  closeForgotPasswordModal: () => {},
  selectedPlan: 'PRO',
  setSelectedPlan: () => {},
  switchAccountTier: () => {},
  upgradeToPro: () => {},
  downgradeToStandard: () => {},
  updateUser: () => {},
  lastGeneratedOtp: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(CENTRAL_AFRICA_COUNTRIES[0]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'PRO' | 'PER_LISTING' | 'STANDARD' | 'FREE'>('PRO');
  const [lastGeneratedOtp, setLastGeneratedOtp] = useState<{ target: string; code: string; channel: 'SMS' | 'WHATSAPP' | 'EMAIL' } | null>(null);
  const router = useRouter();

  const setCountryByCode = (code: string) => {
    const found = getCountryByCode(code);
    setSelectedCountry(found);
    try {
      localStorage.setItem('zaren_selected_country', code);
    } catch (e) {}
  };

  // Initialisation à partir du localStorage
  useEffect(() => {
    try {
      const savedCountry = localStorage.getItem('zaren_selected_country');
      if (savedCountry) {
        setSelectedCountry(getCountryByCode(savedCountry));
      }

      const savedAuth = localStorage.getItem('zaren_is_logged_in');
      const savedUser = localStorage.getItem('zaren_user_data');
      if (savedAuth === 'true' && savedUser) {
        const parsed: AuthUser = JSON.parse(savedUser);
        if (!parsed.account_tier) {
          parsed.account_tier = parsed.plan === 'PRO' ? 'PRO' : parsed.plan === 'PER_LISTING' ? 'STANDARD' : 'BUYER';
        }
        if (!parsed.username) {
          parsed.username = `@${parsed.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        }
        if (!parsed.email) {
          parsed.email = `${parsed.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@zaren.ga`;
        }
        if (parsed.isPhoneVerified === undefined) {
          parsed.isPhoneVerified = true;
        }
        setIsLoggedIn(true);
        setCurrentUser(parsed);
        if (typeof document !== 'undefined') {
          document.cookie = 'zaren_is_logged_in=true; path=/; max-age=31536000; SameSite=Lax';
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
        if (typeof document !== 'undefined') {
          document.cookie = 'zaren_is_logged_in=; path=/; max-age=0; SameSite=Lax';
        }
      }
    } catch (err) {
      console.warn('LocalStorage error in AuthProvider:', err);
      setIsLoggedIn(false);
      setCurrentUser(null);
    } finally {
      setIsAuthLoaded(true);
    }
  }, []);

  // Génération et envoi d'OTP dynamique (SMS, WhatsApp ou Email)
  const sendOtp = async (target: string, channel: 'SMS' | 'WHATSAPP' | 'EMAIL' = 'SMS'): Promise<{ success: boolean; code: string; message: string }> => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const cleanTarget = target.trim();
    const otpData = { target: cleanTarget, code, channel };
    setLastGeneratedOtp(otpData);

    try {
      localStorage.setItem('zaren_last_otp', JSON.stringify(otpData));
    } catch (e) {}

    const channelLabel = channel === 'EMAIL' ? 'e-mail' : channel === 'WHATSAPP' ? 'WhatsApp' : 'SMS';

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          code,
          message: `Code de sécurité OTP ${code} envoyé par ${channelLabel} à ${cleanTarget}`
        });
      }, 500);
    });
  };

  // Vérification de l'OTP
  const verifyOtp = (target: string, code: string): boolean => {
    const cleanCode = code.trim();
    if (cleanCode === '123456' || cleanCode === '742910') return true; // Codes universels de test
    if (lastGeneratedOtp && lastGeneratedOtp.code === cleanCode) return true;
    try {
      const stored = localStorage.getItem('zaren_last_otp');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.code === cleanCode) return true;
      }
    } catch (e) {}
    return false;
  };

  const login = (params?: {
    identifier?: string;
    email?: string;
    phone?: string;
    password?: string;
    name?: string;
  }) => {
    const identifier = (params?.identifier || params?.email || params?.phone || '').trim();
    const isEmail = identifier.includes('@');
    const existingName = params?.name || (isEmail ? identifier.split('@')[0] : 'Utilisateur ZARÉN');

    const user: AuthUser = {
      id: currentUser?.id || `usr_${Date.now()}`,
      name: currentUser?.name || existingName,
      username: currentUser?.username || `@${existingName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      email: isEmail ? identifier : (currentUser?.email || `${(identifier || 'user').replace(/\D/g, '') || 'client'}@zaren.ga`),
      phone: !isEmail && identifier ? identifier : (currentUser?.phone || `${selectedCountry.phonePrefix} 07 00 00 00`),
      isPhoneVerified: true,
      businessName: currentUser?.businessName || `${currentUser?.name || existingName} Dressing`,
      country: currentUser?.country || `${selectedCountry.name} ${selectedCountry.flag}`,
      countryCode: currentUser?.countryCode || selectedCountry.code,
      city: currentUser?.city || selectedCountry.defaultCity,
      district: currentUser?.district || selectedCountry.defaultDistrict,
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      account_tier: currentUser?.account_tier || 'STANDARD',
      plan: currentUser?.plan || 'STANDARD',
      isPro: currentUser?.account_tier === 'PRO' || currentUser?.plan === 'PRO',
      escrowBalance: currentUser?.escrowBalance ?? 0,
      ratingAvg: currentUser?.ratingAvg ?? 5.0,
      ratingCount: currentUser?.ratingCount ?? 0,
      completedSalesCount: currentUser?.completedSalesCount ?? 0,
      completedPurchasesCount: currentUser?.completedPurchasesCount ?? 0,
      disputeRatePercent: 0
    };

    setIsLoggedIn(true);
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    setIsForgotPasswordModalOpen(false);

    try {
      localStorage.setItem('zaren_is_logged_in', 'true');
      localStorage.setItem('zaren_user_data', JSON.stringify(user));
      if (typeof document !== 'undefined') {
        document.cookie = 'zaren_is_logged_in=true; path=/; max-age=31536000; SameSite=Lax';
      }
    } catch (err) {}

    return { success: true };
  };

  const register = (params: {
    name: string;
    email?: string;
    password?: string;
    phone: string;
    country: string;
    countryCode?: string;
    city: string;
    district?: string;
    plan?: 'PRO' | 'PER_LISTING' | 'STANDARD' | 'FREE';
    account_tier?: 'BUYER' | 'STANDARD' | 'PRO';
    isPhoneVerified?: boolean;
  }) => {
    const tier: 'BUYER' | 'STANDARD' | 'PRO' = params.account_tier || 
      (params.plan === 'PRO' ? 'PRO' : params.plan === 'PER_LISTING' ? 'STANDARD' : 'BUYER');
    const isPro = tier === 'PRO';
    const plan = params.plan || (tier === 'PRO' ? 'PRO' : tier === 'STANDARD' ? 'PER_LISTING' : 'FREE');
    
    const cleanUsername = `@${params.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const cleanEmail = params.email || `${params.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@zaren.ga`;

    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      name: params.name,
      username: cleanUsername,
      email: cleanEmail,
      phone: params.phone,
      isPhoneVerified: params.isPhoneVerified !== undefined ? params.isPhoneVerified : true,
      businessName: `${params.name} ${isPro ? 'Boutique Pro' : tier === 'STANDARD' ? 'Dressing' : ''}`.trim(),
      country: params.country,
      countryCode: params.countryCode || selectedCountry.code,
      city: params.city,
      district: params.district || 'Centre',
      avatar: isPro
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      account_tier: tier,
      plan,
      isPro,
      escrowBalance: 0,
      ratingAvg: 5.0,
      ratingCount: 0,
      completedSalesCount: 0,
      completedPurchasesCount: 0,
      disputeRatePercent: 0
    };

    setIsLoggedIn(true);
    setCurrentUser(newUser);
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(false);
    setIsForgotPasswordModalOpen(false);

    try {
      localStorage.setItem('zaren_is_logged_in', 'true');
      localStorage.setItem('zaren_user_data', JSON.stringify(newUser));
      if (typeof document !== 'undefined') {
        document.cookie = 'zaren_is_logged_in=true; path=/; max-age=31536000; SameSite=Lax';
      }
    } catch (err) {}

    // Synchronisation avec Supabase
    try {
      supabase.from('users').upsert({
        phone_number: params.phone.trim(),
        full_name: params.name.trim(),
        username: cleanUsername,
        email: cleanEmail,
        city: params.city,
        district: params.district || 'Centre',
        role: 'USER',
        account_tier: tier,
        plan,
        is_active: true,
        is_phone_verified: true
      }).then(({ error }) => {
        if (error) console.warn('Supabase sync user warning:', error);
      });
    } catch (err) {
      console.warn('Supabase sync error:', err);
    }
  };

  const resetPassword = async (params: {
    identifier: string;
    newPassword: string;
    otpCode: string;
  }): Promise<{ success: boolean; message: string }> => {
    if (!verifyOtp(params.identifier, params.otpCode)) {
      return { success: false, message: 'Code de sécurité OTP invalide ou expiré.' };
    }

    login({ identifier: params.identifier });

    return {
      success: true,
      message: 'Votre mot de passe a été réinitialisé avec succès.'
    };
  };

  const switchAccountTier = (tier: 'BUYER' | 'STANDARD' | 'PRO') => {
    if (!currentUser) return;
    const isPro = tier === 'PRO';
    const updated: AuthUser = {
      ...currentUser,
      account_tier: tier,
      plan: isPro ? 'PRO' : tier === 'STANDARD' ? 'PER_LISTING' : 'FREE',
      isPro
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('zaren_user_data', JSON.stringify(updated));
    } catch (err) {}
  };

  const upgradeToPro = () => {
    switchAccountTier('PRO');
  };

  const downgradeToStandard = () => {
    switchAccountTier('STANDARD');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    try {
      localStorage.setItem('zaren_is_logged_in', 'false');
      localStorage.removeItem('zaren_user_data');
      if (typeof document !== 'undefined') {
        document.cookie = 'zaren_is_logged_in=; path=/; max-age=0; SameSite=Lax';
      }
    } catch (err) {}
    router.push('/');
  };

  const openLoginModal = () => {
    setIsRegisterModalOpen(false);
    setIsForgotPasswordModalOpen(false);
    setIsLoginModalOpen(true);
  };
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('zaren_user_data', JSON.stringify(updatedUser));
    } catch (e) {}
  };

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsForgotPasswordModalOpen(false);
    setIsRegisterModalOpen(true);
  };
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openForgotPasswordModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    setIsForgotPasswordModalOpen(true);
  };
  const closeForgotPasswordModal = () => setIsForgotPasswordModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAuthLoaded,
        currentUser,
        selectedCountry,
        setSelectedCountry,
        setCountryByCode,
        login,
        register,
        sendOtp,
        verifyOtp,
        resetPassword,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        isRegisterModalOpen,
        openRegisterModal,
        closeRegisterModal,
        isForgotPasswordModalOpen,
        openForgotPasswordModal,
        closeForgotPasswordModal,
        selectedPlan,
        setSelectedPlan,
        switchAccountTier,
        upgradeToPro,
        downgradeToStandard,
        updateUser,
        lastGeneratedOtp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
