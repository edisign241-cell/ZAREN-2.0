import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#008A45',
};

export const metadata: Metadata = {
  title: 'ZARÉN — Vendez et achetez en toute sécurité, sans boutique',
  description: 'Publiez votre article en 30 secondes, partagez le lien sur WhatsApp. L\'argent est sécurisé par séquestre jusqu\'à la livraison.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'ZARÉN — Le commerce social sécurisé par séquestre',
    description: 'Vendez et achetez en toute sécurité. Les fonds restent sous séquestre jusqu\'à confirmation de conformité du colis.',
    type: 'website',
  },
};

import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth bg-[#F8F8F8]">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#F8F8F8] text-[#111111] antialiased selection:bg-[#008A45] selection:text-white`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
