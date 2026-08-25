export interface AICopyResult {
  suggestedTitle: string;
  suggestedDescription: string;
  keyFeatures: string[];
}

export async function generateProductCopy(
  title: string,
  categoryOrKeywords: string,
  price?: number
): Promise<AICopyResult> {
  // Générateur de copywriting e-commerce persuasif
  const adjectives = ['Premium', 'Authentique', 'Tendance', 'Indispensable', 'Exclusif'];
  const hooks = [
    'Sublimez votre style avec cet article incontournable.',
    'Qualité supérieure garantie avec un confort et une durabilité exceptionnels.',
    'L\'alliance parfaite entre élégance moderne et praticité au quotidien.',
    'Offre limitée : profitez d\'un produit vérifié et garanti avec livraison rapide.'
  ];

  const randomHook = hooks[Math.floor(Math.random() * hooks.length)];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];

  const cleanTitle = title.trim();
  const enhancedTitle = cleanTitle.toLowerCase().includes('qualité') || cleanTitle.length > 35
    ? cleanTitle
    : `${cleanTitle} - Édition ${randomAdj}`;

  const generatedDesc = `${randomHook}

✨ CARACTÉRISTIQUES CLÉS :
• Finition soignée et matériaux de premier choix
• Conforme à 100% aux photos présentées
• Produit inspecté et garanti par le vendeur
• Possibilité de vérifier l'article à la livraison

📦 LIVRAISON & SÉQUESTRE ZARÉN :
Votre paiement reste bloqué en sécurité sur Zarén. Le vendeur n'est payé qu'après votre confirmation de réception !`;

  const keyFeatures = [
    'Qualité contrôlée',
    'Paiement sécurisé par séquestre',
    'Livraison express disponible',
    'Garantie satisfait ou remboursé'
  ];

  return {
    suggestedTitle: enhancedTitle,
    suggestedDescription: generatedDesc,
    keyFeatures
  };
}
