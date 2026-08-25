'use client';

import React, { useState } from 'react';
import { Sparkles, Check, Wand2 } from 'lucide-react';
import { generateProductCopy, AICopyResult } from '@/lib/ai/geminiCopywriter';

interface AIProductEnhancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  onApply: (result: AICopyResult) => void;
}

export default function AIProductEnhancerModal({
  isOpen,
  onClose,
  currentTitle,
  onApply,
}: AIProductEnhancerModalProps) {
  const [titleInput, setTitleInput] = useState(currentTitle || '');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<AICopyResult | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!titleInput.trim()) {
      alert('Veuillez entrer un titre de base pour votre produit.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await generateProductCopy(titleInput, keywordsInput);
      setGeneratedResult(res);
    } catch (err) {
      alert('Erreur lors de la génération IA.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (generatedResult) {
      onApply(generatedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base">Assistant Rédaction IA</h3>
            <p className="text-[11px] text-slate-500">Générez une annonce irrésistible en 1 clic</p>
          </div>
        </div>

        {!generatedResult ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Titre ou type d'article
              </label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="Ex: Robe en soie fleurie rouge taille M"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 outline-hidden focus:border-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mots-clés ou points forts (optionnel)
              </label>
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="Ex: Neuf, importé d'Italie, chic, livraison rapide"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 outline-hidden focus:border-purple-500 font-medium"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4" />
                <span>{isLoading ? 'Génération en cours...' : 'Rédiger automatiquement'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <label className="block text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1">
                Titre suggéré
              </label>
              <p className="text-xs font-bold text-slate-900">{generatedResult.suggestedTitle}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Description vendeuse
              </label>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                {generatedResult.suggestedDescription}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleAccept}
                className="w-full py-3 px-4 rounded-xl bg-zaren-600 hover:bg-zaren-700 text-white font-bold text-xs shadow-md shadow-zaren-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Appliquer à mon annonce</span>
              </button>

              <button
                onClick={() => setGeneratedResult(null)}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Recommencer avec d'autres mots
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
