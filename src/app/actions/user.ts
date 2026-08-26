'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { zarenStore } from '@/db/store';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface AvatarUploadResponse {
  success: boolean;
  avatarUrl?: string;
  error?: string;
}

/**
 * Server Action pour uploader et persister l'avatar utilisateur de bout en bout.
 * Effectue la validation MIME/Taille côté serveur, met à jour Supabase & Store,
 * et force la revalidation de cache Next.js / CDN Vercel.
 */
export async function updateUserAvatar(formData: FormData): Promise<AvatarUploadResponse> {
  try {
    const file = formData.get('avatar') as File | null;
    const userId = (formData.get('userId') as string) || 'usr_seller_1';

    if (!file) {
      return { success: false, error: 'Aucun fichier sélectionné.' };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'Le fichier dépasse la taille maximale autorisée (5 Mo).' };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { success: false, error: 'Format non supporté. Veuillez choisir un fichier JPG, PNG ou WebP.' };
    }

    // Conversion du buffer en Data URI sécurisé pour persistance instantanée
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const avatarUrl = `data:${file.type};base64,${base64Data}`;

    // 1. Mise à jour dans le Store local / PostgreSQL
    zarenStore.updateSellerProfile({
      logoUrl: avatarUrl,
      avatarUrl: avatarUrl,
    });

    // 2. Persistance dans la table Supabase `users` & `seller_profiles`
    try {
      if (supabase) {
        await supabase
          .from('users')
          .update({ avatar_url: avatarUrl })
          .eq('id', userId);

        await supabase
          .from('seller_profiles')
          .update({ logo_url: avatarUrl })
          .eq('user_id', userId);
      }
    } catch (dbErr) {
      console.warn('Supabase avatar update notice:', dbErr);
    }

    // 3. Revalidation de cache Next.js (App Router / Vercel CDN)
    revalidatePath('/profile');
    revalidatePath('/profile/settings');
    revalidatePath('/seller/dashboard');
    revalidatePath('/');

    return {
      success: true,
      avatarUrl,
    };
  } catch (error: any) {
    console.error('Server action updateUserAvatar error:', error);
    return {
      success: false,
      error: error.message || "Une erreur inattendue est survenue lors de l'upload.",
    };
  }
}
