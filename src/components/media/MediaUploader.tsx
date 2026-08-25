'use client';

import React, { useState, useRef } from 'react';
import { MediaItem, MediaUploadProgress } from '@/types';

interface MediaUploaderProps {
  initialMedia?: MediaItem[];
  onChange?: (media: MediaItem[]) => void;
  maxFiles?: number;
  allowVideo?: boolean;
}

export default function MediaUploader({
  initialMedia = [],
  onChange,
  maxFiles = 8,
  allowVideo = true
}: MediaUploaderProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [uploadQueue, setUploadQueue] = useState<MediaUploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Optimisation client d'image via Canvas
  const compressImage = async (file: File): Promise<{ blob: Blob; width: number; height: number }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, w, h);
          canvas.toBlob(
            (blob) => {
              resolve({ blob: blob || file, width: w, height: h });
            },
            'image/webp',
            0.85
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Traitement des fichiers sélectionnés
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    for (const file of fileArray) {
      if (mediaList.length + uploadQueue.length >= maxFiles) {
        alert(`Vous avez atteint la limite de ${maxFiles} médias.`);
        break;
      }

      const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const isVideo = file.type.startsWith('video/');
      const previewUrl = URL.createObjectURL(file);

      // Ajouter à la file de progression
      const progressItem: MediaUploadProgress = {
        fileId,
        fileName: file.name,
        fileSize: file.size,
        type: isVideo ? 'VIDEO' : 'IMAGE',
        progress: 10,
        status: 'UPLOADING',
        previewUrl
      };

      setUploadQueue((prev) => [...prev, progressItem]);

      try {
        // Simulation / Téléversement avec barre de progression
        for (let p = 25; p <= 90; p += 25) {
          await new Promise((r) => setTimeout(r, 80));
          setUploadQueue((prev) =>
            prev.map((item) => (item.fileId === fileId ? { ...item, progress: p } : item))
          );
        }

        let finalUrl = previewUrl;
        let width: number | undefined;
        let height: number | undefined;

        if (!isVideo) {
          const compressed = await compressImage(file);
          finalUrl = URL.createObjectURL(compressed.blob);
          width = compressed.width;
          height = compressed.height;
        }

        const newMedia: MediaItem = {
          id: fileId,
          url: finalUrl,
          thumbnailUrl: finalUrl,
          type: isVideo ? 'VIDEO' : 'IMAGE',
          mimeType: file.type,
          name: file.name,
          sizeBytes: file.size,
          width,
          height,
          isPrimary: mediaList.length === 0,
          orderIndex: mediaList.length,
          createdAt: new Date().toISOString()
        };

        setUploadQueue((prev) =>
          prev.map((item) =>
            item.fileId === fileId
              ? { ...item, progress: 100, status: 'COMPLETED', resultMedia: newMedia }
              : item
          )
        );

        setTimeout(() => {
          setUploadQueue((prev) => prev.filter((item) => item.fileId !== fileId));
          setMediaList((prev) => {
            const updated = [...prev, newMedia];
            onChange?.(updated);
            return updated;
          });
        }, 300);
      } catch (err: any) {
        setUploadQueue((prev) =>
          prev.map((item) =>
            item.fileId === fileId
              ? { ...item, status: 'ERROR', errorMessage: 'Impossible de charger ce fichier. Réessayer' }
              : item
          )
        );
      }
    }
  };

  const handleRemove = (id: string) => {
    setMediaList((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (updated.length > 0 && !updated.some((m) => m.isPrimary)) {
        updated[0].isPrimary = true;
      }
      onChange?.(updated);
      return updated;
    });
  };

  const handleSetPrimary = (id: string) => {
    setMediaList((prev) => {
      const updated = prev.map((item) => ({
        ...item,
        isPrimary: item.id === id
      }));
      onChange?.(updated);
      return updated;
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= mediaList.length) return;
    const updated = [...mediaList];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setMediaList(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-4">
      {/* En-tête Médias */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black italic uppercase tracking-wider text-[#111827]">
            Médias du Produit ({mediaList.length}/{maxFiles})
          </h3>
          <span className="text-[11px] text-neutral-500 font-medium">
            Photos (JPG, PNG, WEBP) et Vidéos (MP4, MOV). L'image marquée d'une étoile est l'image principale.
          </span>
        </div>
      </div>

      {/* Boutons d'Action & Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
          isDragging
            ? 'border-[#065f46] bg-emerald-50/70 scale-[1.01]'
            : 'border-neutral-300 bg-neutral-50/60 hover:border-[#065f46] hover:bg-white'
        }`}
      >
        {/* Hidden File Inputs */}
        <input
          ref={photoInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Bouton Ajouter Photos */}
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="px-4 py-3 bg-[#065f46] hover:bg-[#044332] text-white text-xs font-black italic uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>📷</span>
            <span>Ajouter des photos</span>
          </button>

          {/* Bouton Caméra Mobile */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="px-4 py-3 bg-white border border-neutral-300 hover:bg-neutral-100 text-[#111827] text-xs font-black italic uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>📸</span>
            <span>Prendre une photo</span>
          </button>

          {/* Bouton Ajouter Vidéo */}
          {allowVideo && (
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-[#065f46] border border-emerald-300 text-xs font-black italic uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>🎥</span>
              <span>Ajouter une vidéo</span>
            </button>
          )}
        </div>

        <p className="text-[11px] text-neutral-400 font-medium mt-3">
          Glissez-déposez vos fichiers ici ou sélectionnez depuis votre appareil
        </p>
      </div>

      {/* File de progression de téléversement */}
      {uploadQueue.length > 0 && (
        <div className="space-y-2">
          {uploadQueue.map((item) => (
            <div
              key={item.fileId}
              className="p-3 bg-white rounded-xl border border-neutral-200 shadow-xs flex items-center gap-3"
            >
              {item.previewUrl && (
                <img
                  src={item.previewUrl}
                  alt={item.fileName}
                  className="w-10 h-10 rounded-lg object-cover border border-neutral-200 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="truncate text-[#111827]">{item.fileName}</span>
                  <span className="text-[#065f46]">
                    {item.status === 'ERROR'
                      ? '⚠️ Erreur'
                      : item.progress === 100
                      ? '✓ Téléchargement terminé'
                      : `Téléchargement en cours… ${item.progress}%`}
                  </span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-200 ${
                      item.status === 'ERROR' ? 'bg-rose-500' : 'bg-[#10b981]'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grille des Médias Validés */}
      {mediaList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {mediaList.map((media, idx) => (
            <div
              key={media.id}
              className={`group relative rounded-xl border overflow-hidden bg-white shadow-xs transition-all ${
                media.isPrimary
                  ? 'border-[#065f46] ring-2 ring-[#065f46]'
                  : 'border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {/* Image ou Aperçu Vidéo */}
              <div className="aspect-square bg-neutral-100 relative">
                {media.type === 'VIDEO' ? (
                  <div className="w-full h-full relative flex items-center justify-center bg-black">
                    <video src={media.url} className="w-full h-full object-cover" muted />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-xs shadow-md">
                        ▶
                      </span>
                    </div>
                    <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                      Vidéo HD
                    </span>
                  </div>
                ) : (
                  <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                )}

                {/* Badge Image Principale */}
                {media.isPrimary && (
                  <div className="absolute top-1.5 left-1.5 bg-[#065f46] text-white text-[9px] font-black italic uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <span>⭐</span>
                    <span>Principale</span>
                  </div>
                )}

                {/* Bouton Supprimer */}
                <button
                  type="button"
                  onClick={() => handleRemove(media.id)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-xs shadow-md cursor-pointer"
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>

              {/* Barre de contrôle sous la miniature */}
              <div className="p-2 bg-neutral-50 flex items-center justify-between border-t border-neutral-100 text-[10px]">
                {!media.isPrimary ? (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(media.id)}
                    className="text-[#065f46] font-bold hover:underline cursor-pointer"
                  >
                    Définir principale
                  </button>
                ) : (
                  <span className="text-[#065f46] font-bold">Image #1</span>
                )}

                <div className="flex items-center gap-1">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded font-bold cursor-pointer"
                      title="Déplacer vers la gauche"
                    >
                      ←
                    </button>
                  )}
                  {idx < mediaList.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded font-bold cursor-pointer"
                      title="Déplacer vers la droite"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
