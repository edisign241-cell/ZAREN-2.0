import fs from 'fs';
import path from 'path';
import { MediaItem, MediaType } from '@/types';

// =============================================================================
// LIMITES ET VALIDATIONS DE SÉCURITÉ
// =============================================================================

export const MEDIA_LIMITS = {
  MAX_IMAGE_SIZE_BYTES: 10 * 1024 * 1024, // 10 Mo
  MAX_VIDEO_SIZE_BYTES: 50 * 1024 * 1024, // 50 Mo
  ALLOWED_IMAGE_MIMES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_MIMES: ['video/mp4', 'video/webm', 'video/quicktime'],
  ALLOWED_IMAGE_EXTS: ['.jpg', '.jpeg', '.png', '.webp'],
  ALLOWED_VIDEO_EXTS: ['.mp4', '.mov', '.webm'],
};

export interface FileValidationResult {
  isValid: boolean;
  type?: MediaType;
  mimeType?: string;
  error?: string;
}

export function validateUploadedFile(
  fileName: string,
  mimeType: string,
  fileSizeBytes: number
): FileValidationResult {
  const ext = path.extname(fileName).toLowerCase();

  // 1. Validation Images
  if (
    MEDIA_LIMITS.ALLOWED_IMAGE_MIMES.includes(mimeType) ||
    MEDIA_LIMITS.ALLOWED_IMAGE_EXTS.includes(ext)
  ) {
    if (fileSizeBytes > MEDIA_LIMITS.MAX_IMAGE_SIZE_BYTES) {
      return {
        isValid: false,
        error: `L'image dépasse la taille maximale autorisée de ${MEDIA_LIMITS.MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} Mo.`
      };
    }
    return {
      isValid: true,
      type: 'IMAGE',
      mimeType: mimeType || 'image/jpeg'
    };
  }

  // 2. Validation Vidéos
  if (
    MEDIA_LIMITS.ALLOWED_VIDEO_MIMES.includes(mimeType) ||
    MEDIA_LIMITS.ALLOWED_VIDEO_EXTS.includes(ext)
  ) {
    if (fileSizeBytes > MEDIA_LIMITS.MAX_VIDEO_SIZE_BYTES) {
      return {
        isValid: false,
        error: `La vidéo dépasse la taille maximale autorisée de ${MEDIA_LIMITS.MAX_VIDEO_SIZE_BYTES / (1024 * 1024)} Mo.`
      };
    }
    return {
      isValid: true,
      type: 'VIDEO',
      mimeType: mimeType || 'video/mp4'
    };
  }

  return {
    isValid: false,
    error: "Format de fichier non supporté. Formats acceptés : JPG, PNG, WEBP, MP4, MOV, WEBM."
  };
}

// =============================================================================
// INTERFACE DU FOURNISSEUR DE STOCKAGE (ADAPTER PATTERN)
// =============================================================================

export interface IStorageService {
  saveFile(buffer: Buffer, originalName: string, mimeType: string): Promise<MediaItem>;
  deleteFile(fileUrl: string): Promise<boolean>;
}

// =============================================================================
// ADAPTATEUR LOCAL (/public/uploads/)
// =============================================================================

export class LocalStorageService implements IStorageService {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async saveFile(buffer: Buffer, originalName: string, mimeType: string): Promise<MediaItem> {
    const validation = validateUploadedFile(originalName, mimeType, buffer.length);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Fichier invalide');
    }

    const ext = path.extname(originalName).toLowerCase() || (validation.type === 'IMAGE' ? '.jpg' : '.mp4');
    const uniqueId = `media_zrn_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const safeFileName = `${uniqueId}${ext}`;
    const targetPath = path.join(this.uploadsDir, safeFileName);

    await fs.promises.writeFile(targetPath, buffer);

    const publicUrl = `/uploads/${safeFileName}`;

    return {
      id: uniqueId,
      url: publicUrl,
      thumbnailUrl: validation.type === 'VIDEO' ? publicUrl : undefined,
      type: validation.type!,
      mimeType: validation.mimeType!,
      name: originalName,
      sizeBytes: buffer.length,
      isPrimary: false,
      orderIndex: 0,
      createdAt: new Date().toISOString()
    };
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const fileName = path.basename(fileUrl);
      const filePath = path.join(this.uploadsDir, fileName);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

// Instance singleton
export const storageService = new LocalStorageService();
