const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3005;
const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const LOGO_SRC_FILE = path.join(__dirname, 'LOGO FAVICON', '808-ZAR.png');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Synchroniser le logo officiel
if (fs.existsSync(LOGO_SRC_FILE)) {
  try {
    fs.copyFileSync(LOGO_SRC_FILE, path.join(PUBLIC_DIR, 'logo.png'));
    fs.copyFileSync(LOGO_SRC_FILE, path.join(PUBLIC_DIR, 'favicon.png'));
  } catch (err) {
    console.error('Logo sync error:', err.message);
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Fichiers Statiques Publics
  if (pathname === '/logo.png' || pathname === '/favicon.png' || pathname === '/favicon.ico') {
    let filePath = fs.existsSync(LOGO_SRC_FILE) ? LOGO_SRC_FILE : path.join(PUBLIC_DIR, 'logo.png');
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // Fichiers uploadés
  if (pathname.startsWith('/uploads/')) {
    const fileName = path.basename(pathname);
    const filePath = path.join(UPLOADS_DIR, fileName);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeMap = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.mov': 'video/quicktime'
      };
      res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  if (pathname.startsWith('/icons/') || pathname === '/manifest.json') {
    const filePath = path.join(PUBLIC_DIR, pathname);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.json' ? 'application/json' : 'text/plain';
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  res.writeHead(200, { 
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(getDynamicZarenAppHtml());
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur ZARÉN 2.0 (Écran Paramètres Profil Actif) actif sur http://127.0.0.1:${PORT}`);
});

function getDynamicZarenAppHtml() {
  const version = Date.now();
  let logoDataUrl = '/logo.png?v=' + version;
  if (fs.existsSync(LOGO_SRC_FILE)) {
    try {
      const b64 = fs.readFileSync(LOGO_SRC_FILE).toString('base64');
      logoDataUrl = `data:image/png;base64,${b64}`;
    } catch {}
  }

  return `<!DOCTYPE html>
<html lang="fr" class="scroll-smooth bg-[#F8F8F8]">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
  <title>ZARÉN — Vendez et achetez en toute sécurité, sans boutique</title>
  <meta name="description" content="Publiez votre article en 30 secondes, partagez le lien sur WhatsApp. L'argent est sécurisé par séquestre jusqu'à la livraison." />
  <link rel="icon" type="image/png" href="${logoDataUrl}" />
  <link rel="apple-touch-icon" href="${logoDataUrl}" />
  <link rel="manifest" href="/manifest.json" />
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <!-- Confetti -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  
  <!-- Fonts Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800;1,900&display=swap" rel="stylesheet">
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brandBg: '#F8F8F8',
            brandGreen: '#008A45',
            brandGreenHover: '#007339',
            brandDark: '#111111',
            brandMuted: '#666666',
            brandBorder: '#E5E5E5',
            zarenDeep: '#065f46',
            zarenEmerald: '#10b981',
            zarenAlert: '#d97706'
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    body { 
      font-family: 'Inter', system-ui, -apple-system, sans-serif; 
      background-color: #F8F8F8;
      color: #111111;
      margin: 0;
      padding: 0;
      font-weight: 500;
      -webkit-tap-highlight-color: transparent; 
    }
    
    h1, h2, h3, .zaren-title {
      font-family: 'Inter', sans-serif;
      font-weight: 900;
      font-style: italic;
      letter-spacing: -0.02em;
    }

    .delivery-code, .code-tracking {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      font-weight: 900;
      color: #008A45;
    }

    .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    
    /* Animations Immersives */
    @keyframes floatPhone {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 15px rgba(0, 138, 69, 0.18); }
      50% { box-shadow: 0 0 28px rgba(16, 185, 129, 0.35); }
    }
    @keyframes fadeInSlideUp {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-float-phone { animation: floatPhone 4s ease-in-out infinite; }
    .animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
    .animate-fade-in { animation: fadeInSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    
    .btn-action { cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
    .btn-action:hover { opacity: 0.95; transform: translateY(-2px); }
    .btn-action:active { transform: scale(0.96); }
    
    .card-product { 
      cursor: pointer; 
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); 
    }
    .card-product:hover { 
      transform: translateY(-4px); 
      box-shadow: 0 16px 32px -8px rgba(0, 138, 69, 0.12), 0 0 0 1px rgba(16, 185, 129, 0.3); 
    }

    .card-step-hover {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .card-step-hover:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 35px -10px rgba(0, 138, 69, 0.15);
    }

    .logo-container-header {
      background: #111827;
      height: 38px;
      padding: 4px 10px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .logo-container-header:hover {
      transform: scale(1.04);
      border-color: rgba(16, 185, 129, 0.5);
    }

    /* Toggle Switch Style */
    .toggle-checkbox:checked {
      right: 0;
      border-color: #008A45;
    }
    .toggle-checkbox:checked + .toggle-label {
      background-color: #008A45;
    }
  </style>
</head>
<body class="bg-[#F8F8F8] text-[#111111] font-medium antialiased selection:bg-[#008A45] selection:text-white min-h-full flex flex-col">

  <!-- NAVIGATION OFFICIELLE -->
  <header class="sticky top-0 z-[60] bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] shadow-xs">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      
      <!-- Bouton Hamburger & Logo avec Titre -->
      <div class="flex items-center gap-3">
        <!-- Bouton Hamburger Pro (Visible uniquement si connecté) -->
        <button
          id="btn-hamburger-menu"
          onclick="window.toggleDrawerMenu(true)"
          class="btn-action p-2.5 rounded-xl bg-[#F8F8F8] hover:bg-neutral-100 border border-[#E5E5E5] text-[#111111] hover:text-[#008A45] transition flex items-center gap-2"
          title="Ouvrir le menu principal"
        >
          <i data-lucide="menu" class="w-5 h-5"></i>
          <span class="text-xs font-bold uppercase tracking-wider text-gray-700">Menu</span>
        </button>

        <!-- Logo Officiel & Titre ZARÉN -->
        <div onclick="window.navigate('/')" class="btn-action flex items-center gap-2.5 select-none cursor-pointer">
          <div class="logo-container-header">
            <img src="${logoDataUrl}" alt="ZARÉN Logo" class="h-6 w-auto object-contain" />
          </div>
          <span class="font-black italic text-lg tracking-tight text-[#111111]">ZARÉN</span>
        </div>
      </div>

      <!-- Côté Droit : Statut Séquestre & Bouton Connexion si déconnecté -->
      <div class="flex items-center gap-2">
        <button
          id="btn-header-login"
          onclick="window.navigate('/auth')"
          class="hidden px-4 py-2 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
        >
          <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
          <span>Connexion</span>
        </button>

        <span id="badge-header-escrow" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black italic bg-emerald-50 text-[#008A45] border border-emerald-200">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          <span>SÉQUESTRE 100% SÉCURISÉ</span>
        </span>
      </div>
    </div>

    <!-- Catégories Défilantes -->
    <div class="bg-white border-t border-[#E5E5E5] px-4 py-2 overflow-x-auto custom-scrollbar">
      <div id="category-pills-container" class="max-w-6xl mx-auto flex items-center gap-2"></div>
    </div>
  </header>

  <!-- ========================================================================= -->
  <!-- GRAND MENU HAMBURGER DÉROULANT (DRAWER MODAL) -->
  <!-- ========================================================================= -->
  <div id="drawer-menu-overlay" class="fixed inset-0 z-[100] hidden animate-fade-in">
    <!-- Backdrop sombre -->
    <div onclick="window.toggleDrawerMenu(false)" class="fixed inset-0 bg-black/60 backdrop-blur-xs"></div>

    <!-- Tiroir latéral -->
    <div class="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-slide-in">
      
      <!-- En-tête Tiroir -->
      <div class="p-5 bg-[#111827] text-white border-b border-neutral-800 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="h-8 px-2 py-0.5 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <img src="${logoDataUrl}" alt="ZARÉN" class="h-5 w-auto object-contain" />
            </div>
            <span class="font-black italic text-base tracking-tight">ZARÉN PRO</span>
          </div>

          <button onclick="window.toggleDrawerMenu(false)" class="btn-action p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Carte Vendeur Pro -->
        <div class="p-3.5 bg-neutral-900/90 rounded-2xl border border-neutral-700/80 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="relative w-12 h-12 rounded-xl overflow-hidden border border-[#008A45] shadow-xs shrink-0">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" alt="" class="w-full h-full object-cover" />
              <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#008A45] border border-black"></span>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <h4 class="text-xs font-black italic text-white truncate">Marlène Dressing</h4>
                <span class="p-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  <i data-lucide="award" class="w-3 h-3"></i>
                </span>
              </div>
              <span class="text-[10px] text-gray-400 block truncate">Pass Pro Actif • Libreville</span>
              <span class="text-[10px] text-[#008A45] font-black italic">🔒 482 000 FCFA sous séquestre</span>
            </div>
          </div>

          <button onclick="window.toggleDrawerMenu(false); window.navigate('/shop/marlene-dressing')" class="btn-action p-2 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-[10px] font-black uppercase flex items-center gap-1 shrink-0 transition">
            <span>Vitrine</span>
            <i data-lucide="external-link" class="w-3 h-3"></i>
          </button>
        </div>
      </div>

      <!-- Liste des Liens du Menu Déroulant -->
      <div class="flex-1 overflow-y-auto p-4 space-y-5 divide-y divide-gray-100 text-xs">
        
        <!-- SECTION 1 : ESPACE PRO & PROFIL -->
        <div class="space-y-1.5 pt-1">
          <span class="text-[10px] font-black italic uppercase tracking-wider text-[#008A45] px-2 block">
            📊 Espace Vendeur Pro & Profil
          </span>

          <button onclick="window.toggleDrawerMenu(false); window.navigate('/profile/usr_seller_1')" class="btn-action w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 text-left">
            <div class="flex items-center gap-3">
              <i data-lucide="user" class="w-4 h-4 text-[#008A45]"></i>
              <div>
                <span class="block font-bold">Mon Profil Public & Étoiles</span>
                <span class="text-[10px] text-gray-500 font-normal">Quota de notation, 64 avis clients & transactions</span>
              </div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
          </button>

          <button onclick="window.toggleDrawerMenu(false); window.navigate('/messages')" class="btn-action w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 text-left">
            <div class="flex items-center gap-3">
              <i data-lucide="message-circle" class="w-4 h-4 text-[#008A45]"></i>
              <div>
                <span class="block font-bold">Messagerie Interne & Négociations</span>
                <span class="text-[10px] text-gray-500 font-normal">Discussions directes, offres de prix et suivi</span>
              </div>
            </div>
            <span class="text-[10px] font-black bg-emerald-100 text-[#008A45] px-2 py-0.5 rounded-full">Chat</span>
          </button>

          <button onclick="window.toggleDrawerMenu(false); window.navigate('/seller/dashboard')" class="btn-action w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 text-left">
            <div class="flex items-center gap-3">
              <i data-lucide="trending-up" class="w-4 h-4 text-[#008A45]"></i>
              <div>
                <span class="block font-bold">Tableau de Bord Pro & Analytics</span>
                <span class="text-[10px] text-gray-500 font-normal">Performances, ventes, graphiques et métriques</span>
              </div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
          </button>

          <button onclick="window.toggleDrawerMenu(false); window.navigate('/shop/marlene-dressing')" class="btn-action w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 text-left">
            <div class="flex items-center gap-3">
              <i data-lucide="store" class="w-4 h-4 text-[#008A45]"></i>
              <div>
                <span class="block font-bold">Ma Vitrine Boutique Publique</span>
                <span class="text-[10px] text-gray-500 font-normal">Bannière HD, catalogue et avis certifiés</span>
              </div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
          </button>

          <button onclick="window.toggleDrawerMenu(false); window.navigate('/seller/new')" class="btn-action w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 text-left">
            <div class="flex items-center gap-3">
              <i data-lucide="plus-circle" class="w-4 h-4 text-[#008A45]"></i>
              <div>
                <span class="block font-bold">Publier un Nouvel Article (+ Vendre)</span>
                <span class="text-[10px] text-gray-500 font-normal">Choix pays, ville, quartier et lieu-dit</span>
              </div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
          </button>
        </div>

        <!-- SECTION 2 : NAVIGATION & MARCHÉ -->
        <div class="space-y-1.5 pt-3">
          <span class="text-[10px] font-black italic uppercase tracking-wider text-gray-500 px-2 block">
            🛍️ Navigation & Marché
          </span>

          <button onclick="window.toggleDrawerMenu(false); window.navigate('/')" class="btn-action w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 text-left">
            <div class="flex items-center gap-3">
              <i data-lucide="shopping-bag" class="w-4 h-4 text-gray-700"></i>
              <span>Le Grand Marché (Flux en direct)</span>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
          </button>

          <button onclick="window.toggleDrawerMenu(false); window.navigate('/map')" class="btn-action w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 text-left">
            <div class="flex items-center gap-3">
              <i data-lucide="map-pin" class="w-4 h-4 text-[#008A45]"></i>
              <span>Carte Interactive des Boutiques</span>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
          </button>

          <button onclick="window.toggleDrawerMenu(false); window.navigate('/saved')" class="btn-action w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 text-left">
            <div class="flex items-center gap-3">
              <i data-lucide="heart" class="w-4 h-4 text-rose-500"></i>
              <span>Articles Sauvegardés</span>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
          </button>
        </div>

        <!-- SECTION 3 : SÉQUESTRE & PAIEMENTS -->
        <div class="space-y-1.5 pt-3">
          <span class="text-[10px] font-black italic uppercase tracking-wider text-gray-500 px-2 block">
            💳 Séquestre & Retraits Mobile Money
          </span>

          <button onclick="window.toggleDrawerMenu(false); window.navigate('/seller/dashboard')" class="btn-action w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 text-left">
            <div class="flex items-center gap-3">
              <i data-lucide="wallet" class="w-4 h-4 text-[#008A45]"></i>
              <div>
                <span class="block font-bold">Retraits Express & Solde Disponible</span>
                <span class="text-[10px] text-gray-500 font-normal">Airtel Money & Moov Money instantané</span>
              </div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
          </button>

          <button onclick="window.toggleDrawerMenu(false); window.navigate('/securite')" class="btn-action w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 text-left">
            <div class="flex items-center gap-3">
              <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
              <div>
                <span class="block font-bold">Garantie & Fonctionnement Séquestre</span>
                <span class="text-[10px] text-gray-500 font-normal">Protection totale 100% sans arnaque</span>
              </div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
          </button>

          <button onclick="window.toggleDrawerMenu(false); window.navigate('/tarifs')" class="btn-action w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 text-left">
            <div class="flex items-center gap-3">
              <i data-lucide="award" class="w-4 h-4 text-indigo-600"></i>
              <div>
                <span class="block font-bold">Abonnement Pass Pro (4 500 FCFA/mois)</span>
                <span class="text-[10px] text-gray-500 font-normal">0% commission & boost de visibilité</span>
              </div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
          </button>
        </div>

        <!-- SECTION 4 : PARAMÈTRES & SUPPORT -->
        <div class="space-y-1.5 pt-3">
          <span class="text-[10px] font-black italic uppercase tracking-wider text-gray-500 px-2 block">
            ⚙️ Paramétrages & Support
          </span>

          <button onclick="window.toggleDrawerMenu(false); window.navigate('/profile/settings')" class="btn-action w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 text-left">
            <div class="flex items-center gap-3">
              <i data-lucide="settings" class="w-4 h-4 text-gray-700"></i>
              <div>
                <span class="block font-bold">Paramètres du Profil & Boutique</span>
                <span class="text-[10px] text-gray-500 font-normal">Bannière, horaires, adresse et Mobile Money</span>
              </div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
          </button>

          <a href="https://wa.me/24107458812" target="_blank" class="btn-action w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-[#111111] hover:bg-gray-100 text-left">
            <div class="flex items-center gap-3">
              <i data-lucide="message-circle" class="w-4 h-4 text-emerald-600"></i>
              <div>
                <span class="block font-bold">Assistance WhatsApp 24/7 (Support)</span>
                <span class="text-[10px] text-gray-500 font-normal">Arbitrage SupportResolver & aide en direct</span>
              </div>
            </div>
            <i data-lucide="external-link" class="w-3.5 h-3.5 text-gray-400"></i>
          </a>

          <button onclick="window.toggleDrawerMenu(false); window.handleLogout()" class="btn-action w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-rose-600 hover:bg-rose-50 text-left">
            <div class="flex items-center gap-3">
              <i data-lucide="log-out" class="w-4 h-4 text-rose-600"></i>
              <span>Se déconnecter</span>
            </div>
          </button>
        </div>

      </div>

      <!-- Pied du tiroir -->
      <div class="p-4 bg-[#F8F8F8] border-t border-[#E5E5E5] flex items-center justify-between">
        <span class="text-[10px] text-gray-500 font-bold">ZARÉN v2.0 • Afrique Centrale</span>
        <span class="text-[10px] font-black text-[#008A45] flex items-center gap-1">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Séquestre Garanti
        </span>
      </div>

    </div>
  </div>

  <!-- CONTENEUR DYNAMIQUE -->
  <main class="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
    <div id="view-container"></div>
  </main>

  <!-- ========================================================================= -->
  <!-- MODALE DE CONNEXION AVEC EMAIL / MOT DE PASSE OU OTP -->
  <!-- ========================================================================= -->
  <div id="login-modal-overlay" class="fixed inset-0 z-[110] hidden animate-fade-in">
    <div onclick="window.closeLoginModal()" class="fixed inset-0 bg-black/70 backdrop-blur-xs"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E5E5E5] overflow-hidden z-10 flex flex-col animate-scale-in">
        
        <!-- Header -->
        <div class="p-6 bg-gradient-to-br from-[#111827] to-[#1F2937] text-white relative">
          <button onclick="window.closeLoginModal()" class="btn-action absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008A45]/20 border border-[#008A45]/40 text-[#4ade80] text-[11px] font-black italic mb-2.5">
            <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
            <span>ESPACE SÉCURISÉ ZARÉN</span>
          </div>
          <h2 class="text-xl font-black italic tracking-tight">Connexion à votre compte</h2>
          <p class="text-xs text-gray-300 mt-0.5">Accédez à votre dressing, commandes et séquestre.</p>

          <!-- Onglets Méthode -->
          <div class="flex bg-white/10 p-1 rounded-xl mt-4 text-xs font-bold">
            <button id="tab-login-pwd" onclick="window.setLoginAuthMode('PASSWORD')" class="flex-1 py-1.5 rounded-lg bg-[#008A45] text-white transition">
              Email / Mot de passe
            </button>
            <button id="tab-login-otp" onclick="window.setLoginAuthMode('OTP')" class="flex-1 py-1.5 rounded-lg text-gray-300 hover:text-white transition flex items-center justify-center gap-1">
              <i data-lucide="smartphone" class="w-3.5 h-3.5"></i>
              <span>SMS OTP Direct</span>
            </button>
          </div>
        </div>

        <!-- Corps -->
        <div class="p-6 space-y-4">
          
          <!-- Option Mot de Passe -->
          <div id="login-form-password" class="space-y-3.5">
            <div>
              <label class="block text-[11px] font-bold text-gray-700 mb-1">Email ou Numéro Mobile Money</label>
              <div class="relative">
                <i data-lucide="mail" class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                <input id="login-identifier" type="text" placeholder="ex: marlene@zaren.ga ou +241 07 45 88 12" class="w-full text-xs font-semibold pl-10 pr-3 py-3 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] focus:bg-white outline-hidden focus:border-[#008A45]" />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[11px] font-bold text-gray-700">Mot de passe</label>
                <button type="button" onclick="window.closeLoginModal(); window.openForgotPasswordModal();" class="text-[11px] font-bold text-[#008A45] hover:underline">Mot de passe oublié ?</button>
              </div>
              <div class="relative">
                <i data-lucide="lock" class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                <input id="login-password" type="password" placeholder="••••••••••••" class="w-full text-xs font-semibold pl-10 pr-3 py-3 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] focus:bg-white outline-hidden focus:border-[#008A45]" />
              </div>
            </div>

            <button onclick="window.submitLoginPassword()" class="btn-action w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2">
              <i data-lucide="lock" class="w-3.5 h-3.5"></i>
              <span>Se Connecter →</span>
            </button>
          </div>

          <!-- Option SMS OTP Direct -->
          <div id="login-form-otp" class="space-y-3.5 hidden">
            <div id="login-otp-step1" class="space-y-3">
              <div>
                <label class="block text-[11px] font-bold text-gray-700 mb-1">Numéro de téléphone</label>
                <div class="relative">
                  <i data-lucide="phone" class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                  <input id="login-otp-phone" type="tel" placeholder="+241 07 45 88 12" class="w-full text-xs font-mono font-bold pl-10 pr-3 py-3 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] focus:bg-white outline-hidden focus:border-[#008A45]" />
                </div>
              </div>
              <button onclick="window.sendLoginOtp()" class="btn-action w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2">
                <i data-lucide="smartphone" class="w-4 h-4"></i>
                <span>Recevoir mon Code OTP SMS →</span>
              </button>
            </div>

            <div id="login-otp-step2" class="space-y-3 hidden">
              <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <div class="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>Code OTP SMS Reçu :</span>
                  <span id="login-simulated-otp-val" class="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 font-black text-[#008A45]">742910</span>
                </div>
                <button onclick="window.fillSimulatedLoginOtp()" class="text-[11px] font-bold text-[#008A45] hover:underline text-left">⚡ Cliquer pour insérer le code</button>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-700 text-center mb-2">Code à 6 chiffres</label>
                <input id="login-otp-input" type="text" maxlength="6" placeholder="742910" class="w-full text-center text-xl font-mono font-black py-3 border-2 border-gray-200 rounded-xl focus:border-[#008A45] outline-hidden" />
              </div>

              <button onclick="window.verifyLoginOtp()" class="btn-action w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2">
                <i data-lucide="check-circle-2" class="w-4 h-4"></i>
                <span>Valider & Accéder →</span>
              </button>
            </div>
          </div>

          <div class="pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
            <span>Pas encore de compte ? </span>
            <button onclick="window.closeLoginModal(); window.openRegisterModal();" class="font-bold text-[#008A45] hover:underline">Créer un compte ZARÉN</button>
          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- MODALE D'INSCRIPTION AVEC CONFIRMATION OTP SMS -->
  <!-- ========================================================================= -->
  <div id="register-modal-overlay" class="fixed inset-0 z-[110] hidden animate-fade-in">
    <div onclick="window.closeRegisterModal()" class="fixed inset-0 bg-black/70 backdrop-blur-xs"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <div class="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E5E5E5] overflow-hidden z-10 flex flex-col max-h-[90vh] animate-scale-in">
        
        <!-- Header -->
        <div class="p-6 bg-gradient-to-br from-[#111827] to-[#1F2937] text-white relative">
          <button onclick="window.closeRegisterModal()" class="btn-action absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#008A45]/20 border border-[#008A45]/40 text-[#4ade80] text-xs font-black italic mb-3">
            <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
            <span>ACCÈS SÉCURISÉ ZARÉN 2.0</span>
          </div>
          <h2 class="text-xl font-black italic tracking-tight">Créer votre compte ZARÉN</h2>
          <p class="text-xs text-gray-300 mt-0.5">Vendez et achetez en toute confiance avec le séquestre.</p>

          <!-- Stepper -->
          <div class="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 text-xs font-bold">
            <span id="reg-step-pill-1" class="px-3 py-1 rounded-full bg-[#008A45] text-white">1. Formule</span>
            <span class="text-gray-500">→</span>
            <span id="reg-step-pill-2" class="px-3 py-1 rounded-full bg-white/10 text-gray-400">2. Profil & Identité</span>
            <span class="text-gray-500">→</span>
            <span id="reg-step-pill-3" class="px-3 py-1 rounded-full bg-white/10 text-gray-400">3. OTP SMS</span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
          
          <!-- ÉTAPE 1 : CHOIX DU FORFAIT -->
          <div id="reg-step-1" class="space-y-4">
            <div onclick="window.setRegisterSelectedPlan('PRO')" id="reg-plan-pro-card" class="p-4 rounded-2xl border-2 border-[#008A45] bg-emerald-50/50 shadow-sm cursor-pointer transition relative">
              <div class="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#008A45] text-white text-[10px] font-black italic">RECOMMANDÉ MARCHANDS</div>
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-9 h-9 rounded-xl bg-emerald-100 text-[#008A45] flex items-center justify-center"><i data-lucide="sparkles" class="w-5 h-5"></i></div>
                  <div>
                    <h4 class="text-sm font-black italic text-gray-900">Abonnement Pass Pro</h4>
                    <p class="text-xs text-gray-500">Boutiques et marchands actifs</p>
                  </div>
                </div>
                <div class="text-right"><span class="text-base font-black text-[#008A45]">4 500 FCFA</span><span class="text-[10px] text-gray-400 block">/ mois</span></div>
              </div>
            </div>

            <div onclick="window.setRegisterSelectedPlan('STANDARD')" id="reg-plan-std-card" class="p-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 bg-white cursor-pointer transition">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center"><i data-lucide="zap" class="w-5 h-5 text-amber-500"></i></div>
                  <div>
                    <h4 class="text-sm font-black italic text-gray-900">Vendeur Standard (Style Vinted)</h4>
                    <p class="text-xs text-gray-500">Vendeurs occasionnels & Dressing</p>
                  </div>
                </div>
                <div class="text-right"><span class="text-base font-black text-gray-900">500 FCFA</span><span class="text-[10px] text-gray-400 block">/ acte</span></div>
              </div>
            </div>

            <button onclick="window.setRegisterStep(2)" class="btn-action w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2">
              <span>Continuer vers mes informations →</span>
            </button>
          </div>

          <!-- ÉTAPE 2 : INFORMATIONS PROFIL & EMAIL -->
          <div id="reg-step-2" class="space-y-3.5 hidden">
            <div>
              <label class="text-xs font-bold text-gray-700 mb-1 block">Nom complet *</label>
              <input id="reg-name" type="text" placeholder="Ex: Marlène Obame" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium outline-hidden focus:border-[#008A45]" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-gray-700 mb-1 block">Adresse Email *</label>
                <input id="reg-email" type="email" placeholder="marlene@exemple.com" class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium outline-hidden focus:border-[#008A45]" />
              </div>
              <div>
                <label class="text-xs font-bold text-gray-700 mb-1 block">Mot de passe *</label>
                <input id="reg-pwd" type="password" placeholder="••••••••" class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium outline-hidden focus:border-[#008A45]" />
              </div>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-700 mb-1 block">Numéro Mobile Money (pour SMS de vérification) *</label>
              <input id="reg-phone" type="tel" placeholder="+241 07 45 88 12" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-mono text-xs font-bold outline-hidden focus:border-[#008A45]" />
            </div>

            <div class="flex items-center gap-2 pt-2">
              <button onclick="window.setRegisterStep(1)" class="btn-action py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs">Retour</button>
              <button onclick="window.submitRegisterStep2()" class="btn-action flex-1 py-3.5 px-4 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg">
                <i data-lucide="smartphone" class="w-3.5 h-3.5"></i>
                <span>Vérifier mon numéro par SMS →</span>
              </button>
            </div>
          </div>

          <!-- ÉTAPE 3 : CONFIRMATION OTP SMS -->
          <div id="reg-step-3" class="space-y-4 hidden animate-scale-in">
            <div class="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
              <div class="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>Code OTP SMS Reçu :</span>
                <span id="reg-simulated-otp-val" class="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 font-black text-[#008A45]">742910</span>
              </div>
              <button onclick="window.fillSimulatedRegisterOtp()" class="text-[11px] font-bold text-[#008A45] hover:underline text-left">⚡ Cliquer pour insérer le code reçu</button>
            </div>

            <div class="text-center space-y-1">
              <h3 class="text-sm font-black italic text-gray-900">Confirmation d'Identité par SMS</h3>
              <p class="text-xs text-gray-500">Saisissez les 6 chiffres pour activer votre compte ZARÉN.</p>
            </div>

            <input id="reg-otp-input" type="text" maxlength="6" placeholder="742910" class="w-full text-center text-xl font-mono font-black py-3 border-2 border-gray-200 rounded-xl focus:border-[#008A45] outline-hidden" />

            <div class="flex items-center gap-2 pt-2">
              <button onclick="window.setRegisterStep(2)" class="btn-action py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs">Modifier</button>
              <button onclick="window.verifyRegisterOtp()" class="btn-action flex-1 py-3.5 px-4 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg">
                <i data-lucide="check-circle-2" class="w-4 h-4"></i>
                <span>Confirmer & Rejoindre ZARÉN →</span>
              </button>
            </div>
          </div>

        </div>

        <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Vous avez déjà un compte ?</span>
          <button onclick="window.closeRegisterModal(); window.openLoginModal();" class="font-bold text-[#008A45] hover:underline">Se connecter</button>
        </div>

      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- MODALE MOT DE PASSE OUBLIÉ -->
  <!-- ========================================================================= -->
  <div id="forgot-modal-overlay" class="fixed inset-0 z-[110] hidden animate-fade-in">
    <div onclick="window.closeForgotPasswordModal()" class="fixed inset-0 bg-black/70 backdrop-blur-xs"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E5E5E5] overflow-hidden z-10 flex flex-col animate-scale-in">
        
        <div class="p-6 bg-gradient-to-br from-[#111827] to-[#1F2937] text-white relative">
          <button onclick="window.closeForgotPasswordModal()" class="btn-action absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008A45]/20 border border-[#008A45]/40 text-[#4ade80] text-[11px] font-black italic mb-2.5">
            <i data-lucide="key-round" class="w-3.5 h-3.5"></i>
            <span>RÉCUPÉRATION SÉCURISÉE</span>
          </div>
          <h2 class="text-xl font-black italic tracking-tight">Mot de passe oublié</h2>
          <p class="text-xs text-gray-300 mt-0.5">Réinitialisez votre accès par vérification SMS.</p>
        </div>

        <div class="p-6 space-y-4">
          <!-- Step 1: Identifier -->
          <div id="forgot-step-1" class="space-y-3.5">
            <div>
              <label class="block text-[11px] font-bold text-gray-700 mb-1">Email ou Numéro Mobile Money</label>
              <input id="forgot-identifier" type="text" placeholder="ex: marlene@zaren.ga ou +241 07 45 88 12" class="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] outline-hidden focus:border-[#008A45]" />
            </div>
            <button onclick="window.sendForgotOtp()" class="btn-action w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2">
              <i data-lucide="smartphone" class="w-4 h-4"></i>
              <span>Recevoir le Code OTP SMS →</span>
            </button>
          </div>

          <!-- Step 2: OTP & New Password -->
          <div id="forgot-step-2" class="space-y-3.5 hidden">
            <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <div class="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>Code OTP SMS Reçu :</span>
                <span id="forgot-simulated-otp-val" class="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 font-black text-[#008A45]">742910</span>
              </div>
              <button onclick="window.fillSimulatedForgotOtp()" class="text-[11px] font-bold text-[#008A45] hover:underline text-left">⚡ Insérer le code automatiquement</button>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-gray-700 text-center mb-1">Code à 6 chiffres</label>
              <input id="forgot-otp-input" type="text" maxlength="6" placeholder="742910" class="w-full text-center text-lg font-mono font-black py-2.5 border border-gray-200 rounded-xl outline-hidden focus:border-[#008A45]" />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-gray-700 mb-1">Nouveau mot de passe</label>
              <input id="forgot-new-pwd" type="password" placeholder="••••••••••••" class="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-[#E5E5E5] outline-hidden focus:border-[#008A45]" />
            </div>

            <button onclick="window.submitNewPassword()" class="btn-action w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2">
              <i data-lucide="check-circle-2" class="w-4 h-4"></i>
              <span>Enregistrer & Se Connecter →</span>
            </button>
          </div>

          <div class="pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
            <button onclick="window.closeForgotPasswordModal(); window.openLoginModal();" class="font-bold text-[#008A45] hover:underline">← Retour à la connexion</button>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- FOOTER OFFICIEL AVEC LOGO -->
  <footer class="border-t border-[#E5E5E5] py-12 bg-white text-xs text-gray-500 mt-16 pb-24 md:pb-12">
    <div class="max-w-6xl mx-auto px-4 space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        <div class="space-y-3">
          <div onclick="window.navigate('/')" class="cursor-pointer inline-flex items-center gap-2 mb-2">
            <div class="h-8 px-2.5 py-1 rounded-xl bg-[#111827] border border-gray-800 inline-flex items-center justify-center shadow-sm">
              <img src="${logoDataUrl}" alt="ZARÉN" class="h-5 w-auto object-contain" />
            </div>
            <span class="font-black italic text-base tracking-tight text-[#111111]">ZARÉN</span>
          </div>
          <p class="leading-relaxed font-medium">
            Le moyen simple et sécurisé de vendre et acheter en ligne en Afrique Centrale sans boutique avec séquestre Mobile Money.
          </p>
          <div class="text-[#008A45] font-bold text-xs">
            ✓ Zéro arnaque • 100 % Garanti
          </div>
        </div>

        <div>
          <h4 class="font-black italic text-[#111111] uppercase tracking-wider text-xs mb-3">Navigation</h4>
          <ul class="space-y-2 font-medium">
            <li><button onclick="window.navigate('/')" class="hover:text-[#111111]">Le Grand Marché</button></li>
            <li><button onclick="window.navigate('/map')" class="hover:text-[#111111]">Carte des Boutiques</button></li>
            <li><button onclick="window.navigate('/profile/settings')" class="hover:text-[#111111]">Paramètres du Profil</button></li>
            <li><button onclick="window.navigate('/concept')" class="hover:text-[#111111]">Comment ça marche</button></li>
            <li><button onclick="window.navigate('/securite')" class="hover:text-[#111111]">Sécurité Séquestre</button></li>
            <li><button onclick="window.navigate('/seller/dashboard')" class="hover:text-[#111111]">Espace Vendeur</button></li>
          </ul>
        </div>

        <div>
          <h4 class="font-black italic text-[#111111] uppercase tracking-wider text-xs mb-3">Paiements Pris en Charge</h4>
          <ul class="space-y-2 font-medium">
            <li>Airtel Money</li>
            <li>Moov Money</li>
            <li>MTN Mobile Money</li>
            <li>Orange Money</li>
            <li>M-Pesa</li>
          </ul>
        </div>

        <div>
          <h4 class="font-black italic text-[#111111] uppercase tracking-wider text-xs mb-3">Vendez en 30s</h4>
          <p class="mb-3 font-medium">
            Ajoutez vos photos et vidéos et partagez votre lien direct sur WhatsApp.
          </p>
          <button onclick="window.navigate('/seller/new')" class="btn-action w-full py-2.5 bg-[#008A45] hover:bg-[#007339] text-white font-bold rounded-xl shadow-sm text-center">
            + Publier une annonce
          </button>
        </div>
      </div>

      <div class="border-t border-[#E5E5E5] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 rounded bg-[#111827] border border-gray-800 inline-flex items-center justify-center p-0.5">
            <img src="${logoDataUrl}" alt="ZARÉN" class="w-full h-full object-contain" />
          </div>
          <span>© 2026 ZARÉN Technologies. Tous droits réservés.</span>
        </div>
        <div class="flex gap-6">
          <button onclick="window.navigate('/concept')" class="hover:text-[#111111]">Conditions Générales</button>
          <button onclick="window.navigate('/securite')" class="hover:text-[#111111]">Politique de Sécurité</button>
          <button onclick="window.navigate('/orders/ord_9482')" class="hover:text-[#111111]">Support & Litiges</button>
        </div>
      </div>
    </div>
  </footer>

  <!-- BOTTOM BAR MOBILE -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E5E5] shadow-xl">
    <div class="grid grid-cols-5 h-14 items-center">
      <button onclick="window.navigate('/')" class="btn-action flex flex-col items-center justify-center text-[#008A45]">
        <i data-lucide="store" class="w-5 h-5"></i>
        <span class="text-[9px] font-bold uppercase mt-0.5">Marché</span>
      </button>

      <button onclick="window.navigate('/map')" class="btn-action flex flex-col items-center justify-center text-gray-500 hover:text-[#008A45]">
        <i data-lucide="map-pin" class="w-5 h-5"></i>
        <span class="text-[9px] font-bold uppercase mt-0.5">Carte</span>
      </button>

      <button onclick="window.navigate('/seller/new')" class="btn-action flex flex-col items-center justify-center text-white">
        <div class="w-8 h-8 rounded-full bg-[#008A45] text-white flex items-center justify-center shadow-md font-bold text-lg">
          +
        </div>
      </button>

      <button onclick="window.navigate('/saved')" class="btn-action flex flex-col items-center justify-center text-gray-500 hover:text-[#008A45]">
        <i data-lucide="heart" class="w-5 h-5"></i>
        <span class="text-[9px] font-bold uppercase mt-0.5">Favoris</span>
      </button>

      <button onclick="window.navigate('/profile/settings')" class="btn-action flex flex-col items-center justify-center text-gray-500 hover:text-[#008A45]">
        <i data-lucide="settings" class="w-5 h-5"></i>
        <span class="text-[9px] font-bold uppercase mt-0.5">Profil</span>
      </button>
    </div>
  </nav>

  <!-- Notification Toast -->
  <div id="toast" class="fixed top-5 right-5 z-[100] transform -translate-y-24 opacity-0 transition-all duration-300 bg-[#111111] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-neutral-700">
    <i data-lucide="check-circle-2" class="w-5 h-5 text-[#008A45]"></i>
    <span id="toast-msg">Notification</span>
  </div>

  <script>
    const LOGO_IMG_SRC = "${logoDataUrl}";

    // Définition des Pays d'Afrique Centrale avec Détection Automatique
    const CENTRAL_AFRICA_COUNTRIES = {
      'GA': {
        code: 'GA',
        name: 'Gabon',
        flag: '🇬🇦',
        phonePrefix: '+241',
        currency: 'XAF',
        currencySymbol: 'FCFA',
        timezones: ['Africa/Libreville'],
        cities: ['Toutes les villes', 'Libreville', 'Akanda', 'Port-Gentil', 'Owendo', 'Franceville'],
        paymentGateways: [
          { id: 'AIRTEL_MONEY_GA', name: 'Airtel Money' },
          { id: 'MOOV_MONEY_GA', name: 'Moov Money' }
        ]
      },
      'CM': {
        code: 'CM',
        name: 'Cameroun',
        flag: '🇨🇲',
        phonePrefix: '+237',
        currency: 'XAF',
        currencySymbol: 'FCFA',
        timezones: ['Africa/Douala', 'Africa/Yaounde', 'Africa/Lagos'],
        cities: ['Toutes les villes', 'Douala', 'Yaoundé', 'Bafoussam', 'Kribi'],
        paymentGateways: [
          { id: 'MTN_MOMO_CM', name: 'MTN Mobile Money' },
          { id: 'ORANGE_MONEY_CM', name: 'Orange Money' }
        ]
      },
      'CG': {
        code: 'CG',
        name: 'Congo-Brazzaville',
        flag: '🇨🇬',
        phonePrefix: '+242',
        currency: 'XAF',
        currencySymbol: 'FCFA',
        timezones: ['Africa/Brazzaville'],
        cities: ['Toutes les villes', 'Brazzaville', 'Pointe-Noire', 'Dolisie'],
        paymentGateways: [
          { id: 'AIRTEL_MONEY_CG', name: 'Airtel Money' },
          { id: 'MTN_MOMO_CG', name: 'MTN Mobile Money' }
        ]
      },
      'CD': {
        code: 'CD',
        name: 'RD Congo',
        flag: '🇨🇩',
        phonePrefix: '+243',
        currency: 'CDF',
        currencySymbol: 'FC',
        timezones: ['Africa/Kinshasa', 'Africa/Lubumbashi'],
        cities: ['Toutes les villes', 'Kinshasa', 'Lubumbashi', 'Goma'],
        paymentGateways: [
          { id: 'MPESA_CD', name: 'M-Pesa' },
          { id: 'ORANGE_MONEY_CD', name: 'Orange Money' },
          { id: 'AIRTEL_MONEY_CD', name: 'Airtel Money' }
        ]
      }
    };

    function detectUserZone() {
      let detectedCode = 'GA';
      try {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        for (const [code, country] of Object.entries(CENTRAL_AFRICA_COUNTRIES)) {
          if (country.timezones && country.timezones.includes(userTimezone)) {
            detectedCode = code;
            break;
          }
        }
      } catch (err) {
        console.warn('Erreur détection fuseau:', err);
      }
      return CENTRAL_AFRICA_COUNTRIES[detectedCode] || CENTRAL_AFRICA_COUNTRIES['GA'];
    }

    const CATEGORIES = [
      { id: 'TOUT', label: 'Tout le flux' },
      { id: 'PHONES', label: '📱 Smartphones & High-Tech' },
      { id: 'SNEAKERS', label: '👟 Sneakers & Chaussures' },
      { id: 'BEAUTY', label: '💇‍♀️ Perruques HD & Beauté' },
      { id: 'WOMEN_FASHION', label: '👗 Robes & Mode Femme' },
      { id: 'MEN_FASHION', label: '👔 Mode Homme & Jeans' },
      { id: 'TECH_GAMING', label: '🎮 PS5 & Informatique' },
      { id: 'HOME', label: '🍳 Air Fryer & Électro' }
    ];

    const SHOPS_LOCATIONS = [
      {
        id: 'shop_istore_lbv',
        name: 'iStore Libreville Premium',
        photo: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
        latitude: 0.4045,
        longitude: 9.4431,
        address: 'Boulevard Quaben, Quartier Louis',
        city: 'Libreville',
        district: 'Louis',
        category: 'Smartphones & High-Tech',
        rating: 5.0,
        reviewCount: 64,
        description: 'Boutique Apple & High-Tech d\\'origine certifiée.',
        isVerified: true
      },
      {
        id: 'shop_glamour_hair',
        name: 'Glamour Hair Batterie IV',
        photo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        latitude: 0.4285,
        longitude: 9.4320,
        address: 'Avenue de la Batterie IV, Résidence des Palmiers',
        city: 'Libreville',
        district: 'Batterie IV',
        category: 'Perruques HD & Beauté',
        rating: 4.9,
        reviewCount: 42,
        description: 'Perruques Lace Front HD invisibles et mèches brésiliennes.',
        isVerified: true
      },
      {
        id: 'shop_kicks_gabon',
        name: 'Kicks K-Store Gabon',
        photo: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
        latitude: 0.3920,
        longitude: 9.4580,
        address: 'Galerie Marchande, Mont-Bouët Centre',
        city: 'Libreville',
        district: 'Mont-Bouët',
        category: 'Sneakers & Chaussures',
        rating: 4.9,
        reviewCount: 58,
        description: 'Sneakers streetwear authentiques (Jordan, Nike, Yeezy).',
        isVerified: true
      }
    ];

    const INITIAL_PRODUCTS = [
      {
        id: 'prod_1',
        countryCode: 'GA',
        countryName: 'Gabon',
        category: 'PHONES',
        shortCode: 'zrn-ip14',
        title: 'iPhone 14 Pro Max 256Go Deep Purple - État Neuf Batterie 96%',
        description: 'iPhone authentique importé de France, vendu avec boîte d\\'origine, câble Lightning et coque MagSafe. Zéro rayure.',
        price: 480000,
        currency: 'XAF',
        images: [
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
        ],
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        seller: 'iStore Libreville Premium',
        city: 'Libreville',
        district: 'Louis',
        rating: 5.0,
        urgentBadge: 'Stock limité • 1 pièce',
        isSaved: true
      },
      {
        id: 'prod_2',
        countryCode: 'GA',
        countryName: 'Gabon',
        category: 'BEAUTY',
        shortCode: 'zrn-wig1',
        title: 'Perruque Lace Front HD 13x4 Cheveux 100% Naturels Brésiliens 26 Pouces',
        description: 'Dentelle HD invisible ultra-fondue, cheveux doux soyeux sans perte. Teinte naturelle 1B, prête à poser.',
        price: 85000,
        currency: 'XAF',
        images: [
          'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
        ],
        videoUrl: null,
        seller: 'Glamour Hair Batterie IV',
        city: 'Libreville',
        district: 'Batterie IV',
        rating: 4.9,
        urgentBadge: 'Qualité 12A Certifiée',
        isSaved: true
      },
      {
        id: 'prod_3',
        countryCode: 'GA',
        countryName: 'Gabon',
        category: 'SNEAKERS',
        shortCode: 'zrn-aj4c',
        title: 'Nike Air Jordan 4 Retro SE Craft Olive - Boîte d\\'Origine & Facture',
        description: 'Pointures disponibles du 40 au 45. Cuir et daim premium. Remise en main propre ou livraison sécurisée.',
        price: 45000,
        currency: 'XAF',
        images: [
          'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
        ],
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        seller: 'Kicks K-Store Gabon',
        city: 'Libreville',
        district: 'Mont-Bouët',
        rating: 4.9,
        urgentBadge: null,
        isSaved: true
      }
    ];

    function computeHaversineKm(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Math.round(R * c * 10) / 10;
    }

    const autoZone = detectUserZone();

    // État Global de l'utilisateur avec paramètres complets
    window.store = {
      detectedZone: autoZone,
      selectedCategory: 'TOUT',
      selectedCity: 'Toutes les villes',
      searchQuery: '',
      products: INITIAL_PRODUCTS,
      shops: SHOPS_LOCATIONS,
      userCoordinates: null,
      mapRadiusKm: 25,
      selectedShopId: null,
      newProductMedia: [
        {
          id: 'med_default_1',
          url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
          type: 'IMAGE',
          isPrimary: true,
          name: 'Photo 1 (Face).jpg'
        }
      ],
      currentUser: {
        fullName: 'Marlène Obame',
        phone: '07 45 88 12',
        phonePrefix: autoZone.phonePrefix,
        city: 'Libreville',
        district: 'Quartier Louis',
        countryCode: autoZone.code,
        role: 'SELLER',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        isVerified: true,
        // Paramètres Vendeur
        isSellerEnabled: true,
        businessName: 'Marlène Dressing & High-Tech',
        businessDescription: 'Vêtements chics importés et accessoires Apple d\\'origine certifiée.',
        payoutMethod: 'AIRTEL_MONEY',
        payoutPhone: '07 45 88 12',
        // Préférences Notifications
        notifWhatsApp: true,
        notifSms: true
      },
      savedTab: 'ALL',
      orders: [
        {
          id: 'ord_9482',
          orderNumber: 'ZRN-9482',
          productId: 'prod_1',
          title: 'iPhone 14 Pro Max 256Go Deep Purple',
          price: 480000,
          deliveryFee: 2000,
          totalAmount: 482000,
          status: 'DELIVERED',
          paymentMethod: 'Airtel Money 🔴',
          city: 'Libreville',
          district: 'Louis',
          countryCode: autoZone.code,
          createdAt: new Date().toISOString()
        }
      ]
    };

    function getCurrentCountry() {
      return window.store.detectedZone || autoZone;
    }

    function formatPrice(amount) {
      const c = getCurrentCountry();
      return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + (c.currencySymbol || 'FCFA');
    }

    window.showToast = function(msg) {
      const toast = document.getElementById('toast');
      const msgEl = document.getElementById('toast-msg');
      if (toast && msgEl) {
        msgEl.innerText = msg;
        toast.classList.remove('-translate-y-24', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        setTimeout(() => {
          toast.classList.add('-translate-y-24', 'opacity-0');
          toast.classList.remove('translate-y-0', 'opacity-100');
        }, 3000);
      }
    };

    window.updateSavedBadge = function() {
      const count = window.store.products.filter(p => p.isSaved).length;
      const badge = document.getElementById('saved-badge');
      if (badge) {
        if (count > 0) {
          badge.innerText = count;
          badge.classList.remove('hidden');
          badge.classList.add('flex');
        } else {
          badge.classList.add('hidden');
          badge.classList.remove('flex');
        }
      }
    };

    window.renderCategoryPills = function() {
      const container = document.getElementById('category-pills-container');
      if (!container) return;
      container.innerHTML = CATEGORIES.map(cat => \`
        <button onclick="window.setCategory('\${cat.id}')" class="btn-action px-4 py-1.5 rounded-full text-xs whitespace-nowrap flex items-center gap-1.5 \${window.store.selectedCategory === cat.id ? 'bg-[#008A45] text-white font-bold shadow-xs' : 'bg-white text-gray-600 hover:text-[#111111] hover:bg-gray-100 font-medium border border-[#E5E5E5]'}">
          <span>\${cat.label}</span>
        </button>
      \`).join('');
    };

    window.setCategory = function(catId) {
      window.store.selectedCategory = catId;
      window.renderCategoryPills();
      window.navigate('/');
    };

    window.handleSearch = function(val) {
      window.store.searchQuery = (val || '').toLowerCase().trim();
      window.render();
    };

    window.toggleSave = function(prodId, e) {
      if (e) e.stopPropagation();
      const p = window.store.products.find(item => item.id === prodId);
      if (p) {
        p.isSaved = !p.isSaved;
        window.showToast(p.isSaved ? '❤️ Annonce ajoutée aux favoris' : '💔 Annonce retirée des favoris');
        window.render();
      }
    };

    window.navigate = function(path) {
      window.location.hash = path;
      window.render();
    };

    function getFilteredProducts() {
      let list = window.store.products.filter(p => {
        const matchCity = !window.store.selectedCity || (window.store.selectedCity === 'Toutes les villes') || (p.city === window.store.selectedCity);
        const matchCat = !window.store.selectedCategory || (window.store.selectedCategory === 'TOUT') || (p.category === window.store.selectedCategory);
        const q = (window.store.searchQuery || '').toLowerCase().trim();
        const matchSearch = !q || 
          p.title.toLowerCase().includes(q) ||
          p.seller.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          (p.district && p.district.toLowerCase().includes(q));

        return matchCity && matchCat && matchSearch;
      });

      if (window.store.sortBy === 'price_asc') {
        list = [...list].sort((a, b) => a.price - b.price);
      } else if (window.store.sortBy === 'price_desc') {
        list = [...list].sort((a, b) => b.price - a.price);
      } else if (window.store.sortBy === 'video') {
        list = [...list].filter(p => p.videoUrl !== null);
      }

      return list;
    }

    // ROUTEUR CENTRAL
    window.render = function() {
      const hash = window.location.hash.slice(1) || '/';
      const container = document.getElementById('view-container');
      if (!container) return;

      const isAuth = !!window.store.currentUser;
      const btnMenu = document.getElementById('btn-hamburger-menu');
      const btnLogin = document.getElementById('btn-header-login');

      if (btnMenu) {
        if (isAuth) {
          btnMenu.classList.remove('hidden');
          btnMenu.classList.add('flex');
        } else {
          btnMenu.classList.remove('flex');
          btnMenu.classList.add('hidden');
          window.toggleDrawerMenu(false);
        }
      }

      if (btnLogin) {
        if (isAuth) {
          btnLogin.classList.add('hidden');
          btnLogin.classList.remove('flex');
        } else {
          btnLogin.classList.remove('hidden');
          btnLogin.classList.add('flex');
        }
      }

      const userNameEl = document.getElementById('user-header-name');
      if (userNameEl) {
        userNameEl.innerText = isAuth ? window.store.currentUser.fullName.split(' ')[0] : 'Connexion';
      }
      window.updateSavedBadge();

      if (hash === '' || hash === '/' || hash === '/search') {
        // Si l'utilisateur est connecté, afficher DIRECTEMENT le Marché.
        // Si l'utilisateur n'est pas connecté ou déconnecté, afficher la Landing Page !
        if (window.store.currentUser) {
          container.innerHTML = renderFeedGrid();
        } else {
          container.innerHTML = renderConceptLanding();
        }
      } else if (hash === '/messages') {
        container.innerHTML = renderMessagesView();
      } else if (hash.startsWith('/profile/')) {
        const profId = hash.replace('/profile/', '');
        if (profId === 'settings') {
          container.innerHTML = renderProfileSettings();
        } else if (profId === 'media') {
          container.innerHTML = renderProfileMediaManager();
        } else {
          container.innerHTML = renderUserProfileView(profId);
        }
      } else if (hash === '/profile/settings' || hash === '/settings') {
        container.innerHTML = renderProfileSettings();
      } else if (hash === '/concept') {
        container.innerHTML = renderConceptLanding();
      } else if (hash === '/securite') {
        container.innerHTML = renderSecurityEscrowPage();
      } else if (hash === '/tarifs') {
        container.innerHTML = renderPricingSection();
      } else if (hash === '/map') {
        container.innerHTML = renderMapInteractiveView();
      } else if (hash.startsWith('/p/')) {
        const code = hash.replace('/p/', '');
        container.innerHTML = renderProductDetail(code);
      } else if (hash.startsWith('/checkout/')) {
        const prodId = hash.replace('/checkout/', '');
        container.innerHTML = renderCheckout(prodId);
      } else if (hash === '/saved') {
        container.innerHTML = renderSaved();
      } else if (hash === '/auth') {
        container.innerHTML = window.store.currentUser ? renderProfileSettings() : renderLogin();
      } else if (hash === '/auth/register') {
        container.innerHTML = renderRegister();
      } else if (hash.startsWith('/auth/verify')) {
        container.innerHTML = renderVerify();
      } else if (hash === '/seller/new') {
        container.innerHTML = renderNewProduct();
      } else if (hash.startsWith('/seller/share/')) {
        const code = hash.replace('/seller/share/', '');
        container.innerHTML = renderViralShareScreen(code);
      } else if (hash.startsWith('/shop/')) {
        const shopId = hash.replace('/shop/', '');
        container.innerHTML = renderShopShowcaseView(shopId);
      } else if (hash === '/profile/media') {
        container.innerHTML = renderProfileMediaManager();
      } else if (hash === '/seller/dashboard') {
        container.innerHTML = renderSellerDashboard();
      } else if (hash.startsWith('/orders/')) {
        const ordId = hash.replace('/orders/', '');
        container.innerHTML = renderOrderTracking(ordId);
      } else {
        container.innerHTML = window.store.currentUser ? renderFeedGrid() : renderConceptLanding();
      }

      if (window.lucide) {
        window.lucide.createIcons();
      }

      window.scrollTo(0, 0);
    };

    window.handleLogout = function() {
      window.store.currentUser = null;
      window.showToast('👋 Déconnexion réussie. À bientôt sur ZARÉN !');
      window.navigate('/');
    };

    window.handleLoginSubmit = function(name, phone) {
      window.store.currentUser = {
        fullName: name || 'Marlène Obame',
        phone: phone || '07 45 88 12',
        city: 'Libreville',
        district: 'Quartier Louis',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        businessName: 'Marlène Dressing & High-Tech',
        isSellerEnabled: true,
        payoutMethod: 'AIRTEL_MONEY'
      };
      window.showToast('✨ Bienvenue sur ZARÉN !');
      window.navigate('/');
    };

    // ==========================================
    // ÉCRAN « PARAMÈTRES DU PROFIL » MOBILE-FIRST
    // ==========================================
    function renderProfileSettings() {
      const u = window.store.currentUser || {
        fullName: 'Marlène Obame',
        phone: '07 45 88 12',
        phonePrefix: '+241',
        city: 'Libreville',
        district: 'Quartier Louis',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        isSellerEnabled: true,
        businessName: 'Marlène Dressing & High-Tech',
        businessDescription: 'Vêtements chics importés et accessoires Apple certifiés.',
        payoutMethod: 'AIRTEL_MONEY',
        payoutPhone: '07 45 88 12',
        notifWhatsApp: true,
        notifSms: true
      };

      const c = getCurrentCountry();

      return \`
        <div class="max-w-xl mx-auto space-y-5 animate-fade-in pb-12">
          
          <!-- En-tête de page épuré -->
          <div class="flex items-center justify-between pt-2">
            <div class="flex items-center gap-3">
              <button onclick="window.navigate('/')" class="btn-action p-2 rounded-xl bg-white border border-[#E5E5E5] text-[#111111] hover:bg-neutral-50 shadow-xs" title="Retour">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
              </button>
              <div>
                <h1 class="text-xl font-black italic text-[#111111] tracking-tight">Paramètres du profil</h1>
                <span class="text-xs text-gray-500 font-medium">Gérez vos informations & préférences ZARÉN</span>
              </div>
            </div>

            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black italic bg-emerald-50 text-[#008A45] border border-emerald-200">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> VÉRIFIÉ
            </span>
          </div>

          <form onsubmit="window.saveProfileSettings(event)" class="space-y-4">
            
            <!-- CARTE 1 : INFORMATIONS PERSONNELLES -->
            <div class="bg-white rounded-2xl p-5 border border-[#E5E5E5] shadow-xs space-y-4">
              <div class="flex items-center gap-2 border-b border-[#E5E5E5] pb-3">
                <i data-lucide="user" class="w-4 h-4 text-[#008A45]"></i>
                <h2 class="text-xs font-black italic uppercase tracking-wider text-[#111111]">
                  1. Informations personnelles
                </h2>
              </div>

              <!-- Photo / Avatar -->
              <div class="flex items-center gap-4 pt-1">
                <div class="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#008A45] shadow-sm shrink-0 bg-neutral-100">
                  <img id="settings-avatar-img" src="\${u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}" class="w-full h-full object-cover" />
                </div>
                <div class="space-y-1.5 flex-1">
                  <label class="btn-action inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#008A45] text-xs font-bold rounded-xl border border-emerald-200 cursor-pointer shadow-xs">
                    <i data-lucide="camera" class="w-3.5 h-3.5"></i>
                    <span>Changer la photo</span>
                    <input type="file" accept="image/*" onchange="window.handleSettingsAvatarChange(event)" class="hidden" />
                  </label>
                  <p class="text-[10px] text-gray-500 font-medium">Formats acceptés : JPG, PNG ou WEBP (max 5 Mo)</p>
                </div>
              </div>

              <!-- Nom complet -->
              <div class="space-y-1">
                <label class="block text-[11px] font-bold uppercase text-gray-600">Nom complet *</label>
                <input
                  id="set-fullname"
                  type="text"
                  required
                  value="\${u.fullName}"
                  placeholder="Ex: Marlène Obame"
                  class="w-full text-xs font-semibold px-3.5 py-3 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                />
              </div>

              <!-- Téléphone avec préfixe pays -->
              <div class="space-y-1">
                <label class="block text-[11px] font-bold uppercase text-gray-600">Numéro de téléphone *</label>
                <div class="relative flex items-center">
                  <span class="absolute left-3.5 text-xs font-bold text-gray-600 select-none">
                    \${c.flag} \${c.phonePrefix}
                  </span>
                  <input
                    id="set-phone"
                    type="tel"
                    required
                    value="\${u.phone}"
                    placeholder="07 45 88 12"
                    class="w-full text-xs font-bold pl-20 pr-3.5 py-3 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                  />
                </div>
              </div>

              <!-- Ville & Quartier -->
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="block text-[11px] font-bold uppercase text-gray-600">Ville *</label>
                  <select id="set-city" class="w-full text-xs font-medium px-3 py-3 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition">
                    \${c.cities.filter(city => city !== 'Toutes les villes').map(cityName => \`
                      <option value="\${cityName}" \${u.city === cityName ? 'selected' : ''}>\${cityName}</option>
                    \`).join('')}
                  </select>
                </div>

                <div class="space-y-1">
                  <label class="block text-[11px] font-bold uppercase text-gray-600">Quartier *</label>
                  <input
                    id="set-district"
                    type="text"
                    required
                    value="\${u.district || 'Centre'}"
                    placeholder="Ex: Quartier Louis"
                    class="w-full text-xs font-semibold px-3.5 py-3 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                  />
                </div>
              </div>
            </div>

            <!-- CARTE 2 : SECTION VENDEUR (TOGGLE ON/OFF) -->
            <div class="bg-white rounded-2xl p-5 border border-[#E5E5E5] shadow-xs space-y-4">
              <div class="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                <div class="flex items-center gap-2">
                  <i data-lucide="store" class="w-4 h-4 text-[#008A45]"></i>
                  <h2 class="text-xs font-black italic uppercase tracking-wider text-[#111111]">
                    2. Section Vendeur
                  </h2>
                </div>

                <!-- Toggle Switch Mode Vendeur -->
                <label class="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    id="set-toggle-seller"
                    type="checkbox"
                    \${u.isSellerEnabled ? 'checked' : ''}
                    onchange="window.toggleSellerSection(this.checked)"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008A45]"></div>
                  <span class="ml-2 text-xs font-bold text-[#111111]">\${u.isSellerEnabled ? 'Actif' : 'Inactif'}</span>
                </label>
              </div>

              <!-- Contenu déroulant Vendeur -->
              <div id="seller-fields-container" class="\${u.isSellerEnabled ? '' : 'hidden'} space-y-4 pt-1">
                
                <!-- BANDEAU STATUT PASS PRO & ACCÈS VITRINE -->
                <div class="p-4 rounded-2xl bg-[#111827] text-white space-y-2 relative overflow-hidden shadow-md">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black italic uppercase tracking-widest text-[#008A45] flex items-center gap-1">
                      <i data-lucide="award" class="w-3.5 h-3.5"></i> STATUT ABONNEMENT
                    </span>
                    <span class="px-2.5 py-0.5 rounded-full text-[9px] font-black italic bg-[#008A45] text-white">
                      PASS PRO ACTIF
                    </span>
                  </div>

                  <div>
                    <h3 class="text-sm font-black italic">Vitrine Boutique & Avis Clients Débloqués</h3>
                    <p class="text-[11px] text-gray-300">Bannière HD personnalisée, notation certifiée et déblocage prioritaire.</p>
                  </div>

                  <div class="pt-2">
                    <button
                      type="button"
                      onclick="window.navigate('/shop/marlene-dressing')"
                      class="btn-action w-full py-2.5 px-3 rounded-xl bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <i data-lucide="eye" class="w-4 h-4"></i>
                      <span>Voir ma vitrine boutique publique & mes avis</span>
                      <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>

                <!-- BANNIÈRE DE COUVERTURE DE LA BOUTIQUE -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label class="block text-[11px] font-bold uppercase text-gray-700">
                      Bannière de couverture de la boutique *
                    </label>
                    <span class="text-[10px] text-gray-400 font-mono">Format 16:9</span>
                  </div>

                  <div class="relative h-32 w-full rounded-2xl overflow-hidden border border-[#E5E5E5] bg-neutral-900 group shadow-inner">
                    <img
                      id="set-shop-banner-img"
                      src="\${u.shopBanner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'}"
                      class="w-full h-full object-cover opacity-90"
                    />
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <label class="btn-action px-3 py-1.5 bg-white/90 hover:bg-white text-[#111111] text-xs font-bold rounded-xl cursor-pointer shadow-md flex items-center gap-1.5">
                        <i data-lucide="camera" class="w-3.5 h-3.5 text-[#008A45]"></i>
                        <span>Changer la bannière</span>
                        <input type="file" accept="image/*" onchange="window.handleShopBannerUpload(event)" class="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                <!-- NOM DE L'ACTIVITÉ / BOUTIQUE -->
                <div class="space-y-1">
                  <label class="block text-[11px] font-bold uppercase text-gray-600">Nom de l'activité / Boutique *</label>
                  <input
                    id="set-business-name"
                    type="text"
                    value="\${u.businessName || 'Marlène Dressing & High-Tech'}"
                    placeholder="Ex: Marlène Dressing & High-Tech"
                    class="w-full text-xs font-semibold px-3.5 py-3 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                  />
                </div>

                <!-- SLOGAN DE LA BOUTIQUE -->
                <div class="space-y-1">
                  <label class="block text-[11px] font-bold uppercase text-gray-600">Slogan de la boutique</label>
                  <input
                    id="set-business-slogan"
                    type="text"
                    value="\${u.businessSlogan || 'Vêtements chics importés & Accessoires Apple d\\'origine certifiée'}"
                    placeholder="Ex: Vêtements chics importés & Accessoires Apple d'origine certifiée"
                    class="w-full text-xs font-medium px-3.5 py-2.5 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                  />
                </div>

                <!-- DESCRIPTION COURTE -->
                <div class="space-y-1">
                  <label class="block text-[11px] font-bold uppercase text-gray-600">Description courte de l'activité</label>
                  <textarea
                    id="set-business-desc"
                    rows="2"
                    placeholder="Décrivez en quelques mots vos produits et votre garantie de qualité..."
                    class="w-full text-xs font-medium px-3.5 py-2.5 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] focus:bg-white rounded-xl outline-hidden transition"
                  >\${u.businessDescription || 'Vêtements chics importés et accessoires Apple d\\'origine certifiée.'}</textarea>
                </div>

                <!-- INFORMATIONS PRATIQUES (HORAIRES, ADRESSE, WHATSAPP) -->
                <div class="p-4 bg-[#F8F8F8] rounded-2xl border border-[#E5E5E5] space-y-3">
                  <h3 class="text-xs font-black italic uppercase tracking-wider text-[#111111]">
                    Informations Pratiques & Contact Boutique
                  </h3>

                  <div class="space-y-1">
                    <label class="block text-[10px] font-bold uppercase text-gray-600">Adresse physique / Point de retrait</label>
                    <input
                      id="set-shop-address"
                      type="text"
                      value="\${u.shopAddress || 'Galerie Marchande Louis, Boutique N°14'}"
                      class="w-full text-xs font-medium p-2.5 bg-white border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45]"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="block text-[10px] font-bold uppercase text-gray-600">Horaires d'ouverture</label>
                    <input
                      id="set-shop-hours"
                      type="text"
                      value="\${u.shopHours || 'Lun - Sam : 08h30 - 19h00'}"
                      class="w-full text-xs font-medium p-2.5 bg-white border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45]"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="block text-[10px] font-bold uppercase text-gray-600">WhatsApp Direct Boutique</label>
                    <input
                      id="set-shop-wa"
                      type="tel"
                      value="\${u.shopWhatsapp || '+241 07 45 88 12'}"
                      class="w-full text-xs font-mono font-bold p-2.5 bg-white border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45]"
                    />
                  </div>
                </div>

                <!-- Moyens de paiement pour retrait -->
                <div class="space-y-2 pt-1 border-t border-[#E5E5E5]">
                  <label class="block text-[11px] font-bold uppercase text-gray-600">Compte de retrait Mobile Money *</label>
                  <div class="grid grid-cols-2 gap-2">
                    \${c.paymentGateways.map(gw => \`
                      <label class="btn-action p-2.5 bg-[#F8F8F8] border rounded-xl flex items-center justify-between cursor-pointer \${u.payoutMethod === gw.id ? 'border-[#008A45] bg-emerald-50/50' : 'border-[#E5E5E5]'}">
                        <span class="text-xs font-bold text-[#111111]">\${gw.name}</span>
                        <input type="radio" name="set_payout_gw" value="\${gw.id}" \${u.payoutMethod === gw.id ? 'checked' : ''} class="text-[#008A45]" />
                      </label>
                    \`).join('')}
                  </div>

                  <div class="space-y-1 pt-1">
                    <label class="block text-[10px] font-medium text-gray-500">Numéro Mobile Money qui recevra les déblocages de fonds</label>
                    <input
                      id="set-payout-phone"
                      type="tel"
                      value="\${u.payoutPhone || u.phone}"
                      placeholder="07 45 88 12"
                      class="w-full text-xs font-bold px-3.5 py-2.5 bg-[#F8F8F8] border border-[#E5E5E5] focus:border-[#008A45] rounded-xl outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- CARTE 3 : PRÉFÉRENCES & NOTIFICATIONS -->
            <div class="bg-white rounded-2xl p-5 border border-[#E5E5E5] shadow-xs space-y-4">
              <div class="flex items-center gap-2 border-b border-[#E5E5E5] pb-3">
                <i data-lucide="bell" class="w-4 h-4 text-[#008A45]"></i>
                <h2 class="text-xs font-black italic uppercase tracking-wider text-[#111111]">
                  3. Préférences & Notifications
                </h2>
              </div>

              <div class="space-y-3">
                <!-- WhatsApp Notifs -->
                <div class="flex items-center justify-between p-2.5 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5]">
                  <div class="flex items-center gap-2.5">
                    <span class="text-base">💬</span>
                    <div>
                      <span class="text-xs font-bold text-[#111111] block">Alertes WhatsApp</span>
                      <span class="text-[10px] text-gray-500 font-medium">Reçus de séquestre, commandes et livraisons</span>
                    </div>
                  </div>
                  <input id="set-notif-wa" type="checkbox" \${u.notifWhatsApp ? 'checked' : ''} class="w-4 h-4 text-[#008A45] rounded accent-[#008A45] cursor-pointer" />
                </div>

                <!-- SMS Notifs -->
                <div class="flex items-center justify-between p-2.5 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5]">
                  <div class="flex items-center gap-2.5">
                    <span class="text-base">📱</span>
                    <div>
                      <span class="text-xs font-bold text-[#111111] block">Alertes SMS & OTP</span>
                      <span class="text-[10px] text-gray-500 font-medium">Sécurité des connexions et retraits</span>
                    </div>
                  </div>
                  <input id="set-notif-sms" type="checkbox" \${u.notifSms ? 'checked' : ''} class="w-4 h-4 text-[#008A45] rounded accent-[#008A45] cursor-pointer" />
                </div>
              </div>
            </div>

            <!-- BOUTON PRINCIPAL D'ENREGISTREMENT VERT #008A45 -->
            <button
              type="submit"
              class="btn-action w-full py-4 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <i data-lucide="check" class="w-4 h-4"></i>
              <span>Enregistrer les modifications</span>
            </button>
          </form>

          <!-- ZONE DE GESTION DU COMPTE & DANGER -->
          <div class="bg-white rounded-2xl p-5 border border-[#E5E5E5] shadow-xs space-y-3">
            <h3 class="text-xs font-black italic uppercase tracking-wider text-gray-500">Actions du compte</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button onclick="window.handleLogout()" class="btn-action w-full py-3 bg-[#F8F8F8] hover:bg-gray-200 text-[#111111] text-xs font-bold rounded-xl border border-[#E5E5E5] flex items-center justify-center gap-2">
                <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                <span>Se déconnecter</span>
              </button>

              <button onclick="window.confirmDeleteAccount()" class="btn-action w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 flex items-center justify-center gap-2">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                <span>Supprimer mon compte</span>
              </button>
            </div>
          </div>

        </div>
      \`;
    }

    window.toggleSellerSection = function(isChecked) {
      const container = document.getElementById('seller-fields-container');
      if (container) {
        if (isChecked) {
          container.classList.remove('hidden');
        } else {
          container.classList.add('hidden');
        }
      }
    };

    window.handleSettingsAvatarChange = function(e) {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const img = document.getElementById('settings-avatar-img');
        if (img) img.src = url;
        if (window.store.currentUser) {
          window.store.currentUser.avatarUrl = url;
        }
        window.showToast('✓ Photo de profil mise à jour');
      }
    };

    window.saveProfileSettings = function(e) {
      e.preventDefault();
      
      const fullname = document.getElementById('set-fullname').value;
      const phone = document.getElementById('set-phone').value;
      const city = document.getElementById('set-city').value;
      const district = document.getElementById('set-district').value;
      const isSeller = document.getElementById('set-toggle-seller').checked;
      const businessName = document.getElementById('set-business-name') ? document.getElementById('set-business-name').value : '';
      const businessDesc = document.getElementById('set-business-desc') ? document.getElementById('set-business-desc').value : '';
      const payoutPhone = document.getElementById('set-payout-phone') ? document.getElementById('set-payout-phone').value : phone;
      const notifWa = document.getElementById('set-notif-wa').checked;
      const notifSms = document.getElementById('set-notif-sms').checked;

      const selectedPayoutGw = document.querySelector('input[name="set_payout_gw"]:checked')?.value || 'AIRTEL_MONEY';

      window.store.currentUser = {
        ...window.store.currentUser,
        fullName: fullname,
        phone: phone,
        city: city,
        district: district,
        isSellerEnabled: isSeller,
        businessName: businessName,
        businessDescription: businessDesc,
        payoutMethod: selectedPayoutGw,
        payoutPhone: payoutPhone,
        notifWhatsApp: notifWa,
        notifSms: notifSms
      };

      if (window.confetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      window.showToast('✅ Modifications du profil enregistrées !');
      window.render();
    };

    window.confirmDeleteAccount = function() {
      const confirmAction = confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ZARÉN ? Vos données et annonces seront effacées.");
      if (confirmAction) {
        window.store.currentUser = null;
        window.showToast('Compte supprimé avec succès');
        window.navigate('/');
      }
    };

    // 1. LE GRAND MARCHÉ
    function renderFeedGrid() {
      const filtered = getFilteredProducts();
      const c = getCurrentCountry();
      const catObj = CATEGORIES.find(cat => cat.id === window.store.selectedCategory) || CATEGORIES[0];

      return \`
        <div class="space-y-12">
          
          <!-- HERO SECTION IMMERSIVE ZARÉN -->
          <section class="py-8 md:py-14 overflow-hidden border-b border-[#E5E5E5]">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <!-- Texte Hero -->
              <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#008A45] text-xs font-black italic tracking-wide uppercase shadow-xs">
                  <i data-lucide="shield-check" class="w-4 h-4"></i> Zéro arnaque • 100 % Garanti par Séquestre
                </div>
                
                <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-tight leading-[1.12] text-[#111111]">
                  Le moyen <span class="text-[#008A45]">simple et sécurisé</span> de vendre en ligne, même sans boutique.
                </h1>
                
                <p class="text-base md:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                  Publiez votre article en 30 secondes, partagez le lien sur WhatsApp et réseaux sociaux. L'argent est sécurisé jusqu'à la livraison confirmée.
                </p>

                <!-- Formulaire Rapide Vendeur -->
                <div class="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                  <input
                    id="hero-phone-input"
                    type="tel"
                    placeholder="Votre numéro (ex: \${c.phonePrefix} 07 45 88 12)"
                    class="flex-1 px-4 py-3.5 bg-white rounded-xl border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#008A45] focus:border-transparent text-sm shadow-sm font-medium"
                  />
                  <button onclick="window.startSellingWithPhone()" class="btn-action px-6 py-3.5 bg-[#008A45] hover:bg-[#007339] text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md whitespace-nowrap cursor-pointer">
                    <span>Commencer à vendre</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                  </button>
                </div>

                <!-- Badges de réassurance -->
                <div class="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium flex-wrap">
                  <span class="flex items-center gap-1.5"><i data-lucide="check" class="w-4 h-4 text-[#008A45]"></i> Sans abonnement</span>
                  <span class="flex items-center gap-1.5"><i data-lucide="check" class="w-4 h-4 text-[#008A45]"></i> Protection séquestre</span>
                  <span class="flex items-center gap-1.5"><i data-lucide="check" class="w-4 h-4 text-[#008A45]"></i> Retrait Mobile Money immédiat</span>
                </div>
              </div>

              <!-- Preview Mockup Mobile Flottant -->
              <div class="lg:col-span-5 flex justify-center">
                <div class="w-full max-w-[340px] bg-white rounded-[2.5rem] p-4 shadow-2xl border border-[#E5E5E5] relative animate-float-phone">
                  <div class="w-28 h-3.5 bg-[#111827]/10 rounded-full mx-auto mb-3"></div>
                  
                  <div class="flex items-center justify-between pb-2.5 border-b border-gray-100 text-xs">
                    <div class="flex items-center gap-1.5">
                      <div class="w-6 h-6 rounded-md bg-[#111827] border border-gray-800 flex items-center justify-center p-0.5 shadow-xs">
                        <img src="${logoDataUrl}" alt="Z" class="w-full h-full object-contain" />
                      </div>
                      <span class="font-black italic text-xs tracking-tight text-[#111111]">ZARÉN</span>
                    </div>
                    <span class="text-gray-500 flex items-center gap-1 font-semibold text-[11px]">
                      <i data-lucide="map-pin" class="w-3 h-3 text-[#008A45]"></i> \${c.cities[1] || 'Libreville'}
                    </span>
                  </div>

                  <div onclick="window.navigate('/p/zrn-ip14')" class="mt-3 bg-[#F8F8F8] rounded-2xl p-3 border border-[#E5E5E5] cursor-pointer hover:border-[#008A45] transition-all">
                    <div class="aspect-square bg-gray-200 rounded-xl overflow-hidden relative mb-2.5">
                      <img src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80" alt="iPhone 14" class="w-full h-full object-cover" />
                      <div class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold">★ 4.9 (64)</div>
                      <div class="absolute top-2 left-2 bg-black/80 text-white px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1">
                        <span>▶</span> Vidéo HD
                      </div>
                    </div>
                    
                    <div class="flex justify-between items-start mb-1">
                      <h3 class="font-black italic text-sm text-[#111111] truncate pr-2">iPhone 14 Pro Max</h3>
                      <span class="font-black text-sm text-[#008A45] whitespace-nowrap">480 000 FCFA</span>
                    </div>
                    
                    <p class="text-[11px] text-gray-500 line-clamp-1 mb-2.5 font-medium">iStore • Vendeur vérifié</p>
                    
                    <button class="w-full py-2 bg-[#008A45] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm">
                      <i data-lucide="lock" class="w-3.5 h-3.5"></i> ACHETER EN SÉCURITÉ
                    </button>
                  </div>

                  <div class="mt-3 p-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                    <i data-lucide="shield" class="w-3.5 h-3.5 text-[#008A45] shrink-0"></i>
                    <p class="text-[9px] text-emerald-950 leading-tight font-medium">Fonds bloqués jusqu'à confirmation de conformité du colis.</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          <!-- BANNIÈRE SÉQUESTRE EN DIRECT DYNAMIQUE -->
          <div class="bg-emerald-50/80 border border-emerald-200/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-[#008A45] animate-ping"></span>
              <span class="font-black italic text-[#111111] uppercase tracking-wider">Séquestre en direct</span>
              <span class="text-gray-500 font-medium hidden sm:inline">• 0 Arnaque Garantie</span>
            </div>
            <div class="flex items-center gap-4 font-mono">
              <span class="text-[#008A45] font-black">🔒 14 850 000 FCFA sécurisés aujourd'hui</span>
              <span class="text-gray-600 font-bold hidden md:inline">⚡ Déblocage instantané Mobile Money</span>
            </div>
          </div>

          <!-- SECTION MARCHÉ DES ANNONCES DYNAMIQUE -->
          <section id="marche" class="space-y-6">
            
            <!-- Barre de Recherche Temps Réel & En-tête -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 class="text-2xl font-black italic text-[#111111]">
                  \${catObj.label}
                </h2>
                <p class="text-xs text-gray-500 font-medium mt-0.5">
                  \${filtered.length} annonce(s) vérifiée(s) avec photos, vidéos et séquestre garanti
                </p>
              </div>

              <!-- Barre de Recherche Instantanée -->
              <div class="relative flex-1 max-w-md">
                <input
                  id="live-search-input"
                  type="text"
                  value="\${window.store.searchQuery || ''}"
                  oninput="window.handleLiveSearch(this.value)"
                  placeholder="Rechercher par article, quartier, marque (ex: iPhone, Louis)..."
                  class="w-full text-xs font-semibold pl-4 pr-8 py-2.5 bg-white border border-[#E5E5E5] focus:border-[#008A45] rounded-full outline-hidden transition shadow-xs"
                />
                \${window.store.searchQuery ? \`
                  <button onclick="window.handleLiveSearch('')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold">
                    ✕
                  </button>
                \` : ''}
              </div>
            </div>

            <!-- Filtres de Villes & Tri -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-gray-100 py-3">
              <div class="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs">
                <span class="text-gray-500 uppercase text-[10px] font-bold shrink-0">Villes :</span>
                \${c.cities.map(cityName => \`
                  <button onclick="window.setCityFilter('\${cityName}')" class="btn-action px-3.5 py-1.5 rounded-full border whitespace-nowrap \${window.store.selectedCity === cityName ? 'bg-[#008A45] text-white border-[#008A45] font-bold shadow-xs' : 'bg-white text-[#111111] border-[#E5E5E5] hover:border-[#111111] font-medium'}">
                    \${cityName}
                  </button>
                \`).join('')}
              </div>

              <div class="flex items-center gap-2 shrink-0 text-xs">
                <span class="text-gray-400 font-medium">Tri :</span>
                <select onchange="window.setSortOrder(this.value)" class="text-xs font-semibold bg-white border border-[#E5E5E5] rounded-xl px-3 py-1.5 outline-hidden focus:border-[#008A45]">
                  <option value="recent" \${window.store.sortBy === 'recent' ? 'selected' : ''}>⚡ Plus récents</option>
                  <option value="price_asc" \${window.store.sortBy === 'price_asc' ? 'selected' : ''}>💰 Prix croissant</option>
                  <option value="price_desc" \${window.store.sortBy === 'price_desc' ? 'selected' : ''}>💎 Prix décroissant</option>
                  <option value="video" \${window.store.sortBy === 'video' ? 'selected' : ''}>🎥 Vidéo HD uniquement</option>
                </select>
              </div>
            </div>

            <!-- Grille des Produits Interactive -->
            \${filtered.length === 0 ? \`
              <div class="p-12 text-center bg-white rounded-3xl border border-[#E5E5E5] space-y-3">
                <div class="text-3xl">🔍</div>
                <h3 class="text-sm font-bold text-gray-800">Aucun article ne correspond à votre recherche</h3>
                <p class="text-xs text-gray-500">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
                <button onclick="window.resetFilters()" class="btn-action px-4 py-2 bg-[#008A45] text-white text-xs font-bold rounded-xl">
                  Réinitialiser
                </button>
              </div>
            \` : \`
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                \${filtered.map(p => \`
                  <div class="card-product group flex flex-col bg-white p-3 rounded-2xl border border-[#E5E5E5] hover:border-[#008A45] shadow-xs transition">
                    <div class="relative aspect-[3/4] bg-neutral-100 overflow-hidden rounded-xl mb-3">
                      <img src="\${p.images[0]}" alt="\${p.title}" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" />
                      
                      <button onclick="window.toggleSave('\${p.id}', event)" class="btn-action absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md hover:bg-white cursor-pointer">
                        <span class="text-xs">\${p.isSaved ? '❤️' : '🤍'}</span>
                      </button>

                      <div class="absolute top-2.5 left-2.5 bg-[#008A45] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md tracking-wider shadow-sm">
                        SÉQUESTRE
                      </div>

                      \${p.videoUrl ? \`
                        <button onclick="window.openVideoModal('\${p.videoUrl}', event)" class="btn-action absolute top-2.5 right-2.5 bg-black/80 hover:bg-black text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md cursor-pointer transition hover:scale-105">
                          <span>▶</span>
                          <span>Vidéo Démo</span>
                        </button>
                      \` : ''}

                      \${p.urgentBadge ? \`
                        <div class="absolute bottom-2.5 left-2.5 bg-[#d97706] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">
                          \${p.urgentBadge}
                        </div>
                      \` : ''}
                    </div>

                    <div class="flex items-baseline justify-between mb-1">
                      <span class="text-sm sm:text-base font-black text-[#111111]">\${formatPrice(p.price)}</span>
                      <span class="text-[10px] text-[#008A45] font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        ✓ Garanti
                      </span>
                    </div>

                    <h3 onclick="window.navigate('/p/\${p.shortCode}')" class="text-xs text-[#111111] font-black italic line-clamp-2 leading-snug mb-2 group-hover:text-[#008A45] cursor-pointer">
                      \${p.title}
                    </h3>

                    <!-- Bouton Achat Express Séquestre -->
                    <div class="space-y-2 mt-auto pt-2 border-t border-gray-100">
                      <div class="flex items-center justify-between text-[10px] text-gray-500">
                        <span class="truncate font-medium">📍 \${p.city} (\${p.district || 'Centre'})</span>
                        <span class="code-tracking text-[#008A45] text-[10px]">\${p.shortCode}</span>
                      </div>

                      <button onclick="window.openQuickBuyModal('\${p.id}', event)" class="btn-action w-full py-2 bg-emerald-50 hover:bg-[#008A45] text-[#008A45] hover:text-white border border-emerald-200 text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer">
                        <i data-lucide="zap" class="w-3 h-3"></i>
                        <span>Achat Express Séquestre</span>
                      </button>
                    </div>

                  </div>
                \`).join('')}
              </div>
            \`}
          </section>

          <!-- MODALE VIDÉO POPUP -->
          \${window.store.activeVideoUrl ? \`
            <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onclick="window.closeVideoModal(event)">
              <div class="relative w-full max-w-2xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-800" onclick="event.stopPropagation()">
                <button onclick="window.closeVideoModal()" class="btn-action absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition">
                  ✕
                </button>
                <video src="\${window.store.activeVideoUrl}" controls autoplay playsinline class="w-full aspect-video object-contain"></video>
              </div>
            </div>
          \` : ''}

          <!-- MODALE ACHAT EXPRESS MOBILE MONEY -->
          \${window.store.quickBuyProduct ? \`
            <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in" onclick="window.closeQuickBuyModal(event)">
              <div class="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#E5E5E5] space-y-4 animate-slide-up" onclick="event.stopPropagation()">
                <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-xl bg-emerald-100 text-[#008A45] flex items-center justify-center">
                      <i data-lucide="shield-check" class="w-4 h-4"></i>
                    </div>
                    <div>
                      <h3 class="font-black italic text-sm text-[#111111]">Achat Sécurisé ZARÉN</h3>
                      <span class="text-[10px] text-gray-500 font-medium">Séquestre automatique Mobile Money</span>
                    </div>
                  </div>
                  <button onclick="window.closeQuickBuyModal()" class="btn-action w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                    ✕
                  </button>
                </div>

                <div class="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5]">
                  <img src="\${window.store.quickBuyProduct.images[0]}" class="w-12 h-12 rounded-xl object-cover border border-[#E5E5E5]" />
                  <div class="flex-1 min-w-0">
                    <h4 class="text-xs font-bold text-[#111111] truncate">\${window.store.quickBuyProduct.title}</h4>
                    <div class="flex items-center justify-between mt-0.5">
                      <span class="text-xs font-black text-[#008A45]">\${formatPrice(window.store.quickBuyProduct.price)}</span>
                      <span class="text-[10px] text-gray-500">📍 \${window.store.quickBuyProduct.city}</span>
                    </div>
                  </div>
                </div>

                <form onsubmit="window.handleQuickBuyPayment(event)" class="space-y-3">
                  <div>
                    <label class="block text-[11px] font-bold text-gray-700 mb-1.5">Moyen de paiement Mobile Money</label>
                    <div class="grid grid-cols-2 gap-2 text-xs font-bold">
                      \${['Airtel Money', 'Moov Money', 'MTN Money', 'Orange Money'].map(op => \`
                        <button type="button" onclick="window.store.quickBuyOperator = '\${op}'; window.render();" class="btn-action p-2.5 rounded-xl border text-center transition \${(window.store.quickBuyOperator || 'Airtel Money') === op ? 'border-[#008A45] bg-emerald-50 text-[#008A45]' : 'border-[#E5E5E5] bg-white text-gray-700'}">
                          \${op}
                        </button>
                      \`).join('')}
                    </div>
                  </div>

                  <div>
                    <label class="block text-[11px] font-bold text-gray-700 mb-1">Numéro Mobile Money pour validation push</label>
                    <input id="quick-buy-phone" type="tel" required value="\${window.store.quickBuyPhone || '+241 07 45 88 12'}" class="w-full text-xs font-mono font-bold px-3 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] outline-hidden focus:border-[#008A45]" />
                  </div>

                  <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 leading-relaxed font-medium">
                    🔒 <strong>Garantie Séquestre :</strong> L'argent reste consigné sur Zarén. Le vendeur n'est payé qu'après votre confirmation de livraison.
                  </div>

                  <button type="submit" class="btn-action w-full py-3.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                    <i data-lucide="lock" class="w-3.5 h-3.5"></i>
                    <span>Bloquer & Payer \${formatPrice(window.store.quickBuyProduct.price)}</span>
                  </button>
                </form>
              </div>
            </div>
          \` : ''}

        </div>
      \`;
    }

    window.startSellingWithPhone = function() {
      const input = document.getElementById('hero-phone-input');
      const phone = input ? input.value : '';
      if (phone) {
        window.navigate('/auth/verify?phone=' + encodeURIComponent(phone));
      } else {
        window.navigate('/seller/new');
      }
    };

    window.setCityFilter = function(cityName) {
      window.store.selectedCity = cityName;
      window.render();
    };

    window.handleLiveSearch = function(val) {
      window.store.searchQuery = val;
      window.render();
      const input = document.getElementById('live-search-input');
      if (input) {
        input.focus();
        input.setSelectionRange(val.length, val.length);
      }
    };

    window.setSortOrder = function(val) {
      window.store.sortBy = val;
      window.render();
    };

    window.resetFilters = function() {
      window.store.searchQuery = '';
      window.store.selectedCity = null;
      window.store.selectedCategory = 'TOUT';
      window.store.sortBy = 'recent';
      window.render();
    };

    window.openVideoModal = function(url, e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      window.store.activeVideoUrl = url;
      window.render();
    };

    window.closeVideoModal = function(e) {
      if (e) e.stopPropagation();
      window.store.activeVideoUrl = null;
      window.render();
    };

    window.openQuickBuyModal = function(prodId, e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      const p = window.store.products.find(item => item.id === prodId) || window.store.products[0];
      window.store.quickBuyProduct = p;
      window.store.quickBuyOperator = 'Airtel Money';
      window.render();
    };

    window.closeQuickBuyModal = function(e) {
      if (e) e.stopPropagation();
      window.store.quickBuyProduct = null;
      window.render();
    };

    window.handleQuickBuyPayment = function(e) {
      e.preventDefault();
      const p = window.store.quickBuyProduct;
      if (!p) return;
      const phoneInput = document.getElementById('quick-buy-phone');
      const phone = phoneInput ? phoneInput.value : '+241 07 45 88 12';
      
      const newOrder = {
        id: 'ord_' + Date.now(),
        orderNumber: 'ZRN-' + Math.floor(1000 + Math.random() * 9000),
        productId: p.id,
        title: p.title,
        price: p.price,
        deliveryFee: 2000,
        totalAmount: p.price + 2000,
        status: 'PAID',
        paymentMethod: window.store.quickBuyOperator || 'Airtel Money',
        buyerPhone: phone,
        city: p.city,
        district: p.district || 'Centre',
        countryCode: 'GA',
        createdAt: new Date().toISOString()
      };

      window.store.orders.unshift(newOrder);
      window.store.quickBuyProduct = null;
      if (window.confetti) confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      window.showToast('🎉 Paiement Mobile Money validé & Fonds séquestrés !');
      window.navigate('/orders/' + newOrder.id);
    };

    // 2. COMMENT ÇA MARCHE ?
    function renderConceptLanding() {
      return \`
        <div class="space-y-16 py-6 animate-fade-in">
          <div class="text-center max-w-2xl mx-auto space-y-3">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#008A45] text-xs font-black italic tracking-wide uppercase border border-emerald-200 shadow-xs">
              <i data-lucide="sparkles" class="w-4 h-4"></i> Simplicité & Sécurité
            </div>
            <h1 class="text-3xl sm:text-5xl font-black italic text-[#111111] tracking-tight">Comment fonctionne ZARÉN ?</h1>
            <p class="text-gray-600 text-sm sm:text-base font-medium">La méthode la plus rapide d'Afrique Centrale pour vendre et acheter en toute confiance.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="card-step-hover bg-white rounded-3xl border border-[#E5E5E5] overflow-hidden flex flex-col shadow-xs">
              <div class="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1556742049-0a67e55722c0?auto=format&fit=crop&w=700&q=80" alt="Publier" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div class="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#008A45] text-white font-black italic flex items-center justify-center text-xs shadow-md">1</div>
              </div>
              <div class="p-5 flex-1 flex flex-col">
                <h3 class="font-black italic text-base mb-1.5 text-[#111111]">1. Publier l'article</h3>
                <p class="text-xs text-gray-500 leading-relaxed font-medium">Ajoutez photos HD et vidéo de démo en 30s.</p>
              </div>
            </div>

            <div class="card-step-hover bg-white rounded-3xl border border-[#E5E5E5] overflow-hidden flex flex-col shadow-xs">
              <div class="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=700&q=80" alt="Partager" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div class="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#008A45] text-white font-black italic flex items-center justify-center text-xs shadow-md">2</div>
              </div>
              <div class="p-5 flex-1 flex flex-col">
                <h3 class="font-black italic text-base mb-1.5 text-[#111111]">2. Partager le lien</h3>
                <p class="text-xs text-gray-500 leading-relaxed font-medium">Diffusez le lien direct sur WhatsApp, TikTok et Facebook.</p>
              </div>
            </div>

            <div class="card-step-hover bg-white rounded-3xl border border-[#E5E5E5] overflow-hidden flex flex-col shadow-xs">
              <div class="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=700&q=80" alt="Séquestre" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div class="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#008A45] text-white font-black italic flex items-center justify-center text-xs shadow-md">3</div>
              </div>
              <div class="p-5 flex-1 flex flex-col">
                <h3 class="font-black italic text-base mb-1.5 text-[#111111]">3. Paiement Séquestré</h3>
                <p class="text-xs text-gray-500 leading-relaxed font-medium">Paiement Mobile Money consigné et sécurisé.</p>
              </div>
            </div>

            <div class="card-step-hover bg-white rounded-3xl border border-[#E5E5E5] overflow-hidden flex flex-col shadow-xs">
              <div class="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80" alt="Livraison" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div class="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#008A45] text-white font-black italic flex items-center justify-center text-xs shadow-md">4</div>
              </div>
              <div class="p-5 flex-1 flex flex-col">
                <h3 class="font-black italic text-base mb-1.5 text-[#111111]">4. Livraison & Payout</h3>
                <p class="text-xs text-gray-500 leading-relaxed font-medium">L'acheteur valide, le vendeur encaisse instantanément.</p>
              </div>
            </div>
          </div>
        </div>
      \`;
    }

    // 3. SÉCURITÉ ESCROW
    function renderSecurityEscrowPage() {
      return \`
        <div class="max-w-4xl mx-auto space-y-8 py-4 animate-fade-in">
          <div class="bg-[#111827] text-white p-8 sm:p-12 rounded-3xl space-y-4 shadow-xl">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#008A45] text-xs font-black italic uppercase">
              <i data-lucide="shield-check" class="w-4 h-4"></i> Garantie Totale Tiers de Confiance
            </div>
            <h1 class="text-3xl sm:text-4xl font-black italic">La Sécurité Séquestre (Escrow) expliquée</h1>
            <p class="text-sm text-gray-300 max-w-xl leading-relaxed font-medium">
              ZARÉN protège à 100% les acheteurs et les vendeurs contre les fraudes lors des transactions Mobile Money.
            </p>
          </div>
        </div>
      \`;
    }

    // 3.5 TARIFS & PASS PRO HYBRIDE
    function renderPricingSection() {
      return \`
        <section id="tarifs" class="relative w-full bg-[#0E0E0E] text-[#F3F3F3] py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans rounded-3xl animate-fade-in border border-neutral-800">
          <div class="relative max-w-5xl mx-auto">
            
            <div class="flex flex-col items-center text-center space-y-4 mb-14">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-widest text-[#8A8A8A] uppercase">
                <span class="w-1.5 h-1.5 rounded-full bg-[#008A45] animate-pulse"></span>
                Structure Tarifaire Hybride
              </div>

              <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-xl">
                Vendez sans friction. Évoluez à votre rythme.
              </h2>

              <p class="text-sm sm:text-base text-[#8A8A8A] max-w-md font-normal leading-relaxed">
                Choisissez entre la liberté du paiement à l’acte ou la puissance de l’illimité avec le pass Pro.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              
              <!-- Option 1 : 500 FCFA -->
              <div class="relative rounded-2xl p-8 bg-[#121212] border border-white/10 hover:border-[#008A45] transition-all flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start mb-6">
                    <div>
                      <h3 class="text-base font-bold text-white tracking-wide">Paiement à l'acte</h3>
                      <p class="text-xs text-[#8A8A8A] mt-0.5">Pour vendeurs occasionnels</p>
                    </div>
                    <div class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02]">
                      <i data-lucide="zap" class="w-4 h-4 text-[#8A8A8A]"></i>
                    </div>
                  </div>

                  <div class="mb-8 font-mono">
                    <div class="flex items-baseline gap-1">
                      <span class="text-4xl font-black text-white">500</span>
                      <span class="text-sm font-semibold text-[#8A8A8A]">FCFA</span>
                    </div>
                    <span class="text-[11px] text-[#606060] uppercase tracking-wider block mt-1">
                      par produit publié • sans engagement
                    </span>
                  </div>

                  <div class="space-y-3.5 pt-4 border-t border-white/[0.06]">
                    <div class="flex items-start gap-3">
                      <div class="w-4 h-4 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="check" class="w-2.5 h-2.5 text-white"></i>
                      </div>
                      <span class="text-xs text-[#B0B0B0] font-medium">Paiement à l'acte : 500 FCFA par produit publié</span>
                    </div>
                    <div class="flex items-start gap-3">
                      <div class="w-4 h-4 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="check" class="w-2.5 h-2.5 text-white"></i>
                      </div>
                      <span class="text-xs text-[#B0B0B0] font-medium">Lien de paiement séquestre (Escrow) sécurisé</span>
                    </div>
                    <div class="flex items-start gap-3">
                      <div class="w-4 h-4 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="check" class="w-2.5 h-2.5 text-white"></i>
                      </div>
                      <span class="text-xs text-[#B0B0B0] font-medium">Partage direct (WhatsApp, Instagram, Telegram)</span>
                    </div>
                    <div class="flex items-start gap-3">
                      <div class="w-4 h-4 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="check" class="w-2.5 h-2.5 text-white"></i>
                      </div>
                      <span class="text-xs text-[#B0B0B0] font-medium">Badge de confiance acheteur standard</span>
                    </div>
                    <div class="flex items-start gap-3">
                      <div class="w-4 h-4 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="check" class="w-2.5 h-2.5 text-white"></i>
                      </div>
                      <span class="text-xs text-[#B0B0B0] font-medium">Support sous 48h en cas de litige</span>
                    </div>
                  </div>
                </div>

                <div class="mt-8 pt-6">
                  <button onclick="window.navigate('/seller/new')" class="btn-action w-full py-3.5 px-4 rounded-xl text-xs font-bold font-mono tracking-wider border border-white/20 hover:bg-white/5 text-white flex items-center justify-center gap-2">
                    PUBLIER UN PRODUIT (500 FCFA)
                  </button>
                </div>
              </div>

              <!-- Option 2 : 4500 FCFA / mois -->
              <div class="relative rounded-2xl p-8 bg-[#161616] border border-[#008A45] shadow-[0_0_40px_rgba(0,138,69,0.2)] flex flex-col justify-between">
                <div class="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#008A45] text-[10px] font-bold tracking-widest uppercase text-white font-mono shadow-md">
                  Recommandé Commerçants
                </div>

                <div>
                  <div class="flex justify-between items-start mb-6">
                    <div>
                      <h3 class="text-base font-bold text-white tracking-wide flex items-center gap-1.5">
                        Abonnement Pro <i data-lucide="sparkles" class="w-3.5 h-3.5 text-[#008A45]"></i>
                      </h3>
                      <p class="text-xs text-[#8A8A8A] mt-0.5">Pour commerçants et boutiques actives</p>
                    </div>
                    <div class="w-8 h-8 rounded-full border border-[#008A45]/30 flex items-center justify-center bg-[#008A45]/10">
                      <i data-lucide="shield-check" class="w-4 h-4 text-[#008A45]"></i>
                    </div>
                  </div>

                  <div class="mb-8 font-mono">
                    <div class="flex items-baseline gap-1">
                      <span class="text-4xl font-black text-white">4 500</span>
                      <span class="text-sm font-semibold text-[#008A45]">FCFA</span>
                      <span class="text-xs text-[#8A8A8A] font-normal">/ mois</span>
                    </div>
                    <span class="text-[11px] text-[#008A45] uppercase tracking-wider block mt-1 font-semibold">
                      Rentable dès 10 publications / mois
                    </span>
                  </div>

                  <div class="space-y-3.5 pt-4 border-t border-white/[0.06]">
                    <div class="flex items-start gap-3">
                      <div class="w-4 h-4 rounded-full bg-[#008A45]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="check" class="w-2.5 h-2.5 text-[#008A45]"></i>
                      </div>
                      <span class="text-xs leading-tight text-white font-semibold">Publications de produits illimitées</span>
                    </div>
                    <div class="flex items-start gap-3">
                      <div class="w-4 h-4 rounded-full bg-[#008A45]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="check" class="w-2.5 h-2.5 text-[#008A45]"></i>
                      </div>
                      <span class="text-xs leading-tight text-white font-semibold">Génération de descriptions IA optimisées (illimitée)</span>
                    </div>
                    <div class="flex items-start gap-3">
                      <div class="w-4 h-4 rounded-full bg-[#008A45]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="check" class="w-2.5 h-2.5 text-[#008A45]"></i>
                      </div>
                      <span class="text-xs leading-tight text-white font-semibold">Badge officiel « Vendeur Vérifié ZARÉN »</span>
                    </div>
                    <div class="flex items-start gap-3">
                      <div class="w-4 h-4 rounded-full bg-[#008A45]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="check" class="w-2.5 h-2.5 text-[#008A45]"></i>
                      </div>
                      <span class="text-xs leading-tight text-white font-semibold">Priorité absolue sur le déblocage des fonds</span>
                    </div>
                    <div class="flex items-start gap-3">
                      <div class="w-4 h-4 rounded-full bg-[#008A45]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="check" class="w-2.5 h-2.5 text-[#008A45]"></i>
                      </div>
                      <span class="text-xs leading-tight text-[#B0B0B0]">Arbitrage prioritaire & support dédié 24/7</span>
                    </div>
                  </div>
                </div>

                <div class="mt-8 pt-6">
                  <button onclick="window.navigate('/seller/new')" class="btn-action w-full py-3.5 px-4 rounded-xl text-xs font-bold font-mono tracking-wider bg-[#008A45] hover:bg-[#007339] text-white flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,138,69,0.39)]">
                    <span>ACTIVER LE PASS PRO (4 500 FCFA)</span>
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>

            </div>

            <div class="mt-12 text-center">
              <p class="text-xs font-mono text-[#606060]">
                🔒 Tous les paiements et abonnements sont gérés via Mobile Money & Séquestre ZARÉN. Aucun prélèvement surprise.
              </p>
            </div>

          </div>
        </section>
      \`;
    }


    // 4. CARTE DES BOUTIQUES LEAFLET / OSM / SATELLITE
    function renderMapInteractiveView() {
      const userLoc = window.store.userCoordinates;
      const shops = window.store.shops.map(shop => {
        let dist = null;
        if (userLoc) {
          dist = computeHaversineKm(userLoc.lat, userLoc.lng, shop.latitude, shop.longitude);
        }
        return { ...shop, distanceKm: dist };
      });

      const activeShop = shops.find(s => s.id === window.store.selectedShopId) || shops[0];

      setTimeout(() => {
        window.initServerMap(shops, activeShop);
      }, 50);

      return \`
        <div class="space-y-4 animate-fade-in">
          <div class="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-[#008A45] flex items-center justify-center">
                <i data-lucide="map-pin" class="w-5 h-5"></i>
              </div>
              <div>
                <h1 class="text-sm font-black italic uppercase text-[#111111]">Carte des Boutiques & Points de Retrait</h1>
                <span class="text-xs text-gray-500 font-medium">\${shops.length} commerces répertoriés en Afrique Centrale</span>
              </div>
            </div>

            <div class="flex items-center gap-2 overflow-x-auto">
              <button onclick="window.toggleServerMapLayer()" id="btn-toggle-satellite" class="btn-action px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#111111] text-xs font-bold uppercase rounded-xl border border-[#E5E5E5] flex items-center gap-1.5 shrink-0">
                <i data-lucide="layers" class="w-3.5 h-3.5 text-[#008A45]"></i>
                <span id="map-layer-label">Vue Satellite HD</span>
              </button>

              <button onclick="window.requestUserGeolocation()" class="btn-action px-3.5 py-2 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase rounded-xl shadow-xs flex items-center gap-1.5 shrink-0">
                <i data-lucide="navigation" class="w-4 h-4"></i>
                <span>\${userLoc ? 'Autour de moi ✓' : 'Me géolocaliser'}</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[620px]">
            <!-- Liste des Boutiques -->
            <div class="lg:col-span-5 bg-white rounded-2xl border border-[#E5E5E5] shadow-xs flex flex-col overflow-hidden">
              <div class="p-3.5 bg-[#F8F8F8] border-b border-[#E5E5E5] text-xs font-black italic uppercase tracking-wider text-[#111111] flex items-center justify-between">
                <span>Commerces Vérifiés</span>
                <span class="text-[10px] text-gray-500 font-bold">\${shops.length} résultats</span>
              </div>

              <div class="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                \${shops.map(shop => \`
                  <div onclick="window.selectShopMarker('\${shop.id}')" class="btn-action p-3 rounded-xl border transition-all flex gap-3 cursor-pointer \${activeShop?.id === shop.id ? 'border-[#008A45] bg-emerald-50/50 shadow-md ring-2 ring-emerald-200' : 'border-[#E5E5E5] bg-white hover:border-gray-400'}">
                    <img src="\${shop.photo}" class="w-16 h-16 rounded-xl object-cover border border-[#E5E5E5] shrink-0" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <h4 class="text-xs font-black italic text-[#111111] truncate">\${shop.name}</h4>
                        <span class="text-[9px] font-black text-[#008A45] bg-emerald-100 px-1.5 py-0.5 rounded">✓ Vérifié</span>
                      </div>
                      <span class="text-[10px] text-gray-500 font-medium block truncate mt-0.5">\${shop.category} • \${shop.district || shop.city}</span>
                      <div class="flex items-center justify-between mt-2 pt-1 border-t border-gray-100 text-[11px]">
                        <span class="text-[#d97706] font-bold">★ \${shop.rating}</span>
                        \${shop.distanceKm ? \`<span class="text-[#008A45] font-bold">📍 à \${shop.distanceKm} km</span>\` : \`<span class="text-gray-400">📍 \${shop.city}</span>\`}
                      </div>
                    </div>
                  </div>
                \`).join('')}
              </div>
            </div>

            <!-- Conteneur Carte Leaflet -->
            <div class="lg:col-span-7 bg-neutral-100 rounded-2xl border border-[#E5E5E5] overflow-hidden relative shadow-inner">
              <div id="server-leaflet-map" class="w-full h-full z-10"></div>
            </div>
          </div>
        </div>
      \`;
    }

    let serverMapInstance = null;
    let serverStreetsLayer = null;
    let serverSatelliteLayer = null;
    let serverCurrentLayer = 'STREETS';

    window.initServerMap = function(shops, activeShop) {
      const mapEl = document.getElementById('server-leaflet-map');
      if (!mapEl) return;

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const ensureL = () => {
        if ((window).L) {
          setupLMap();
        } else {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => setupLMap();
          document.head.appendChild(script);
        }
      };

      const setupLMap = () => {
        const L = (window).L;
        if (!L) return;

        if (serverMapInstance) {
          serverMapInstance.remove();
          serverMapInstance = null;
        }

        const centerLat = activeShop ? activeShop.latitude : 0.4162;
        const centerLng = activeShop ? activeShop.longitude : 9.4673;

        serverMapInstance = L.map(mapEl, {
          center: [centerLat, centerLng],
          zoom: 13,
          zoomControl: true
        });

        serverStreetsLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '© CartoDB / OpenStreetMap',
          maxZoom: 19
        });

        serverSatelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri World Imagery',
          maxZoom: 19
        });

        if (serverCurrentLayer === 'STREETS') {
          serverStreetsLayer.addTo(serverMapInstance);
        } else {
          serverSatelliteLayer.addTo(serverMapInstance);
        }

        shops.forEach(shop => {
          const isSelected = activeShop?.id === shop.id;
          const markerHtml = \`
            <div style="cursor:pointer; display:flex; flex-direction:column; align-items:center;">
              <div style="background:\${isSelected ? '#008A45' : '#111827'}; color:#ffffff; padding:4px 8px; border-radius:10px; font-weight:800; font-size:10px; font-style:italic; display:flex; align-items:center; gap:4px; box-shadow:0 4px 10px rgba(0,0,0,0.3); border:2px solid \${isSelected ? '#ffffff' : '#008A45'}; white-space:nowrap;">
                <span>🏪</span>
                <span style="max-width:110px; overflow:hidden; text-overflow:ellipsis;">\${shop.name}</span>
              </div>
              <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:7px solid \${isSelected ? '#008A45' : '#111827'};"></div>
            </div>
          \`;

          const customIcon = L.divIcon({
            className: 'custom-shop-marker',
            html: markerHtml,
            iconSize: [120, 36],
            iconAnchor: [60, 34]
          });

          const marker = L.marker([shop.latitude, shop.longitude], { icon: customIcon });
          marker.on('click', () => {
            window.selectShopMarker(shop.id);
          });
          marker.addTo(serverMapInstance);
        });
      };

      ensureL();
    };

    window.toggleServerMapLayer = function() {
      if (!serverMapInstance || !serverStreetsLayer || !serverSatelliteLayer) return;
      const label = document.getElementById('map-layer-label');
      if (serverCurrentLayer === 'STREETS') {
        serverMapInstance.removeLayer(serverStreetsLayer);
        serverSatelliteLayer.addTo(serverMapInstance);
        serverCurrentLayer = 'SATELLITE';
        if (label) label.innerText = 'Vue Plan Rues';
      } else {
        serverMapInstance.removeLayer(serverSatelliteLayer);
        serverStreetsLayer.addTo(serverMapInstance);
        serverCurrentLayer = 'STREETS';
        if (label) label.innerText = 'Vue Satellite HD';
      }
    };

    window.selectShopMarker = function(shopId) {
      window.store.selectedShopId = shopId;
      window.render();
    };

    window.requestUserGeolocation = function() {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          window.store.userCoordinates = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          window.showToast('📍 Géolocalisé avec succès !');
          window.render();
        },
        () => {
          window.store.userCoordinates = { lat: 0.4162, lng: 9.4673 };
          window.showToast('📍 Centré sur Libreville');
          window.render();
        }
      );
    };

    // 5. FICHE PRODUIT
    function renderProductDetail(code) {
      const p = window.store.products.find(item => item.shortCode === code) || window.store.products[0];
      const activeMediaIdx = window.store.activeProductMediaIdx || 0;
      
      const allMedia = [];
      p.images.forEach((img, i) => allMedia.push({ type: 'IMAGE', url: img, id: 'img_' + i }));
      if (p.videoUrl) {
        allMedia.push({ type: 'VIDEO', url: p.videoUrl, id: 'vid_1' });
      }

      const activeItem = allMedia[activeMediaIdx] || allMedia[0];

      return \`
        <div class="bg-white rounded-3xl border border-[#E5E5E5] overflow-hidden shadow-xs animate-fade-in">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-10">
            <div class="lg:col-span-7 space-y-3">
              <div class="relative aspect-[3/4] max-h-[550px] w-full bg-[#111827] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                \${activeItem.type === 'VIDEO' ? \`
                  <video src="\${activeItem.url}" controls playsinline autoplay class="w-full h-full object-contain bg-black"></video>
                \` : \`
                  <img src="\${activeItem.url}" class="w-full h-full object-cover object-center" />
                \`}

                <div class="absolute top-4 left-4 bg-[#111827]/80 text-white text-[10px] font-black italic uppercase px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                  \${activeItem.type === 'VIDEO' ? '🎥 Vidéo Démo' : '📷 Photo HD'}
                </div>

                <button onclick="window.toggleSave('\${p.id}')" class="btn-action absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <span class="text-base">\${p.isSaved ? '❤️' : '🤍'}</span>
                </button>
              </div>
            </div>

            <div class="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div class="space-y-4">
                <div>
                  <span class="text-xs font-bold uppercase text-gray-500 block mb-1">\${p.seller} • \${p.city}</span>
                  <h1 class="text-xl font-black italic text-[#111111] leading-snug">\${p.title}</h1>
                  <div class="flex items-baseline gap-3 mt-3">
                    <span class="text-3xl font-black text-[#008A45]">\${formatPrice(p.price)}</span>
                  </div>
                </div>

                <div class="p-4 bg-[#F8F8F8] rounded-2xl border border-[#E5E5E5] text-xs text-[#111111] leading-relaxed font-medium">
                  \${p.description || 'Article vérifié par Zarén.'}
                </div>
              </div>

              <div class="pt-4 space-y-2">
                <button onclick="window.navigate('/checkout/\${p.id}')" class="btn-action w-full py-4 bg-[#008A45] hover:bg-[#007339] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-between px-6">
                  <span>Acheter en sécurité</span>
                  <span>\${formatPrice(p.price)} →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      \`;
    }

    // 6. TUNNEL DE PAIEMENT
    function renderCheckout(prodId) {
      const p = window.store.products.find(item => item.id === prodId) || window.store.products[0];
      const c = getCurrentCountry();
      const deliveryFee = 2000;
      const total = p.price + deliveryFee;

      return \`
        <div class="max-w-2xl mx-auto bg-white rounded-3xl border border-[#E5E5E5] p-6 md:p-8 shadow-md space-y-6 animate-fade-in">
          <h1 class="text-lg font-black italic uppercase text-[#111111] pb-3 border-b border-[#E5E5E5]">Paiement Séquestré</h1>
          <div class="space-y-3">
            <div class="flex items-center justify-between text-xs py-2 border-b border-gray-100">
              <span class="text-gray-500 font-medium">Article</span>
              <span class="font-bold text-[#111111]">\${p.title}</span>
            </div>
            <div class="flex items-center justify-between text-sm font-black pt-2">
              <span>Total Séquestré</span>
              <span class="text-lg text-[#008A45]">\${formatPrice(total)}</span>
            </div>
          </div>
          <button onclick="window.handlePay('\${p.id}')" class="btn-action w-full py-4 bg-[#008A45] hover:bg-[#007339] text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg">
            Payer \${formatPrice(total)} (Séquestre)
          </button>
        </div>
      \`;
    }

    window.handlePay = function(prodId) {
      const p = window.store.products.find(item => item.id === prodId) || window.store.products[0];
      const newOrder = {
        id: 'ord_' + Date.now(),
        orderNumber: 'ZRN-' + Math.floor(1000 + Math.random() * 9000),
        productId: p.id,
        title: p.title,
        price: p.price,
        deliveryFee: 2000,
        totalAmount: p.price + 2000,
        status: 'DELIVERED',
        paymentMethod: 'Airtel Money',
        city: p.city,
        district: p.district || 'Louis',
        countryCode: 'GA',
        createdAt: new Date().toISOString()
      };

      window.store.orders.unshift(newOrder);
      if (window.confetti) confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
      window.showToast('🎉 Paiement Mobile Money validé & Fonds séquestrés');
      window.navigate('/orders/' + newOrder.id);
    };

    // 7. SUIVI DE COMMANDE AVEC ARBITRAGE SUPPORTRESOLVER
    function renderOrderTracking(ordId) {
      const order = window.store.orders.find(o => o.id === ordId) || window.store.orders[0];
      const p = window.store.products.find(item => item.id === order.productId) || window.store.products[0];

      return \`
        <div class="max-w-2xl mx-auto bg-white rounded-3xl border border-[#E5E5E5] p-6 md:p-8 shadow-md space-y-6 animate-fade-in">
          
          <!-- En-tête Séquestre & Statut -->
          <div class="p-6 bg-[#111827] text-white rounded-2xl space-y-2 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black italic uppercase tracking-widest text-[#008A45] flex items-center gap-1.5">
                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> SÉQUESTRE ZARÉN ACTIF • \${formatPrice(order.totalAmount)} SÉCURISÉS
              </span>
              <span class="px-2 py-0.5 rounded-full text-[9px] font-black italic bg-white/10 text-emerald-300">
                \${order.status}
              </span>
            </div>

            <h1 class="text-lg md:text-xl font-black italic uppercase">
              \${order.status === 'COMPLETED' ? 'Transaction Clôturée • Fonds Débloqués' : order.status === 'DISPUTED' ? '⚠️ Litige Ouvert • Arbitrage SupportResolver' : 'Commande ' + order.orderNumber + ' en Cours'}
            </h1>
            <p class="text-xs text-gray-300 font-medium">
              \${order.title} — Destination : \${order.city} (\${order.district})
            </p>
          </div>

          <!-- Timeline du cycle de commande -->
          <div class="p-4 bg-[#F8F8F8] rounded-2xl border border-[#E5E5E5] space-y-3">
            <h3 class="text-xs font-black italic uppercase tracking-wider text-[#111111] flex items-center justify-between">
              <span>Cycle de Séquestre & Livraison</span>
              <span class="text-[10px] text-gray-500 font-medium">Temps réel</span>
            </h3>

            <div class="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
              <div class="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#008A45]">
                <div class="font-black mb-0.5">1. PAYÉ</div>
                <span class="text-[8px] text-gray-500 font-normal">Séquestré</span>
              </div>
              <div class="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#008A45]">
                <div class="font-black mb-0.5">2. EXPÉDIÉ</div>
                <span class="text-[8px] text-gray-500 font-normal">Preuve remise</span>
              </div>
              <div class="p-2 rounded-xl \${order.status === 'DELIVERED' || order.status === 'COMPLETED' ? 'bg-emerald-50 border border-emerald-200 text-[#008A45]' : 'bg-gray-100 border border-gray-200 text-gray-400'}">
                <div class="font-black mb-0.5">3. LIVRÉ</div>
                <span class="text-[8px] text-gray-500 font-normal">Inspection</span>
              </div>
              <div class="p-2 rounded-xl \${order.status === 'COMPLETED' ? 'bg-emerald-50 border border-emerald-200 text-[#008A45]' : 'bg-gray-100 border border-gray-200 text-gray-400'}">
                <div class="font-black mb-0.5">4. DÉBLOQUÉ</div>
                <span class="text-[8px] text-gray-500 font-normal">Payout vendeur</span>
              </div>
            </div>
          </div>

          <!-- Notification Logistique SellerCoach & SupportResolver -->
          <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <div class="flex items-center gap-2 text-[#008A45] font-black italic text-xs uppercase">
              <i data-lucide="bot" class="w-4 h-4"></i>
              <span>Copilote SellerCoach & SupportResolver</span>
            </div>
            <p class="text-xs text-emerald-950 font-medium leading-relaxed">
              \${order.status === 'COMPLETED' 
                ? '✅ Les fonds ont été transférés instantanément sur le compte Mobile Money du vendeur. Aucun frais supplémentaire prélevé.' 
                : order.status === 'DISPUTED'
                ? '⚖️ SupportResolver a gelé les fonds. La conformité des photos et la preuve de remise sont en cours d\\'audit.'
                : '📦 Vendeur : Conservez la photo du reçu de livraison ou la signature pour garantir votre déblocage automatique sous séquestre.'}
            </p>
          </div>

          <!-- Actions de validation ou litige -->
          \${order.status !== 'COMPLETED' && order.status !== 'DISPUTED' ? \`
            <div class="space-y-3 pt-2">
              <button onclick="window.confirmOrderDelivery('\${order.id}')" class="btn-action w-full py-4 bg-[#008A45] hover:bg-[#007339] text-white font-bold text-xs md:text-sm uppercase tracking-widest rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                <i data-lucide="check-circle" class="w-4 h-4"></i>
                <span>Confirmer la bonne réception (Débloquer les fonds)</span>
              </button>

              <button onclick="window.openDisputeModal('\${order.id}')" class="btn-action w-full py-3 bg-[#F8F8F8] hover:bg-rose-50 text-rose-600 font-bold text-xs uppercase rounded-xl border border-rose-200 flex items-center justify-center gap-1.5">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i>
                <span>Signaler un problème / Ouvrir un litige (SupportResolver)</span>
              </button>
            </div>
          \` : order.status === 'DISPUTED' ? \`
            <div class="space-y-2 pt-2">
              <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                ⏱️ Arbitrage en cours sous 24h par SupportResolver.
              </div>
              <button onclick="window.resolveDisputeRelease('\${order.id}')" class="btn-action w-full py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl">
                Simuler Déblocage Vendeur (Preuve Valide)
              </button>
              <button onclick="window.resolveDisputeRefund('\${order.id}')" class="btn-action w-full py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl">
                Simuler Remboursement Acheteur (Non-conformité)
              </button>
            </div>
          \` : \`
            <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs font-bold text-[#008A45] space-y-1">
              <div class="text-base">🎉 Transaction complétée avec succès !</div>
              <div class="text-[11px] text-emerald-800 font-medium">Le vendeur a reçu son paiement Mobile Money. L'acheteur a reçu son article conforme.</div>
            </div>
          \`}

          <div class="pt-2 text-center">
            <button onclick="window.navigate('/')" class="text-xs font-bold text-gray-500 hover:text-[#111111]">
              ← Retour au marché
            </button>
          </div>
        </div>
      \`;
    }

    window.openDisputeModal = function(ordId) {
      const reason = prompt("Précisez le motif du litige pour SupportResolver (ex: Non-réception, Article non conforme, Endommagé) :");
      if (reason) {
        const order = window.store.orders.find(o => o.id === ordId);
        if (order) {
          order.status = 'DISPUTED';
          window.showToast('⚠️ Litige ouvert - Fonds gelés par SupportResolver');
          window.render();
        }
      }
    };

    window.resolveDisputeRelease = function(ordId) {
      const order = window.store.orders.find(o => o.id === ordId);
      if (order) {
        order.status = 'COMPLETED';
        window.showToast('✅ Preuve validée : Fonds débloqués au vendeur !');
        window.render();
      }
    };

    window.resolveDisputeRefund = function(ordId) {
      const order = window.store.orders.find(o => o.id === ordId);
      if (order) {
        order.status = 'REFUNDED';
        window.showToast('↩️ Non-conformité avérée : Acheteur remboursé intégralement');
        window.render();
      }
    };

    // 8. DÉPÔT D'ANNONCE AVEC SELLERCOACH (IA INVISIBLE) & WORKFLOW VIRAL
    function renderNewProduct() {
      const c = getCurrentCountry();
      const mediaList = window.store.newProductMedia || [];

      return \`
        <div class="max-w-2xl mx-auto bg-white rounded-3xl border border-[#E5E5E5] p-6 md:p-8 shadow-md space-y-6 animate-fade-in">
          
          <div class="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
            <div>
              <h1 class="text-lg font-black italic uppercase text-[#111111]">Déposer une annonce</h1>
              <span class="text-xs text-gray-500 font-medium">Avec assistant IA invisible SellerCoach & Séquestre garanti</span>
            </div>

            <button type="button" onclick="window.triggerInvisibleAIOptimization()" class="btn-action inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold shadow-xs">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-purple-600"></i>
              <span>✨ IA SellerCoach</span>
            </button>
          </div>

          <form onsubmit="window.handleCreateProduct(event)" class="space-y-4">
            
            <!-- Upload Photos -->
            <div class="space-y-2">
              <label class="block text-xs font-black italic uppercase tracking-wider text-[#111111]">
                Photos du produit (\${mediaList.length}) *
              </label>
              
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                \${mediaList.map((m, idx) => \`
                  <div class="relative aspect-square rounded-2xl overflow-hidden border border-[#E5E5E5] bg-neutral-100 group shadow-xs">
                    <img src="\${m.url}" class="w-full h-full object-cover" />
                    \${m.isPrimary ? \`
                      <span class="absolute top-1.5 left-1.5 bg-[#008A45] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm">
                        Principale
                      </span>
                    \` : ''}
                    <button type="button" onclick="window.removeNewProductMedia(\${idx})" class="btn-action absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
                      <i data-lucide="trash-2" class="w-3 h-3"></i>
                    </button>
                  </div>
                \`).join('')}

                <!-- Bouton Ajouter Photo -->
                <label class="btn-action aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#008A45] hover:bg-emerald-50/40 bg-[#F8F8F8] flex flex-col items-center justify-center p-2 text-center cursor-pointer transition">
                  <i data-lucide="camera" class="w-6 h-6 text-gray-400 mb-1"></i>
                  <span class="text-[10px] text-gray-600 font-bold">+ Photo</span>
                  <input type="file" accept="image/*" multiple onchange="window.handleNewProductUpload(event)" class="hidden" />
                </label>
              </div>
            </div>

            <!-- Titre Brut & Optimisation IA Invisible -->
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-black italic uppercase tracking-wider text-[#111111]">
                  Titre de l'article *
                </label>
                <button type="button" onclick="window.triggerInvisibleAIOptimization()" class="text-[10px] text-purple-700 hover:underline font-bold flex items-center gap-1">
                  <i data-lucide="sparkles" class="w-3 h-3 text-purple-600"></i>
                  <span>Optimiser le titre & description en 1 clic</span>
                </button>
              </div>
              <input
                id="prod-title"
                type="text"
                required
                value="iPhone 14 Pro Max 256Go Deep Purple"
                placeholder="Ex: iPhone 14 Pro Max 256Go Deep Purple"
                class="w-full text-xs font-semibold p-3.5 border border-[#E5E5E5] bg-[#F8F8F8] focus:bg-white rounded-xl outline-hidden focus:border-[#008A45] transition"
              />
            </div>

            <!-- Prix & Catégorie -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-xs font-black italic uppercase tracking-wider text-[#111111]">Prix (FCFA) *</label>
                <input
                  id="prod-price"
                  type="number"
                  required
                  value="480000"
                  placeholder="480000"
                  class="w-full text-xs font-black text-[#008A45] p-3.5 border border-[#E5E5E5] bg-[#F8F8F8] focus:bg-white rounded-xl"
                />
              </div>
              <div class="space-y-1">
                <label class="block text-xs font-black italic uppercase tracking-wider text-[#111111]">Catégorie</label>
                <select id="prod-category" class="w-full text-xs font-medium p-3.5 border border-[#E5E5E5] bg-[#F8F8F8] rounded-xl">
                  \${CATEGORIES.filter(cat => cat.id !== 'TOUT').map(cat => \`
                    <option value="\${cat.id}">\${cat.label}</option>
                  \`).join('')}
                </select>
              </div>
            </div>

            <!-- Description Optimisée SellerCoach -->
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-black italic uppercase tracking-wider text-[#111111]">
                  Description (Format Réseaux Sociaux & Bullet Points)
                </label>
                <span class="text-[10px] text-gray-400 font-mono">Format ultra-concis</span>
              </div>
              <textarea
                id="prod-desc"
                rows="4"
                placeholder="L'IA SellerCoach mettra en forme vos points forts..."
                class="w-full text-xs font-medium p-3.5 border border-[#E5E5E5] bg-[#F8F8F8] focus:bg-white rounded-xl outline-hidden focus:border-[#008A45] transition whitespace-pre-line"
              >✨ POINTS FORTS :
• iPhone 14 Pro Max 256Go Deep Purple d'origine
• Batterie à 96%, écran Retina OLED impeccable
• Vendu avec boîte complète, câble et coque MagSafe
• Localisation : Gabon (Libreville - Quartier Louis)

🛡️ SÉCURITÉ SÉQUESTRE ZARÉN :
Votre argent reste bloqué en toute sécurité sur Zarén. Le vendeur n'est payé qu'après votre validation à la livraison !</textarea>
            </div>

            <!-- SECTION LOCALISATION : PAYS, VILLES, QUARTIERS & LIEU-DIT -->
            <div class="p-4 bg-[#F8F8F8] rounded-2xl border border-[#E5E5E5] space-y-3">
              <div class="flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
                <i data-lucide="map-pin" class="w-4 h-4 text-[#008A45]"></i>
                <h3 class="text-xs font-black italic uppercase tracking-wider text-[#111111]">
                  Localisation de l'article (Afrique Centrale)
                </h3>
              </div>

              <!-- 1. Choix du Pays -->
              <div class="space-y-1">
                <label class="block text-[11px] font-bold uppercase text-gray-600">Pays *</label>
                <select id="prod-country" onchange="window.handlePublicationCountryChange(this.value)" class="w-full text-xs font-bold p-3 bg-white border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45]">
                  <option value="GA" selected>🇬🇦 Gabon (FCFA)</option>
                  <option value="CM">🇨🇲 Cameroun (FCFA)</option>
                  <option value="CG">🇨🇬 Congo-Brazzaville (FCFA)</option>
                  <option value="CD">🇨🇩 RD Congo (FCFA)</option>
                  <option value="TD">🇹🇩 Tchad (FCFA)</option>
                  <option value="GQ">🇬🇶 Guinée Équatoriale (FCFA)</option>
                  <option value="CF">🇨🇫 Centrafrique (FCFA)</option>
                </select>
              </div>

              <!-- 2. Ville & Quartier -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="block text-[11px] font-bold uppercase text-gray-600">Ville *</label>
                  <select id="prod-city" class="w-full text-xs font-medium p-3 bg-white border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45]">
                    <option value="Libreville">Libreville</option>
                    <option value="Akanda">Akanda</option>
                    <option value="Owendo">Owendo</option>
                    <option value="Port-Gentil">Port-Gentil</option>
                    <option value="Franceville">Franceville</option>
                    <option value="Oyem">Oyem</option>
                    <option value="Moanda">Moanda</option>
                    <option value="Lambaréné">Lambaréné</option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label class="block text-[11px] font-bold uppercase text-gray-600">Quartier *</label>
                  <input id="prod-district" type="text" value="Quartier Louis" placeholder="Ex: Quartier Louis, Bastos, Akwa..." class="w-full text-xs font-semibold p-3 bg-white border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45]" />
                </div>
              </div>

              <!-- 3. Lieu-dit & Repère exact -->
              <div class="space-y-1">
                <label class="block text-[11px] font-bold uppercase text-gray-600">Lieu-dit & Repère de livraison exact *</label>
                <input id="prod-landmark" type="text" value="En face de la Pharmacie des Forestiers, Immeuble ABC" placeholder="Ex: En face de la pharmacie, Immeuble ABC 2e étage" class="w-full text-xs font-medium p-3 bg-white border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45]" />
                <p class="text-[10px] text-gray-500">Précision pour le livreur et la remise en main propre sous séquestre.</p>
              </div>
            </div>

            <button type="submit" class="btn-action w-full py-4 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg mt-4 flex items-center justify-center gap-2 cursor-pointer">
              <i data-lucide="share-2" class="w-4 h-4"></i>
              <span>Publier & Générer le Partage Viral WhatsApp</span>
            </button>
          </form>
        </div>
      \`;
    }

    window.handlePublicationCountryChange = function(countryCode) {
      const citySelect = document.getElementById('prod-city');
      if (!citySelect) return;
      
      const cityMap = {
        'GA': ['Libreville', 'Akanda', 'Owendo', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda', 'Lambaréné'],
        'CM': ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Bamenda', 'Kribi', 'Limbe'],
        'CG': ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Oyo'],
        'CD': ['Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Kisangani'],
        'TD': ["N'Djamena", 'Moundou', 'Sarh', 'Abéché'],
        'GQ': ['Malabo', 'Bata', 'Oyala', 'Ebebiyín'],
        'CF': ['Bangui', 'Bimbo', 'Berbérati', 'Bouar']
      };

      const cities = cityMap[countryCode] || cityMap['GA'];
      citySelect.innerHTML = cities.map(c => \`<option value="\${c}">\${c}</option>\`).join('');
    };

    // Déclencheur IA Invisible SellerCoach
    window.triggerInvisibleAIOptimization = function() {
      const titleEl = document.getElementById('prod-title');
      const descEl = document.getElementById('prod-desc');
      const rawTitle = titleEl ? titleEl.value : 'Article de mode & tech';
      
      const cleanTitle = rawTitle.trim();
      const enhancedTitle = cleanTitle.length > 30 ? cleanTitle : cleanTitle + ' - Édition Premium Certifiée';
      if (titleEl) titleEl.value = enhancedTitle;

      if (descEl) {
        descEl.value = \`✨ POINTS FORTS (Générés par SellerCoach) :
• \${cleanTitle} en parfait état certifié
• Finition soignée et conforme à 100% aux photos
• Inspection disponible avant validation du paiement
• Retrait direct ou livraison express disponible

🛡️ SÉCURITÉ SÉQUESTRE ZARÉN :
Votre paiement Mobile Money est consigné et protégé par Zarén. Les fonds ne sont versés au vendeur qu'après votre confirmation de conformité !\`;
      }

      window.showToast('✨ Fiche optimisée par SellerCoach (IA Invisible)');
    };

    window.handleNewProductUpload = function(e) {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        files.forEach((file, idx) => {
          const url = URL.createObjectURL(file);
          window.store.newProductMedia.push({
            id: 'med_' + Date.now() + '_' + idx,
            url: url,
            type: 'IMAGE',
            isPrimary: window.store.newProductMedia.length === 0,
            name: file.name
          });
        });
        window.showToast('📷 ' + files.length + ' photo(s) ajoutée(s)');
        window.render();
      }
    };

    window.removeNewProductMedia = function(index) {
      window.store.newProductMedia.splice(index, 1);
      window.render();
    };

    // Création du produit & affichage immédiat de la modale de partage viral (Workflow complet)
    window.handleCreateProduct = function(e) {
      e.preventDefault();
      const title = document.getElementById('prod-title').value;
      const price = Number(document.getElementById('prod-price').value);
      const category = document.getElementById('prod-category').value;
      const desc = document.getElementById('prod-desc').value;
      const city = document.getElementById('prod-city').value;
      const district = document.getElementById('prod-district').value;

      const mediaUrls = window.store.newProductMedia.map(m => m.url);
      if (mediaUrls.length === 0) {
        mediaUrls.push('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80');
      }

      const shortCode = 'zrn-' + Math.random().toString(36).substring(2, 6);
      const newP = {
        id: 'prod_' + Date.now(),
        countryCode: 'GA',
        countryName: 'Gabon',
        category: category,
        shortCode: shortCode,
        title: title,
        description: desc,
        price: price,
        currency: 'XAF',
        images: mediaUrls,
        videoUrl: null,
        seller: window.store.currentUser ? window.store.currentUser.fullName : 'Boutique Certifiée',
        city: city,
        district: district,
        rating: 5.0,
        urgentBadge: 'Nouveau',
        isSaved: false
      };

      window.store.products.unshift(newP);
      if (window.confetti) confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      window.showToast('🎉 Produit publié ! Vos templates de partage sont prêts.');
      
      // Afficher l'écran de partage viral SellerCoach
      window.store.lastPublishedProduct = newP;
      window.navigate('/seller/share/' + newP.shortCode);
    };

    // 8.5 ÉCRAN DE PARTAGE VIRAL (SELLERCOACH TEMPLATES)
    function renderViralShareScreen(code) {
      const p = window.store.products.find(item => item.shortCode === code) || window.store.lastPublishedProduct || window.store.products[0];
      const shareUrl = window.location.origin + '/#/p/' + p.shortCode;

      const whatsappStatusText = \`🔥 DISPONIBLE : \${p.title}
💰 Prix : \${formatPrice(p.price)}
📍 \${p.city} (\${p.district})
🛡️ Paiement sécurisé par Séquestre ZARÉN (Zéro arnaque)

👉 Voir les photos et commander en direct :
\${shareUrl}\`;

      const facebookText = \`📢 NOUVEL ARRIVAGE : \${p.title}
💵 Prix fixe : \${formatPrice(p.price)}
✅ Garanti conforme ou remboursé sous Séquestre ZARÉN.
Lien d'achat direct : \${shareUrl}\`;

      return \`
        <div class="max-w-2xl mx-auto bg-white rounded-3xl border border-[#E5E5E5] p-6 md:p-8 shadow-md space-y-6 animate-fade-in text-center">
          
          <div class="w-16 h-16 rounded-full bg-emerald-100 text-[#008A45] flex items-center justify-center mx-auto shadow-inner">
            <i data-lucide="check" class="w-8 h-8"></i>
          </div>

          <div>
            <h1 class="text-xl font-black italic text-[#111111]">Article publié avec succès !</h1>
            <p class="text-xs text-gray-500 font-medium mt-1">
              Vos templates de partage viral <strong>SellerCoach</strong> sont prêts. Diffusez votre lien pour encaisser sans risque.
            </p>
          </div>

          <!-- Deep Link Court -->
          <div class="p-4 bg-[#F8F8F8] rounded-2xl border border-[#E5E5E5] text-left space-y-1.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Deep Link Court ZARÉN</span>
            <div class="flex items-center gap-2">
              <input type="text" readonly value="\${shareUrl}" class="bg-white text-xs font-mono font-bold p-2.5 rounded-xl border border-[#E5E5E5] flex-1 outline-hidden" />
              <button onclick="window.copyToClipboard('\${shareUrl}', 'Lien d\\'achat copié !')" class="btn-action py-2.5 px-4 rounded-xl bg-[#111111] text-white text-xs font-bold">
                Copier
              </button>
            </div>
          </div>

          <!-- TEMPLATES SELLERCOACH VIRAL -->
          <div class="space-y-4 text-left pt-2">
            <h3 class="text-xs font-black italic uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-purple-600"></i>
              <span>Templates de Partage Réseaux Sociaux (SellerCoach)</span>
            </h3>

            <!-- Option A : WhatsApp Status -->
            <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <span>💬</span> Template WhatsApp Status & Groupes
                </span>
                <button onclick="window.copyToClipboard(\`\${whatsappStatusText}\`, 'Template WhatsApp copié !')" class="btn-action text-[10px] font-bold text-[#008A45] hover:underline">
                  Copier le texte
                </button>
              </div>
              <p class="text-xs text-gray-700 font-mono whitespace-pre-line bg-white p-3 rounded-xl border border-emerald-100">
                \${whatsappStatusText}
              </p>
              <a href="https://api.whatsapp.com/send?text=\${encodeURIComponent(whatsappStatusText)}" target="_blank" class="btn-action w-full py-3 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-2 shadow-sm text-center">
                <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
                <span>Partager directement sur WhatsApp</span>
              </a>
            </div>

            <!-- Option B : Facebook & Instagram -->
            <div class="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <span>📱</span> Template Facebook & Telegram
                </span>
                <button onclick="window.copyToClipboard(\`\${facebookText}\`, 'Template Facebook copié !')" class="btn-action text-[10px] font-bold text-blue-700 hover:underline">
                  Copier le texte
                </button>
              </div>
              <p class="text-xs text-gray-700 font-mono whitespace-pre-line bg-white p-3 rounded-xl border border-blue-100">
                \${facebookText}
              </p>
            </div>
          </div>

          <div class="pt-4 flex items-center justify-between gap-4">
            <button onclick="window.navigate('/p/\${p.shortCode}')" class="btn-action flex-1 py-3 bg-[#F8F8F8] hover:bg-gray-200 text-[#111111] text-xs font-bold rounded-xl border border-[#E5E5E5]">
              Voir la fiche acheteur
            </button>
            <button onclick="window.navigate('/seller/dashboard')" class="btn-action flex-1 py-3 bg-[#008A45] text-white text-xs font-bold rounded-xl shadow-xs">
              Aller à l'espace vendeur
            </button>
          </div>

        </div>
      \`;
    }

    window.copyToClipboard = function(text, successMsg) {
      navigator.clipboard.writeText(text).then(() => {
        window.showToast('📋 ' + (successMsg || 'Copié dans le presse-papiers'));
      });
    };


    // 9. ESPACE VENDEUR PRO & ANALYTICS
    function renderSellerDashboard() {
      const activeTab = window.store.sellerActiveTab || 'OVERVIEW';
      const u = window.store.currentUser || {};
      const orders = window.store.orders || [
        {
          id: 'ord_1',
          orderNumber: 'ZRN-GA-9482',
          title: 'iPhone 14 Pro Max 256Go Deep Purple',
          price: 482000,
          status: 'PAID',
          phone: '+241 07 45 88 12',
          district: 'Quartier Louis, Libreville'
        }
      ];
      const products = window.store.products;

      return \`
        <div class="space-y-6 animate-fade-in">
          
          <!-- EN-TÊTE VENDEUR PRO -->
          <div class="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E5E5] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div class="flex items-center gap-3.5 sm:gap-4">
              <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#008A45] shadow-sm bg-neutral-100 shrink-0">
                <img
                  src="\${u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}"
                  alt="Logo"
                  class="w-full h-full object-cover"
                />
                <span class="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#008A45] border-2 border-white"></span>
              </div>

              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h1 class="text-base sm:text-xl font-black italic text-[#111111] tracking-tight">
                    \${u.businessName || 'Marlène Dressing & High-Tech'}
                  </h1>
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black italic bg-emerald-50 text-[#008A45] border border-emerald-200">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> VÉRIFIÉ
                  </span>
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black italic bg-neutral-900 text-white font-mono">
                    <i data-lucide="award" class="w-3 h-3 text-[#008A45]"></i> PASS PRO
                  </span>
                </div>

                <p class="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>📍 \${u.city || 'Libreville'} (\${u.district || 'Louis'})</span>
                  <span>•</span>
                  <span class="text-[#d97706] font-bold">★ 4.9 (84 avis certifiés)</span>
                  <span>•</span>
                  <span class="text-emerald-700 font-semibold">142 ventes sous séquestre</span>
                </p>
              </div>
            </div>

            <!-- Actions Rapides -->
            <div class="flex items-center gap-2 w-full md:w-auto flex-wrap">
              <button
                onclick="window.navigate('/shop/marlene-dressing')"
                class="btn-action flex-1 sm:flex-none py-2.5 px-3.5 bg-[#F8F8F8] hover:bg-neutral-100 border border-[#E5E5E5] text-[#111111] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <i data-lucide="eye" class="w-4 h-4 text-[#008A45]"></i>
                <span>Voir ma Vitrine</span>
              </button>

              <button
                onclick="window.navigate('/profile/settings')"
                class="btn-action flex-1 sm:flex-none py-2.5 px-3.5 bg-[#F8F8F8] hover:bg-neutral-100 border border-[#E5E5E5] text-[#111111] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <i data-lucide="settings" class="w-4 h-4 text-gray-700"></i>
                <span>Paramètres</span>
              </button>

              <button
                onclick="window.navigate('/seller/new')"
                class="btn-action flex-1 sm:flex-none py-2.5 px-4 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition whitespace-nowrap"
              >
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>+ Vendre un article</span>
              </button>
            </div>

          </div>

          <!-- 4 CARTES KPI FINANCIÈRES -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div class="p-5 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <i data-lucide="dollar-sign" class="w-4 h-4 text-emerald-600"></i> Chiffre d'Affaires
                </span>
                <span class="text-[10px] font-black text-[#008A45] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  +28.4%
                </span>
              </div>
              <div class="text-2xl font-black italic text-[#111111] font-mono">1 240 000 FCFA</div>
              <p class="text-[10px] text-gray-500 font-medium">Débloqué et transféré vers Mobile Money</p>
            </div>

            <div class="p-5 rounded-3xl bg-[#111827] text-white shadow-md space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold uppercase tracking-wider text-[#008A45] flex items-center gap-1.5">
                  <i data-lucide="shield-check" class="w-4 h-4"></i> Séquestre en cours
                </span>
                <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400">100% GARANTI</span>
              </div>
              <div class="text-2xl font-black italic text-white font-mono">482 000 FCFA</div>
              <p class="text-[10px] text-gray-300 font-medium">Fonds consignés en attente de livraison</p>
            </div>

            <div class="p-5 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs space-y-2 flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <i data-lucide="wallet" class="w-4 h-4 text-emerald-600"></i> Solde Retirable
                </span>
                <span class="text-[10px] font-bold text-gray-500">Dispo 24/7</span>
              </div>
              <div class="text-2xl font-black italic text-[#008A45] font-mono">\${formatPrice(window.store.sellerBalance || 758000)}</div>
              <button
                onclick="window.promptSellerPayout()"
                class="btn-action w-full py-2 px-3 bg-[#008A45] hover:bg-[#007339] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <i data-lucide="zap" class="w-3.5 h-3.5"></i>
                <span>Retrait Express</span>
              </button>
            </div>

            <div class="p-5 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i> Taux de Succès
                </span>
                <span class="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">0 Litige</span>
              </div>
              <div class="text-2xl font-black italic text-[#111111] font-mono">100%</div>
              <p class="text-[10px] text-gray-500 font-medium">142/142 commandes sans le moindre incident</p>
            </div>

          </div>

          <!-- ONGLETS DU DASHBOARD -->
          <div class="flex items-center gap-2 border-b border-[#E5E5E5] bg-white p-2 rounded-2xl shadow-xs">
            <button
              onclick="window.setSellerDashboardTab('OVERVIEW')"
              class="btn-action py-2.5 px-4 rounded-xl text-xs font-black italic uppercase tracking-wider transition \${activeTab === 'OVERVIEW' ? 'bg-[#111111] text-white shadow-sm' : 'text-gray-600 hover:bg-neutral-100'}"
            >
              📊 Vue Générale & Analytics
            </button>

            <button
              onclick="window.setSellerDashboardTab('ORDERS')"
              class="btn-action py-2.5 px-4 rounded-xl text-xs font-black italic uppercase tracking-wider transition \${activeTab === 'ORDERS' ? 'bg-[#111111] text-white shadow-sm' : 'text-gray-600 hover:bg-neutral-100'}"
            >
              📦 Commandes & Séquestres (\${orders.length})
            </button>

            <button
              onclick="window.setSellerDashboardTab('PRODUCTS')"
              class="btn-action py-2.5 px-4 rounded-xl text-xs font-black italic uppercase tracking-wider transition \${activeTab === 'PRODUCTS' ? 'bg-[#111111] text-white shadow-sm' : 'text-gray-600 hover:bg-neutral-100'}"
            >
              🛍️ Mon Catalogue (\${products.length})
            </button>
          </div>

          <!-- CONTENU DES ONGLETS -->
          \${activeTab === 'OVERVIEW' ? \`
            <div class="space-y-6">
              
              <!-- Histogramme des ventes -->
              <div class="bg-white rounded-3xl p-6 border border-[#E5E5E5] shadow-xs space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h2 class="text-sm font-black italic uppercase tracking-tight text-[#111111]">
                      Évolution des Ventes Hebdomadaires sous Séquestre
                    </h2>
                    <p class="text-xs text-gray-500 font-medium">Revenus validés par jour</p>
                  </div>
                  <span class="text-xs font-mono font-bold text-[#008A45]">Semaine en cours</span>
                </div>

                <div class="h-48 flex items-end justify-between gap-4 border-b border-gray-100 pb-4">
                  \${[
                    { d: 'Lun', a: '85k', h: '45%' },
                    { d: 'Mar', a: '140k', h: '65%' },
                    { d: 'Mer', a: '95k', h: '50%' },
                    { d: 'Jeu', a: '220k', h: '85%' },
                    { d: 'Ven', a: '310k', h: '100%' },
                    { d: 'Sam', a: '260k', h: '90%' },
                    { d: 'Dim', a: '130k', h: '60%' }
                  ].map(item => \`
                    <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span class="text-[10px] font-mono text-gray-400 group-hover:text-[#008A45] font-bold">\${item.a}</span>
                      <div class="w-full max-w-[40px] bg-emerald-100 group-hover:bg-[#008A45] rounded-xl transition-all" style="height: \${item.h}"></div>
                      <span class="text-xs font-bold text-gray-600">\${item.d}</span>
                    </div>
                  \`).join('')}
                </div>
              </div>

              <!-- Tunnel de conversion -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white rounded-3xl p-6 border border-[#E5E5E5] shadow-xs space-y-4">
                  <h3 class="text-xs font-black italic uppercase tracking-wider text-[#111111]">
                    Tunnel de Conversion Visibilité → Ventes
                  </h3>

                  <div class="space-y-3 pt-1">
                    <div class="p-3 bg-[#F8F8F8] rounded-2xl border border-gray-100 space-y-1">
                      <div class="flex items-center justify-between text-xs font-bold">
                        <span>1. Vues des fiches produits</span>
                        <span class="font-mono">4 850 vues (100%)</span>
                      </div>
                      <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 rounded-full w-full"></div>
                      </div>
                    </div>

                    <div class="p-3 bg-[#F8F8F8] rounded-2xl border border-gray-100 space-y-1">
                      <div class="flex items-center justify-between text-xs font-bold">
                        <span>2. Clics WhatsApp & Réseaux</span>
                        <span class="font-mono">620 clics (12.8%)</span>
                      </div>
                      <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-[#008A45] rounded-full w-[45%]"></div>
                      </div>
                    </div>

                    <div class="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                      <div class="flex items-center justify-between text-xs font-bold text-[#008A45]">
                        <span>3. Achats Séquestre Validés</span>
                        <span class="font-mono font-black">142 ventes (2.9%)</span>
                      </div>
                      <div class="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
                        <div class="h-full bg-[#008A45] rounded-full w-[25%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-white rounded-3xl p-6 border border-[#E5E5E5] shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <h3 class="text-xs font-black italic uppercase tracking-wider text-[#111111] mb-3">
                      Origine des Ventes par Canal
                    </h3>
                    <div class="space-y-2.5">
                      <div class="flex items-center justify-between p-2.5 bg-[#F8F8F8] rounded-xl text-xs font-bold">
                        <span>💬 WhatsApp Status & Groupes</span>
                        <span class="text-[#008A45]">58%</span>
                      </div>
                      <div class="flex items-center justify-between p-2.5 bg-[#F8F8F8] rounded-xl text-xs font-bold">
                        <span>🛍️ Grand Marché ZARÉN</span>
                        <span class="text-blue-600">28%</span>
                      </div>
                      <div class="flex items-center justify-between p-2.5 bg-[#F8F8F8] rounded-xl text-xs font-bold">
                        <span>📱 Facebook & Telegram</span>
                        <span class="text-purple-600">14%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onclick="window.navigate('/seller/new')"
                    class="btn-action w-full py-3 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs"
                  >
                    + Publier un article & Partager
                  </button>
                </div>
              </div>

            </div>
          \` : activeTab === 'ORDERS' ? \`
            <div class="space-y-3">
              \${orders.map(order => \`
                <div class="p-5 bg-white rounded-3xl border border-[#E5E5E5] shadow-xs space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono font-black text-[#111111] bg-gray-100 px-2.5 py-1 rounded-lg">\${order.orderNumber}</span>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">
                      💳 Payé (Séquestre ZARÉN)
                    </span>
                  </div>

                  <div class="flex items-center justify-between pt-1">
                    <div>
                      <h4 class="text-sm font-black italic text-[#111111]">\${order.title}</h4>
                      <p class="text-xs text-gray-500">Destinataire : \${order.phone} (\${order.district})</p>
                    </div>
                    <span class="text-base font-black text-[#008A45] font-mono">\${formatPrice(order.price)}</span>
                  </div>

                  <div class="pt-2 border-t border-gray-100 flex items-center gap-2">
                    <button onclick="window.showToast('Colis marqué expédié !')" class="btn-action flex-1 py-2 px-3 bg-[#008A45] text-white text-xs font-bold rounded-xl shadow-xs">
                      Marquer expédié / en livraison
                    </button>
                    <a href="https://wa.me/24107458812" target="_blank" class="btn-action py-2 px-3 bg-emerald-50 text-[#008A45] text-xs font-bold rounded-xl border border-emerald-200">
                      WhatsApp Client
                    </a>
                  </div>
                </div>
              \`).join('')}
            </div>
          \` : \`
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              \${products.map(p => \`
                <div class="bg-white rounded-3xl p-3 border border-[#E5E5E5] space-y-2 shadow-xs">
                  <img src="\${p.images[0]}" class="w-full h-32 object-cover rounded-2xl" />
                  <span class="text-sm font-black text-[#111111] font-mono block">\${formatPrice(p.price)}</span>
                  <h4 class="text-xs font-black italic line-clamp-1">\${p.title}</h4>
                  <button onclick="window.navigate('/p/\${p.shortCode}')" class="btn-action w-full py-1.5 bg-[#F8F8F8] hover:bg-gray-200 text-xs font-bold rounded-xl">
                    Voir la fiche
                  </button>
                </div>
              \`).join('')}
            </div>
          \`}

        </div>
      \`;
    }

    window.setSellerDashboardTab = function(tab) {
      window.store.sellerActiveTab = tab;
      window.render();
    };

    window.promptSellerPayout = function() {
      const amt = prompt("Montant du retrait instantané Mobile Money (FCFA) :", "150000");
      if (amt) {
        const num = parseInt(amt, 10);
        if (!isNaN(num) && num > 0) {
          if (!window.store.sellerBalance) window.store.sellerBalance = 758000;
          window.store.sellerBalance -= num;
          if (window.confetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
          window.showToast('⚡ Virement de ' + num.toLocaleString() + ' FCFA envoyé avec succès par Airtel Money !');
          window.render();
        }
      }
    };

    window.toggleDrawerMenu = function(open) {
      const overlay = document.getElementById('drawer-menu-overlay');
      if (overlay) {
        if (open) {
          overlay.classList.remove('hidden');
        } else {
          overlay.classList.add('hidden');
        }
      }
    };

    // 10. AUTH & LOGIN
    function renderLogin() {
      const c = getCurrentCountry();
      return \`
        <div class="max-w-md mx-auto bg-white rounded-3xl border border-[#E5E5E5] p-6 md:p-8 shadow-md space-y-6 animate-fade-in">
          <div class="text-center">
            <div class="w-12 h-12 rounded-2xl bg-[#111827] border border-gray-800 inline-flex items-center justify-center mx-auto mb-3 shadow-md p-2">
              <img src="${logoDataUrl}" alt="ZARÉN" class="w-full h-full object-contain" />
            </div>
            <span class="text-xs font-black italic text-gray-500 uppercase tracking-wider block">Connexion Téléphone & OTP</span>
          </div>

          <form onsubmit="window.handleLoginSubmit(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-black italic uppercase tracking-wider text-[#111111] mb-1.5">Numéro de téléphone</label>
              <div class="relative flex items-center">
                <span class="absolute left-3.5 text-xs font-bold text-gray-500">\${c.flag} \${c.phonePrefix}</span>
                <input id="auth-phone" type="tel" required value="07 45 88 12" class="w-full text-xs font-bold pl-20 pr-3.5 py-3.5 border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45]" />
              </div>
            </div>

            <button type="submit" class="btn-action w-full py-4 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md">
              Recevoir mon code OTP
            </button>
          </form>
        </div>
      \`;
    }

    window.handleLoginSubmit = function(e) {
      e.preventDefault();
      const phone = document.getElementById('auth-phone').value;
      window.navigate('/auth/verify?phone=' + encodeURIComponent(phone));
    };

    function renderVerify() {
      return \`
        <div class="max-w-md mx-auto bg-white rounded-3xl border border-[#E5E5E5] p-6 md:p-8 shadow-md text-center space-y-6 animate-fade-in">
          <h2 class="text-xl font-black italic uppercase text-[#111111]">Vérification du code OTP</h2>
          <button onclick="window.completeLogin()" class="btn-action w-full py-4 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md">
            Valider et se connecter
          </button>
        </div>
      \`;
    }

    window.completeLogin = function() {
      window.showToast('✓ Connecté avec succès');
      window.navigate('/profile/settings');
    };

    window.handleLogout = function() {
      window.store.currentUser = null;
      window.showToast('Déconnecté');
      window.navigate('/');
    };

    // 12. ARTICLES SAUVEGARDÉS
    function renderSaved() {
      const savedItems = window.store.products.filter(p => p.isSaved);

      return \`
        <div class="bg-white rounded-3xl border border-[#E5E5E5] p-6 md:p-8 shadow-xs space-y-6 animate-fade-in">
          <h1 class="text-lg font-black italic uppercase tracking-wider text-[#111111]">
            ARTICLES SAUVEGARDÉS (\${savedItems.length})
          </h1>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            \${savedItems.map(p => \`
              <div onclick="window.navigate('/p/\${p.shortCode}')" class="card-product group flex flex-col bg-[#F8F8F8] p-3 rounded-2xl border border-[#E5E5E5]">
                <img src="\${p.images[0]}" class="w-full h-32 object-cover rounded-xl mb-2" />
                <span class="text-xs font-black text-[#111111] mb-0.5">\${formatPrice(p.price)}</span>
                <p class="text-xs text-[#111111] font-black italic line-clamp-2 mb-2">\${p.title}</p>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    // 13. VITRINE BOUTIQUE & SYSTÈME D'AVIS CLIENTS
    function renderShopShowcaseView(shopId) {
      const activeTab = window.store.shopActiveTab || 'products';
      const reviews = window.store.shopReviews || [
        {
          id: 'rev_1',
          buyerName: 'Éric Mba',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          rating: 5,
          date: 'Il y a 2 jours',
          productTitle: 'iPhone 14 Pro Max 256Go Deep Purple',
          comment: 'Téléphone 100% conforme à l\\'annonce ! Batterie impeccable et reçu avec tous les accessoires. J\\'ai validé le déblocage des fonds dès la remise par le livreur. Vendeuse très pro !',
          verifiedEscrow: true
        },
        {
          id: 'rev_2',
          buyerName: 'Christelle Nze',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          rating: 5,
          date: 'Il y a 5 jours',
          productTitle: 'Perruque Lace Front HD 13x4 26 Pouces',
          comment: 'La dentelle est vraiment invisible et les mèches sont soyeuses. Livraison en moins de 2h au Quartier Louis. Je recommande les yeux fermés !',
          verifiedEscrow: true
        }
      ];

      const u = window.store.currentUser || {};
      const shopName = u.businessName || 'Marlène Dressing & High-Tech';
      const shopSlogan = u.businessSlogan || 'Vêtements chics importés & Accessoires Apple d\\'origine certifiée';
      const shopBanner = u.shopBanner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80';
      const shopLogo = u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
      const shopCity = u.city || 'Libreville';
      const shopDistrict = u.district || 'Quartier Louis';
      const shopAddress = u.shopAddress || 'Galerie Marchande Louis, Rez-de-chaussée, Boutique N°14';
      const shopHours = u.shopHours || 'Lun - Sam : 08h30 - 19h00 • Dimanche : 10h00 - 16h00';
      const shopPhone = u.shopWhatsapp || '+241 07 45 88 12';

      const products = window.store.products;

      return \`
        <div class="space-y-6 animate-fade-in">
          
          <button onclick="window.navigate('/')" class="btn-action inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#111111] transition">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
            <span>Retour au Marché ZARÉN</span>
          </button>

          <!-- 1. GRANDE BANNIÈRE & PROFIL DE VITRINE -->
          <div class="bg-white rounded-3xl border border-[#E5E5E5] overflow-hidden shadow-sm">
            
            <div class="relative h-48 sm:h-64 w-full bg-neutral-900 overflow-hidden">
              <img src="\${shopBanner}" alt="\${shopName}" class="w-full h-full object-cover opacity-90" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

              <div class="absolute top-4 right-4 bg-[#008A45] text-white text-[10px] sm:text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 font-mono">
                <i data-lucide="award" class="w-3.5 h-3.5"></i>
                <span>Boutique Partenaire Pass Pro</span>
              </div>
            </div>

            <div class="px-6 pb-6 pt-0 relative">
              <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
                
                <div class="flex items-end gap-4">
                  <div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white shrink-0">
                    <img src="\${shopLogo}" alt="\${shopName}" class="w-full h-full object-cover" />
                    <span class="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#008A45] border-2 border-white shadow-xs"></span>
                  </div>

                  <div class="space-y-1 pb-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h1 class="text-xl sm:text-2xl font-black italic text-[#111111] tracking-tight">
                        \${shopName}
                      </h1>
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black italic bg-emerald-50 text-[#008A45] border border-emerald-200">
                        <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> VÉRIFIÉ
                      </span>
                    </div>

                    <p class="text-xs text-gray-600 font-medium line-clamp-1 max-w-xl">
                      \${shopSlogan}
                    </p>

                    <div class="flex items-center gap-3 text-xs text-gray-500 font-medium flex-wrap pt-0.5">
                      <span class="flex items-center gap-1 text-[#d97706] font-bold">
                        ★ 4.9 <span class="text-gray-400 font-normal">(84 avis certifiés)</span>
                      </span>
                      <span>•</span>
                      <span class="flex items-center gap-1">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#008A45]"></i>
                        <span>\${shopCity} (\${shopDistrict})</span>
                      </span>
                      <span>•</span>
                      <span class="font-semibold text-emerald-800">
                        ⚡ 142 ventes sous séquestre
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2.5 w-full md:w-auto pt-2 md:pt-0">
                  <a
                    href="https://wa.me/24107458812?text=Bonjour%20Marlene%20Dressing%2C%20je%20vous%20contacte%20depuis%20votre%20vitrine%20ZAREN."
                    target="_blank"
                    class="btn-action flex-1 md:flex-none px-4 py-2.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <i data-lucide="message-circle" class="w-4 h-4"></i>
                    <span>WhatsApp Boutique</span>
                  </a>

                  <button
                    onclick="window.copyToClipboard(window.location.href, 'Lien de la vitrine copié !')"
                    class="btn-action p-2.5 bg-[#F8F8F8] hover:bg-gray-200 text-[#111111] rounded-xl border border-[#E5E5E5] transition"
                  >
                    <i data-lucide="share-2" class="w-4 h-4"></i>
                  </button>
                </div>

              </div>

              <!-- Badges de Réassurance -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-gray-100 text-[11px] font-bold text-gray-700">
                <div class="p-2 bg-[#F8F8F8] rounded-xl border border-gray-100 flex items-center gap-1.5">
                  <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-[#008A45]"></i>
                  <span class="truncate">Badge Vendeur Vérifié</span>
                </div>
                <div class="p-2 bg-[#F8F8F8] rounded-xl border border-gray-100 flex items-center gap-1.5">
                  <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-[#008A45]"></i>
                  <span class="truncate">Expédition Express &lt; 2h</span>
                </div>
                <div class="p-2 bg-[#F8F8F8] rounded-xl border border-gray-100 flex items-center gap-1.5">
                  <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-[#008A45]"></i>
                  <span class="truncate">Retour Gratuit sous 48h</span>
                </div>
                <div class="p-2 bg-[#F8F8F8] rounded-xl border border-gray-100 flex items-center gap-1.5">
                  <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-[#008A45]"></i>
                  <span class="truncate">Séquestre 100% Garanti</span>
                </div>
              </div>

            </div>

            <!-- 2. ONGLETS DE LA VITRINE -->
            <div class="flex items-center border-t border-[#E5E5E5] bg-[#F8F8F8] px-6">
              <button
                onclick="window.setShopTab('products')"
                class="py-3.5 px-4 text-xs font-black italic uppercase tracking-wider border-b-2 transition flex items-center gap-2 cursor-pointer \${activeTab === 'products' ? 'border-[#008A45] text-[#008A45] bg-white' : 'border-transparent text-gray-500 hover:text-[#111111]'}"
              >
                <i data-lucide="store" class="w-4 h-4"></i>
                <span>Articles en vente (\${products.length})</span>
              </button>

              <button
                onclick="window.setShopTab('reviews')"
                class="py-3.5 px-4 text-xs font-black italic uppercase tracking-wider border-b-2 transition flex items-center gap-2 cursor-pointer \${activeTab === 'reviews' ? 'border-[#008A45] text-[#008A45] bg-white' : 'border-transparent text-gray-500 hover:text-[#111111]'}"
              >
                <i data-lucide="star" class="w-4 h-4"></i>
                <span>Avis & Confiance (\${reviews.length})</span>
              </button>

              <button
                onclick="window.setShopTab('about')"
                class="py-3.5 px-4 text-xs font-black italic uppercase tracking-wider border-b-2 transition flex items-center gap-2 cursor-pointer \${activeTab === 'about' ? 'border-[#008A45] text-[#008A45] bg-white' : 'border-transparent text-gray-500 hover:text-[#111111]'}"
              >
                <i data-lucide="clock" class="w-4 h-4"></i>
                <span>Horaires & Contact</span>
              </button>
            </div>

          </div>

          <!-- CONTENU DES ONGLETS -->
          \${activeTab === 'products' ? \`
            <div class="space-y-6">
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                \${products.map(p => \`
                  <div class="card-product group flex flex-col bg-white p-3 rounded-2xl border border-[#E5E5E5] hover:border-[#008A45] shadow-xs transition">
                    <div class="relative aspect-[3/4] bg-neutral-100 overflow-hidden rounded-xl mb-3">
                      <img src="\${p.images[0]}" alt="\${p.title}" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" />
                      
                      <button onclick="window.toggleSave('\${p.id}', event)" class="btn-action absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md hover:bg-white cursor-pointer">
                        <span class="text-xs">\${p.isSaved ? '❤️' : '🤍'}</span>
                      </button>

                      <div class="absolute top-2.5 left-2.5 bg-[#008A45] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md tracking-wider shadow-sm">
                        SÉQUESTRE
                      </div>

                      \${p.videoUrl ? \`
                        <div class="absolute top-2.5 right-2.5 bg-black/80 text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          <span>▶</span>
                          <span>Vidéo</span>
                        </div>
                      \` : ''}
                    </div>

                    <div class="flex items-baseline justify-between mb-1">
                      <span class="text-sm sm:text-base font-black text-[#111111]">\${formatPrice(p.price)}</span>
                      <span class="text-[10px] text-[#008A45] font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        ★ 4.9
                      </span>
                    </div>

                    <h3 onclick="window.navigate('/p/\${p.shortCode}')" class="text-xs text-[#111111] font-black italic line-clamp-2 leading-snug mb-2 group-hover:text-[#008A45] cursor-pointer">
                      \${p.title}
                    </h3>

                    <div class="mt-auto pt-2 border-t border-gray-100">
                      <button onclick="window.openQuickBuyModal('\${p.id}', event)" class="btn-action w-full py-2 bg-emerald-50 hover:bg-[#008A45] text-[#008A45] hover:text-white border border-emerald-200 text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer">
                        <i data-lucide="zap" class="w-3 h-3"></i>
                        <span>Achat Express Séquestre</span>
                      </button>
                    </div>
                  </div>
                \`).join('')}
              </div>
            </div>
          \` : activeTab === 'reviews' ? \`
            <div class="space-y-6">
              
              <!-- Récapitulatif Notes -->
              <div class="bg-white p-6 md:p-8 rounded-3xl border border-[#E5E5E5] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div class="md:col-span-4 text-center md:border-r md:border-gray-100 md:pr-6 space-y-1">
                  <div class="text-4xl sm:text-5xl font-black italic text-[#111111] font-mono">4.9</div>
                  <div class="text-amber-500 text-lg">★★★★★</div>
                  <p class="text-xs text-gray-500 font-medium">84 achats certifiés sous Séquestre</p>
                </div>

                <div class="md:col-span-5 space-y-2 text-xs font-semibold">
                  <div class="flex items-center gap-2">
                    <span class="w-6 text-gray-500">5★</span>
                    <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full bg-[#008A45] rounded-full w-[92%]"></div>
                    </div>
                    <span class="w-8 text-right text-gray-500">92%</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-6 text-gray-500">4★</span>
                    <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full bg-[#008A45] rounded-full w-[7%]"></div>
                    </div>
                    <span class="w-8 text-right text-gray-500">7%</span>
                  </div>
                </div>

                <div class="md:col-span-3 text-center md:text-right">
                  <button onclick="window.promptReviewModal()" class="btn-action w-full py-3 px-4 bg-[#111111] text-white text-xs font-bold uppercase rounded-2xl shadow-md">
                    ✍️ Donner un avis
                  </button>
                </div>
              </div>

              <!-- Liste des Avis -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                \${reviews.map(rev => \`
                  <div class="bg-white p-5 rounded-2xl border border-[#E5E5E5] space-y-3 shadow-xs">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <img src="\${rev.avatar}" class="w-10 h-10 rounded-full object-cover border border-[#E5E5E5]" />
                        <div>
                          <h4 class="text-xs font-bold text-[#111111]">\${rev.buyerName}</h4>
                          <span class="text-[10px] text-gray-400 font-medium">\${rev.date}</span>
                        </div>
                      </div>
                      <span class="text-amber-500 font-bold text-xs">★★★★★</span>
                    </div>

                    <div class="p-2 bg-[#F8F8F8] rounded-xl border border-gray-100 text-[11px] text-gray-600 font-medium">
                      Article acheté : <strong>\${rev.productTitle}</strong>
                    </div>

                    <p class="text-xs text-gray-700 leading-relaxed font-medium">
                      « \${rev.comment} »
                    </p>

                    <div class="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                      <span class="inline-flex items-center gap-1 text-[#008A45] font-bold">
                        <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Achat vérifié par Séquestre
                      </span>
                      <span class="text-gray-400">✓ Livré à Libreville</span>
                    </div>
                  </div>
                \`).join('')}
              </div>

            </div>
          \` : \`
            <div class="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E5E5] shadow-xs space-y-6">
              <div>
                <h2 class="text-base font-black italic uppercase text-[#111111] mb-2">
                  À propos de \${shopName}
                </h2>
                <p class="text-xs text-gray-700 leading-relaxed font-medium">
                  Boutique premium certifiée à Libreville depuis 2022. Tous nos produits sont neufs, testés et garantis conformes sous séquestre ZARÉN.
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div class="space-y-4">
                  <div class="flex items-start gap-3">
                    <div class="w-9 h-9 rounded-xl bg-emerald-50 text-[#008A45] flex items-center justify-center shrink-0">
                      <i data-lucide="map-pin" class="w-4 h-4"></i>
                    </div>
                    <div>
                      <h3 class="text-xs font-bold text-[#111111]">Point de Retrait & Boutique Physique</h3>
                      <p class="text-xs text-gray-600 font-medium mt-0.5">\${shopAddress}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="w-9 h-9 rounded-xl bg-emerald-50 text-[#008A45] flex items-center justify-center shrink-0">
                      <i data-lucide="clock" class="w-4 h-4"></i>
                    </div>
                    <div>
                      <h3 class="text-xs font-bold text-[#111111]">Horaires d'Ouverture</h3>
                      <p class="text-xs text-gray-600 font-medium mt-0.5">\${shopHours}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="w-9 h-9 rounded-xl bg-emerald-50 text-[#008A45] flex items-center justify-center shrink-0">
                      <i data-lucide="phone" class="w-4 h-4"></i>
                    </div>
                    <div>
                      <h3 class="text-xs font-bold text-[#111111]">Service Client & WhatsApp</h3>
                      <p class="text-xs font-mono font-bold text-gray-800 mt-0.5">\${shopPhone}</p>
                    </div>
                  </div>
                </div>

                <div class="p-6 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-3 flex flex-col justify-between">
                  <div class="space-y-2">
                    <div class="flex items-center gap-2 text-[#008A45] font-black italic text-xs uppercase">
                      <i data-lucide="shield-check" class="w-4 h-4"></i>
                      <span>Garantie Totale Séquestre</span>
                    </div>
                    <p class="text-xs text-emerald-950 font-medium leading-relaxed">
                      Vos fonds restent consignés sur ZARÉN jusqu'à confirmation de conformité à la livraison.
                    </p>
                  </div>

                  <a
                    href="https://wa.me/24107458812"
                    target="_blank"
                    class="btn-action w-full py-3 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm text-center"
                  >
                    <i data-lucide="message-circle" class="w-4 h-4"></i>
                    <span>Contacter sur WhatsApp</span>
                  </a>
                </div>

              </div>
            </div>
          \`}

        </div>
      \`;
    }

    // =========================================================================
    // VUE DU PROFIL UTILISATEUR (STANDARD STYLE VINTED vs MARCHAND PRO)
    // =========================================================================
    function renderUserProfileView(userId) {
      const u = window.store.currentUser || {
        fullName: 'Marlène Obame',
        username: '@marlene_dressing',
        businessName: 'iStore & Dressing Libreville',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        city: 'Libreville',
        district: 'Quartier Louis',
        plan: 'STANDARD',
        ratingAvg: 4.9,
        ratingCount: 12,
        completedSales: 24,
        escrowBalance: 482000
      };

      const isPro = u.plan === 'PRO';

      const reviews = window.store.shopReviews || [
        { id: '1', buyerName: 'Jean-Marc Nguema', rating: 5, date: 'Il y a 2 jours', productTitle: 'iPhone 14 Pro Max 256GB Deep Purple', comment: 'Téléphone 100% conforme, scellé. Livré en 1h chrono à Louis. Argent débloqué avec plaisir.', verifiedEscrow: true },
        { id: '2', buyerName: 'Sylvie Mboumba', rating: 5, date: 'Il y a 5 jours', productTitle: 'Robe de Soirée Satin Émeraude', comment: 'Tissu de qualité incroyable, taille parfaite. Super expérience avec le paiement sous séquestre ZARÉN.', verifiedEscrow: true },
        { id: '3', buyerName: 'Brice Ondimba', rating: 4, date: 'Il y a 1 semaine', productTitle: 'AirPods Pro 2 avec Boîtier MagSafe', comment: 'Très bon produit original avec réducteur de bruit actif. Vendeur réactif et sérieux.', verifiedEscrow: true }
      ];

      const products = window.store.products || [];

      // 1. SI VENDEUR STANDARD : VUE ÉPURÉE STYLE VINTED (MOBILE-FIRST)
      if (!isPro) {
        return \`
          <div class="max-w-xl mx-auto space-y-4 animate-fade-in pb-16">
            
            <!-- EN-TÊTE ÉPURÉ VINTED -->
            <div class="bg-white rounded-3xl p-6 border border-[#E5E5E5] shadow-xs space-y-4">
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-3.5">
                  <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-[#008A45] shadow-sm shrink-0">
                    <img src="\${u.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}" class="w-full h-full object-cover" />
                  </div>
                  <div class="space-y-0.5">
                    <h1 class="text-base font-black italic text-[#111111]">\${u.fullName}</h1>
                    <span class="text-xs font-mono font-bold text-gray-500 block">\${u.username || '@marlene_dressing'}</span>
                    <span class="text-[11px] text-gray-600 flex items-center gap-1">
                      <i data-lucide="map-pin" class="w-3 h-3 text-[#008A45]"></i>
                      <span>\${u.city} • \${u.district || 'Louis'}</span>
                    </span>
                  </div>
                </div>

                <div class="text-right">
                  <div class="flex items-center justify-end gap-1 text-amber-500 font-bold text-sm">
                    <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                    <span class="text-gray-900 font-mono font-black">\${u.ratingAvg || 4.9}</span>
                  </div>
                  <span class="text-[11px] text-[#008A45] font-bold block mt-0.5">(\${reviews.length} avis certifiés)</span>
                </div>
              </div>

              <div class="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-gray-700">
                  <i data-lucide="tag" class="w-3 h-3 text-gray-500"></i>
                  <span>Formule Vendeur Standard (500 FCFA / acte)</span>
                </span>
                <span class="text-[11px] text-[#008A45] font-bold flex items-center gap-1">
                  <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Séquestre Garanti
                </span>
              </div>

              <div class="grid grid-cols-2 gap-2.5 pt-1">
                <button onclick="window.navigate('/seller/new')" class="btn-action py-3 px-3 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase flex items-center justify-center gap-1.5 shadow-sm text-center">
                  <i data-lucide="plus-circle" class="w-4 h-4"></i>
                  <span>+ Vendre un article</span>
                </button>
                <button onclick="window.navigate('/profile/settings')" class="btn-action py-3 px-3 rounded-2xl bg-white border border-[#E5E5E5] text-[#111111] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs text-center">
                  <i data-lucide="settings" class="w-4 h-4 text-gray-600"></i>
                  <span>Modifier profil</span>
                </button>
              </div>
            </div>

            <!-- BANNIÈRE DISCRÈTE PASSER EN PRO -->
            <div class="p-4 rounded-2xl bg-linear-to-r from-neutral-900 to-neutral-800 text-white flex items-center justify-between gap-3 shadow-xs">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                  <i data-lucide="sparkles" class="w-4 h-4"></i>
                </div>
                <div>
                  <h4 class="text-xs font-black italic text-white">Passez au Pass Pro (4 500 FCFA/mois)</h4>
                  <p class="text-[10px] text-gray-300">Vendez en illimité sans frais unitaires & Assistant IA.</p>
                </div>
              </div>
              <button onclick="window.store.currentUser.plan='PRO'; window.showToast('⭐ Pass Pro Actif !'); window.render();" class="btn-action px-3 py-1.5 bg-[#008A45] hover:bg-[#007339] text-white text-[11px] font-bold uppercase rounded-xl shrink-0">
                Activer
              </button>
            </div>

            <!-- CARTE SOLDE SÉQUESTRE -->
            <div class="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase text-gray-400 block">Solde Séquestre ZARÉN (Disponible)</span>
                <span class="text-xl font-black italic text-[#111111] font-mono">\${formatPrice(u.escrowBalance || 482000)}</span>
              </div>
              <button onclick="window.promptSellerPayout()" class="btn-action py-2.5 px-3.5 bg-[#111827] text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
                <i data-lucide="wallet" class="w-3.5 h-3.5 text-[#008A45]"></i>
                <span>Retirer</span>
              </button>
            </div>

            <!-- DRESSING EN GRILLE 2 COLONNES -->
            <div class="space-y-3 pt-2">
              <div class="flex items-center justify-between text-xs font-bold px-1">
                <span class="text-gray-700">Articles en vente dans le dressing</span>
                <span class="text-[#008A45] font-mono">500 FCFA / publication</span>
              </div>

              <div class="grid grid-cols-2 gap-3">
                \${products.map((p, idx) => \`
                  <div onclick="window.navigate('/p/\${p.shortCode}')" class="bg-white rounded-2xl overflow-hidden border border-[#E5E5E5] shadow-2xs flex flex-col justify-between cursor-pointer group">
                    <div class="relative aspect-square bg-gray-100 overflow-hidden">
                      <img src="\${p.images[0]}" class="w-full h-full object-cover group-hover:scale-105 transition" />
                      <span class="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold">
                        \${idx % 2 === 0 ? 'Très bon état' : 'Neuf avec étiquette'}
                      </span>
                    </div>
                    <div class="p-3 space-y-1">
                      <span class="text-sm font-black italic text-[#111111] font-mono block">\${formatPrice(p.price)}</span>
                      <h4 class="text-xs font-bold text-gray-800 line-clamp-1">\${p.title}</h4>
                      <span class="text-[10px] text-gray-400 block">\${p.city}</span>
                    </div>
                  </div>
                \`).join('')}
              </div>
            </div>

          </div>
        \`;
      }

      // 2. SI VENDEUR PRO : VUE MARCHAND OFFICIELLE AVEC BANNIÈRE HD & BOUTIQUE
      return \`
        <div class="space-y-6 animate-fade-in pb-12">
          
          <!-- BANNIÈRE ET EN-TÊTE DU PROFIL PRO -->
          <div class="bg-white rounded-3xl overflow-hidden border border-[#E5E5E5] shadow-xs">
            <div class="relative h-48 sm:h-64 w-full bg-neutral-900">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
                class="w-full h-full object-cover opacity-85"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div class="absolute top-4 right-4 flex items-center gap-2">
                <span class="px-3 py-1 rounded-full bg-[#008A45] text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <i data-lucide="award" class="w-3.5 h-3.5"></i> Vendeur Vérifié
                </span>
                <span class="px-3 py-1 rounded-full bg-amber-400 text-neutral-950 text-[11px] font-black italic">
                  ⭐ PASS PRO ACTIF
                </span>
              </div>
            </div>

            <!-- INFOS PRINCIPALES PROFIL PRO -->
            <div class="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-14">
              <div class="flex items-end gap-4">
                <div class="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-xl shrink-0">
                  <img src="\${u.avatarUrl}" class="w-full h-full object-cover" />
                </div>
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <h1 class="text-xl font-black italic text-[#111111]">\${u.businessName || u.fullName}</h1>
                    <span class="p-1 rounded-full bg-emerald-100 text-[#008A45]">
                      <i data-lucide="check" class="w-3 h-3"></i>
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                    <i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#008A45]"></i>
                    <span>\${u.city || 'Libreville'}, Gabon</span>
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2.5">
                <button onclick="window.navigate('/messages')" class="btn-action px-4 py-2.5 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-sm">
                  <i data-lucide="message-circle" class="w-4 h-4"></i>
                  <span>Envoyer un message</span>
                </button>
              </div>
            </div>
          </div>

          <!-- SECTION STATS & QUOTA DE NOTATION ÉTOILES PRO -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div class="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Quota de Satisfaction Acheteurs
                </span>
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-black italic text-[#111111] font-mono">\${u.ratingAvg || 4.9}</span>
                  <span class="text-xs text-gray-400 font-bold">/ 5</span>
                </div>
                <div class="flex items-center gap-1 text-amber-400 mt-1">
                  <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                  <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                  <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                  <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                  <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                  <span class="text-xs text-gray-600 font-bold ml-1.5">(\${reviews.length} avis vérifiés)</span>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Historique des Transactions Séquestre
                </span>
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-black italic text-[#008A45] font-mono">\${u.completedSales || 89}</span>
                  <span class="text-xs text-gray-500 font-bold">ventes réussies</span>
                </div>
                <p class="text-xs text-gray-600 mt-2 font-medium">
                  100% des colis remis en conformité après séquestre Mobile Money.
                </p>
              </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Formule d'Accès ZARÉN
                </span>
                <div class="flex items-center gap-2">
                  <span class="text-lg font-black italic text-[#111111]">Abonnement Pass Pro</span>
                  <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">Actif</span>
                </div>
                <p class="text-xs text-gray-600 mt-2 font-medium">
                  4 500 FCFA/mois • Publications illimitées, 0% commission, SellerCoach IA.
                </p>
              </div>
            </div>

          </div>

          <!-- LISTE DES AVIS PRO -->
          <div class="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E5E5] shadow-xs space-y-6">
            <div class="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 class="text-base font-black italic uppercase text-[#111111]">
                  Avis & Commentaires Certifiés (\${reviews.length})
                </h3>
                <p class="text-xs text-gray-500">Chaque avis est émis exclusivement après libération du séquestre.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              \${reviews.map(rev => \`
                <div class="p-5 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="w-9 h-9 rounded-full bg-emerald-100 text-[#008A45] font-black flex items-center justify-center text-xs">
                        \${rev.buyerName.charAt(0)}
                      </div>
                      <div>
                        <h4 class="text-xs font-bold text-[#111111]">\${rev.buyerName}</h4>
                        <span class="text-[10px] text-gray-400">\${rev.date}</span>
                      </div>
                    </div>
                    <span class="text-amber-500 font-bold text-xs">★★★★★</span>
                  </div>

                  <div class="text-[11px] font-semibold text-gray-800">
                    Article : \${rev.productTitle}
                  </div>

                  <p class="text-xs text-gray-600 italic">
                    « \${rev.comment} »
                  </p>

                  <div class="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px] text-[#008A45] font-bold">
                    <span class="inline-flex items-center gap-1">
                      <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Séquestre ZARÉN Vérifié
                    </span>
                    <span class="text-gray-400 font-normal">Libreville</span>
                  </div>
                </div>
              \`).join('')}
            </div>
          </div>

        </div>
      \`;
    }

    // =========================================================================
    // VUE MESSAGERIE INTERNE & NÉGOCIATIONS D'OFFRES
    // =========================================================================
    function renderMessagesView() {
      return \`
        <div class="space-y-4 animate-fade-in pb-12">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-black italic uppercase text-[#111111] flex items-center gap-2">
                <i data-lucide="message-circle" class="w-5 h-5 text-[#008A45]"></i>
                <span>Messagerie Sécurisée & Offres de Prix</span>
              </h1>
              <p class="text-xs text-gray-500 font-medium">Discutez en direct et négociez vos offres avant consignation sous séquestre.</p>
            </div>
            <span class="px-3 py-1 rounded-full bg-emerald-50 text-[#008A45] border border-emerald-200 text-xs font-bold">
              🔒 Séquestre Actif
            </span>
          </div>

          <div class="bg-white rounded-3xl border border-[#E5E5E5] shadow-xs grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[540px]">
            
            <!-- LISTE DES CONVERSATIONS (COLONNE GAUCHE) -->
            <div class="md:col-span-4 border-r border-[#E5E5E5] p-3 space-y-2 bg-[#FBFBFB]">
              <div class="p-2">
                <input
                  type="text"
                  placeholder="Rechercher une discussion..."
                  class="w-full text-xs font-medium px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl outline-hidden focus:border-[#008A45]"
                />
              </div>

              <!-- Conversation 1 Active -->
              <div class="p-3 bg-white rounded-2xl border-2 border-[#008A45] shadow-xs space-y-1.5 cursor-pointer">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" class="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 class="text-xs font-bold text-[#111111]">Marlène Obame</h4>
                      <span class="text-[10px] text-gray-400">En ligne</span>
                    </div>
                  </div>
                  <span class="text-[10px] font-mono text-gray-400">14:32</span>
                </div>
                <div class="text-[11px] text-gray-600 truncate font-medium">
                  Article : iPhone 14 Pro Max 256GB
                </div>
                <div class="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-900 flex items-center gap-1">
                  <i data-lucide="sparkles" class="w-3 h-3 text-amber-600"></i>
                  <span>Offre en cours : 450 000 FCFA</span>
                </div>
              </div>

              <!-- Conversation 2 -->
              <div class="p-3 bg-white/70 hover:bg-white rounded-2xl border border-transparent hover:border-gray-200 transition space-y-1.5 cursor-pointer">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-700">
                      PA
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-[#111111]">Paul Alain (Libreville)</h4>
                      <span class="text-[10px] text-gray-400">Hier</span>
                    </div>
                  </div>
                </div>
                <div class="text-[11px] text-gray-600 truncate font-medium">
                  « Le colis est bien arrivé ! Tout est nickel. »
                </div>
              </div>
            </div>

            <!-- FENÊTRE DE DISCUSSION & NÉGOCIATION D'OFFRE (COLONNE DROITE) -->
            <div class="md:col-span-8 flex flex-col justify-between bg-white">
              
              <!-- En-tête de conversation -->
              <div class="p-4 border-b border-[#E5E5E5] flex items-center justify-between bg-[#FAFAFA]">
                <div class="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" class="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 class="text-xs font-black text-[#111111] flex items-center gap-1.5">
                      <span>Marlène Obame</span>
                      <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-[#008A45] text-[9px] font-black">Pass Pro</span>
                    </h3>
                    <span class="text-[10px] text-gray-500">iPhone 14 Pro Max 256GB • 520 000 FCFA</span>
                  </div>
                </div>

                <button onclick="window.navigate('/p/zrn-ip14')" class="text-[11px] font-bold text-[#008A45] hover:underline flex items-center gap-1">
                  <span>Voir la fiche</span>
                  <i data-lucide="external-link" class="w-3 h-3"></i>
                </button>
              </div>

              <!-- BANDEAU D'OFFRE NÉGOCIÉE ACTIVE -->
              <div class="m-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <i data-lucide="sparkles" class="w-4 h-4 text-amber-600"></i>
                    <div>
                      <span class="text-xs font-black italic uppercase text-amber-900">Proposition d'Offre Reçue</span>
                      <span class="text-[11px] text-amber-800 block">Prix initial : <del>520 000 FCFA</del> → <strong>Offre : 450 000 FCFA</strong> (-13%)</span>
                    </div>
                  </div>
                  <span class="px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                    En attente
                  </span>
                </div>

                <div class="flex items-center gap-2 pt-1">
                  <button onclick="window.showToast('✅ Offre de 450 000 FCFA acceptée ! Le lien de paiement séquestre est prêt.');" class="btn-action flex-1 py-2 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold rounded-xl shadow-xs">
                    Accepter l'offre
                  </button>
                  <button onclick="window.showToast('❌ Offre refusée.');" class="btn-action px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200">
                    Refuser
                  </button>
                  <button onclick="window.navigate('/checkout/prod_1')" class="btn-action px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1">
                    <i data-lucide="lock" class="w-3 h-3 text-[#008A45]"></i>
                    <span>Payer sous séquestre</span>
                  </button>
                </div>
              </div>

              <!-- FIL DE MESSAGES -->
              <div class="flex-1 p-4 space-y-3 overflow-y-auto max-h-[300px]">
                <div class="flex justify-start">
                  <div class="max-w-md p-3 rounded-2xl bg-gray-100 text-xs text-gray-800 space-y-1">
                    <p>Bonjour Marlène ! Votre iPhone 14 Pro Max m'intéresse beaucoup. Est-ce qu'une offre à 450 000 FCFA vous conviendrait avec paiement sous séquestre ZARÉN ?</p>
                    <span class="text-[9px] text-gray-400 block text-right font-mono">14:28</span>
                  </div>
                </div>

                <div class="flex justify-end">
                  <div class="max-w-md p-3 rounded-2xl bg-[#008A45] text-white text-xs space-y-1">
                    <p>Bonjour ! Oui, je valide votre proposition à 450 000 FCFA. Vous pouvez consigner le montant dès maintenant et je fais partir le coursier à Louis !</p>
                    <span class="text-[9px] text-emerald-200 block text-right font-mono">14:32</span>
                  </div>
                </div>
              </div>

              <!-- CHAMP D'ENVOI DE MESSAGE -->
              <div class="p-3 border-t border-[#E5E5E5] bg-[#FAFAFA] flex items-center gap-2">
                <input
                  id="chat-input"
                  type="text"
                  placeholder="Écrivez votre message ou contre-proposition..."
                  class="flex-1 text-xs font-medium px-4 py-3 bg-white border border-[#E5E5E5] rounded-2xl outline-hidden focus:border-[#008A45]"
                />
                <button onclick="
                  const inp = document.getElementById('chat-input');
                  if (inp && inp.value.trim()) {
                    window.showToast('✉️ Message envoyé');
                    inp.value = '';
                  }
                " class="btn-action px-5 py-3 bg-[#008A45] hover:bg-[#007339] text-white text-xs font-bold uppercase rounded-2xl flex items-center gap-1.5 shadow-sm">
                  <span>Envoyer</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                </button>
              </div>

            </div>

          </div>
        </div>
      \`;
    }

    window.setShopTab = function(tab) {
      window.store.shopActiveTab = tab;
      window.render();
    };

    window.promptReviewModal = function() {
      const comment = prompt("Votre commentaire d'expérience sous Séquestre :");
      if (comment) {
        if (!window.store.shopReviews) window.store.shopReviews = [];
        window.store.shopReviews.unshift({
          id: 'rev_' + Date.now(),
          buyerName: window.store.currentUser ? window.store.currentUser.fullName : 'Client Vérifié',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          rating: 5,
          date: 'À l\\'instant',
          productTitle: 'Commande Séquestre ZARÉN',
          comment: comment,
          verifiedEscrow: true
        });
        if (window.confetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
        window.showToast('🎉 Merci ! Votre avis vérifié a été publié.');
        window.render();
      }
    };

    window.handleShopBannerUpload = function(e) {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        if (!window.store.currentUser) window.store.currentUser = {};
        window.store.currentUser.shopBanner = url;
        const bannerImg = document.getElementById('set-shop-banner-img');
        if (bannerImg) bannerImg.src = url;
        window.showToast('📷 Bannière de boutique mise à jour');
      }
    };

    // =========================================================================
    // GESTION DES BOUTONS D'ACCÈS & MODALES D'AUTHENTIFICATION & OTP SMS
    // =========================================================================
    window.startSellingWithPhone = function() {
      const phoneInput = document.getElementById('hero-phone-input');
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      if (!window.store.currentUser) {
        if (phoneVal) {
          const regPhone = document.getElementById('reg-phone');
          if (regPhone) regPhone.value = phoneVal;
        }
        window.openRegisterModal();
      } else {
        window.navigate('/seller/new');
      }
    };

    window.openLoginModal = function() {
      const el = document.getElementById('login-modal-overlay');
      if (el) el.classList.remove('hidden');
    };

    window.closeLoginModal = function() {
      const el = document.getElementById('login-modal-overlay');
      if (el) el.classList.add('hidden');
    };

    window.openRegisterModal = function() {
      const el = document.getElementById('register-modal-overlay');
      if (el) el.classList.remove('hidden');
    };

    window.closeRegisterModal = function() {
      const el = document.getElementById('register-modal-overlay');
      if (el) el.classList.add('hidden');
    };

    window.openForgotPasswordModal = function() {
      const el = document.getElementById('forgot-modal-overlay');
      if (el) el.classList.remove('hidden');
    };

    window.closeForgotPasswordModal = function() {
      const el = document.getElementById('forgot-modal-overlay');
      if (el) el.classList.add('hidden');
    };

    window.setLoginAuthMode = function(mode) {
      const tabPwd = document.getElementById('tab-login-pwd');
      const tabOtp = document.getElementById('tab-login-otp');
      const formPwd = document.getElementById('login-form-password');
      const formOtp = document.getElementById('login-form-otp');

      if (mode === 'PASSWORD') {
        tabPwd.className = 'flex-1 py-1.5 rounded-lg bg-[#008A45] text-white transition';
        tabOtp.className = 'flex-1 py-1.5 rounded-lg text-gray-300 hover:text-white transition flex items-center justify-center gap-1';
        formPwd.classList.remove('hidden');
        formOtp.classList.add('hidden');
      } else {
        tabOtp.className = 'flex-1 py-1.5 rounded-lg bg-[#008A45] text-white transition flex items-center justify-center gap-1';
        tabPwd.className = 'flex-1 py-1.5 rounded-lg text-gray-300 hover:text-white transition';
        formOtp.classList.remove('hidden');
        formPwd.classList.add('hidden');
      }
    };

    window.submitLoginPassword = function() {
      const id = document.getElementById('login-identifier')?.value || 'marlene@zaren.ga';
      window.store.currentUser = {
        fullName: 'Marlène Obame',
        username: '@marlene_dressing',
        email: id.includes('@') ? id : 'marlene@zaren.ga',
        phone: id.includes('@') ? '+241 07 45 88 12' : id,
        plan: 'PRO',
        ratingAvg: 4.9,
        escrowBalance: 482000,
        city: 'Libreville'
      };
      window.closeLoginModal();
      window.showToast('✅ Connexion réussie ! Bienvenue sur ZARÉN.');
      window.render();
    };

    window.sendLoginOtp = function() {
      const phone = document.getElementById('login-otp-phone')?.value;
      if (!phone) {
        alert('Veuillez saisir votre numéro.');
        return;
      }
      document.getElementById('login-otp-step1')?.classList.add('hidden');
      document.getElementById('login-otp-step2')?.classList.remove('hidden');
      window.showToast('📲 Code OTP 742910 envoyé par SMS au ' + phone);
    };

    window.fillSimulatedLoginOtp = function() {
      const inp = document.getElementById('login-otp-input');
      if (inp) inp.value = '742910';
    };

    window.verifyLoginOtp = function() {
      const val = document.getElementById('login-otp-input')?.value;
      if (!val || val.length < 6) {
        alert('Veuillez saisir les 6 chiffres du code SMS.');
        return;
      }
      window.submitLoginPassword();
    };

    // Register flow
    window.setRegisterSelectedPlan = function(plan) {
      window.store.regPlan = plan;
      const proCard = document.getElementById('reg-plan-pro-card');
      const stdCard = document.getElementById('reg-plan-std-card');
      if (plan === 'PRO') {
        if (proCard) proCard.className = 'p-4 rounded-2xl border-2 border-[#008A45] bg-emerald-50/50 shadow-sm cursor-pointer transition relative';
        if (stdCard) stdCard.className = 'p-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 bg-white cursor-pointer transition';
      } else {
        if (stdCard) stdCard.className = 'p-4 rounded-2xl border-2 border-[#008A45] bg-emerald-50/50 shadow-sm cursor-pointer transition relative';
        if (proCard) proCard.className = 'p-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 bg-white cursor-pointer transition';
      }
    };

    window.setRegisterStep = function(step) {
      const s1 = document.getElementById('reg-step-1');
      const s2 = document.getElementById('reg-step-2');
      const s3 = document.getElementById('reg-step-3');
      const p1 = document.getElementById('reg-step-pill-1');
      const p2 = document.getElementById('reg-step-pill-2');
      const p3 = document.getElementById('reg-step-pill-3');

      [s1, s2, s3].forEach((el, idx) => {
        if (el) {
          if (idx + 1 === step) el.classList.remove('hidden');
          else el.classList.add('hidden');
        }
      });

      if (p1) p1.className = step === 1 ? 'px-3 py-1 rounded-full bg-[#008A45] text-white' : 'px-3 py-1 rounded-full bg-white/10 text-gray-400';
      if (p2) p2.className = step === 2 ? 'px-3 py-1 rounded-full bg-[#008A45] text-white' : 'px-3 py-1 rounded-full bg-white/10 text-gray-400';
      if (p3) p3.className = step === 3 ? 'px-3 py-1 rounded-full bg-[#008A45] text-white' : 'px-3 py-1 rounded-full bg-white/10 text-gray-400';
    };

    window.submitRegisterStep2 = function() {
      const name = document.getElementById('reg-name')?.value;
      const email = document.getElementById('reg-email')?.value;
      const phone = document.getElementById('reg-phone')?.value;

      if (!name || !email || !phone) {
        alert('Veuillez remplir votre nom, email et numéro de téléphone.');
        return;
      }
      window.setRegisterStep(3);
      window.showToast('📲 Code OTP 742910 envoyé par SMS au ' + phone);
    };

    window.fillSimulatedRegisterOtp = function() {
      const inp = document.getElementById('reg-otp-input');
      if (inp) inp.value = '742910';
    };

    window.verifyRegisterOtp = function() {
      const name = document.getElementById('reg-name')?.value || 'Nouveau Vendeur';
      const email = document.getElementById('reg-email')?.value || 'vendeur@zaren.ga';
      const phone = document.getElementById('reg-phone')?.value || '+241 07 45 88 12';
      const plan = window.store.regPlan || 'STANDARD';

      window.store.currentUser = {
        fullName: name,
        username: '@' + name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        email: email,
        phone: phone,
        plan: plan,
        ratingAvg: 5.0,
        ratingCount: 1,
        escrowBalance: 0,
        city: 'Libreville'
      };

      window.closeRegisterModal();
      if (window.confetti) confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      window.showToast('🎉 Compte ZARÉN créé avec succès ! Identité confirmée.');
      window.render();
    };

    // Forgot password flow
    window.sendForgotOtp = function() {
      const id = document.getElementById('forgot-identifier')?.value;
      if (!id) {
        alert('Veuillez saisir votre email ou numéro.');
        return;
      }
      document.getElementById('forgot-step-1')?.classList.add('hidden');
      document.getElementById('forgot-step-2')?.classList.remove('hidden');
      window.showToast('📲 Code OTP de réinitialisation 742910 envoyé par SMS.');
    };

    window.fillSimulatedForgotOtp = function() {
      const inp = document.getElementById('forgot-otp-input');
      if (inp) inp.value = '742910';
    };

    window.submitNewPassword = function() {
      const otp = document.getElementById('forgot-otp-input')?.value;
      const pwd = document.getElementById('forgot-new-pwd')?.value;
      if (!otp || !pwd) {
        alert('Veuillez saisir le code OTP et votre nouveau mot de passe.');
        return;
      }
      window.closeForgotPasswordModal();
      window.submitLoginPassword();
      window.showToast('🔒 Mot de passe mis à jour ! Vous êtes connecté.');
    };

    // Auto-exécuter
    window.renderCategoryPills();
    window.render();
  </script>
</body>
</html>`;
}
