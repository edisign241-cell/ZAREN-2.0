'use client';

import React, { useState, useRef } from 'react';
import { Camera, Loader2, Check, AlertCircle, Trash2, Sparkles } from 'lucide-react';
import { updateUserAvatar } from '@/app/actions/user';
import { useAuth } from '@/context/AuthContext';

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  userName?: string;
  onAvatarUpdated?: (newUrl: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function AvatarUploader({
  currentAvatarUrl,
  userName = 'Utilisateur',
  onAvatarUpdated,
}: AvatarUploaderProps) {
  const { currentUser, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeAvatar =
    previewUrl ||
    currentAvatarUrl ||
    currentUser?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setUploadSuccess(false);

    // 1. Validation Client (Taille & Type MIME)
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('Format non supporté. Veuillez sélectionner une image JPG, PNG ou WebP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('L’image est trop volumineuse (maximum 5 Mo).');
      return;
    }

    // 2. Preview instantanée
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 3. Appel du Server Action pour persistance en BDD & revalidation
    setIsUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('userId', currentUser?.id || 'usr_seller_1');

    try {
      const result = await updateUserAvatar(formData);

      if (result.success && result.avatarUrl) {
        setUploadSuccess(true);

        // 4. Synchronisation synchrone du contexte global pour mise à jour immédiate
        if (updateUser) {
          updateUser({
            avatar: result.avatarUrl,
          });
        }

        if (onAvatarUpdated) {
          onAvatarUpdated(result.avatarUrl);
        }

        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setErrorMessage(result.error || 'Erreur lors de l’enregistrement de votre avatar.');
        setPreviewUrl(null);
      }
    } catch (err: any) {
      setErrorMessage('Erreur réseau. Veuillez réessayer.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center gap-4">
        {/* Avatar avec badge d'upload */}
        <div className="relative group shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#008A45] shadow-md bg-gray-100 relative">
            <img
              src={activeAvatar}
              alt={userName}
              className={`w-full h-full object-cover transition duration-200 ${
                isUploading ? 'opacity-40 blur-2xs' : 'opacity-100'
              }`}
            />

            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white">
                <Loader2 className="w-6 h-6 animate-spin text-[#4ade80]" />
              </div>
            )}
          </div>

          {/* Bouton déclencheur Camera */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            aria-label="Changer la photo de profil"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#008A45] hover:bg-[#007339] text-white flex items-center justify-center shadow-lg border-2 border-white transition transform active:scale-90 cursor-pointer disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Instructions & États */}
        <div className="space-y-1 text-left flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black italic text-gray-900 truncate">
              Photo de profil
            </span>
            {uploadSuccess && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3 h-3" /> Enregistré
              </span>
            )}
          </div>

          <p className="text-[11px] text-gray-500">
            JPG, PNG ou WebP. Max 5 Mo. Visible sur votre dressing et vos avis.
          </p>

          <div className="flex items-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-[11px] font-bold text-[#008A45] hover:underline cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Changer la photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
