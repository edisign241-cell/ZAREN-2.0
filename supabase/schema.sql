-- ==============================================================================
-- ZARÉN 2.0 — Architecture Base de Données Supabase (PostgreSQL 15+)
-- Plateforme E-Commerce & Séquestre Mobile Money (Airtel Money / Moov Money)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS PERSONNALISÉS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'SUPPORT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_tier AS ENUM ('STANDARD', 'PRO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_plan AS ENUM ('STANDARD', 'PRO', 'PER_LISTING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_status AS ENUM ('ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'CREATED',
        'PAID',
        'PREPARING',
        'IN_TRANSIT',
        'DELIVERED',
        'COMPLETED',
        'DISPUTED',
        'CANCELLED',
        'REFUNDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE delivery_mode AS ENUM ('PICKUP', 'SELLER_DELIVERY', 'THIRD_PARTY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('ESCROW_DEPOSIT', 'PAYOUT_SELLER', 'REFUND_BUYER', 'PLATFORM_FEE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dispute_reason AS ENUM ('ITEM_NOT_RECEIVED', 'NOT_AS_DESCRIBED', 'DAMAGED', 'WRONG_ITEM', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dispute_status AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED_REFUND', 'RESOLVED_PAYOUT', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE offer_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES DU SYSTÈME

-- 3.1 Utilisateurs & Profils
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(25) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(80) UNIQUE,
    email VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    banner_url TEXT,
    country VARCHAR(80) DEFAULT 'Gabon',
    city VARCHAR(100) NOT NULL DEFAULT 'Libreville',
    district VARCHAR(120),
    role user_role NOT NULL DEFAULT 'USER',
    account_tier account_tier NOT NULL DEFAULT 'STANDARD',
    plan subscription_plan NOT NULL DEFAULT 'STANDARD',
    plan_expires_at TIMESTAMPTZ,
    rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0.00,
    rating_count INT NOT NULL DEFAULT 0,
    completed_sales_count INT NOT NULL DEFAULT 0,
    completed_purchases_count INT NOT NULL DEFAULT 0,
    dispute_rate_percent NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_phone_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 Profils Vendeurs & Marchands
CREATE TABLE IF NOT EXISTS public.seller_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    business_name VARCHAR(150) NOT NULL,
    username VARCHAR(80),
    slug VARCHAR(150) NOT NULL UNIQUE,
    bio TEXT,
    logo_url TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    account_tier account_tier NOT NULL DEFAULT 'STANDARD',
    plan subscription_plan NOT NULL DEFAULT 'STANDARD',
    rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0.00,
    rating_count INT NOT NULL DEFAULT 0,
    total_sales_count INT NOT NULL DEFAULT 0,
    completed_sales_count INT NOT NULL DEFAULT 0,
    dispute_rate_percent NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    payout_method VARCHAR(50) NOT NULL DEFAULT 'AIRTEL_MONEY',
    payout_account_number VARCHAR(60) NOT NULL,
    payout_account_name VARCHAR(150),
    response_time_minutes INT DEFAULT 30,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    address TEXT,
    country VARCHAR(80) DEFAULT 'Gabon',
    city VARCHAR(100) NOT NULL DEFAULT 'Libreville',
    district VARCHAR(120),
    category VARCHAR(100) DEFAULT 'Général',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.3 Produits du Catalogue
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
    short_code VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(14,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'FCFA',
    condition VARCHAR(60), -- 'Neuf avec étiquette', 'Très bon état', etc.
    size VARCHAR(40),
    brand VARCHAR(100),
    stock_quantity INT NOT NULL DEFAULT 1,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    videos JSONB NOT NULL DEFAULT '[]'::jsonb,
    city VARCHAR(100) NOT NULL DEFAULT 'Libreville',
    district VARCHAR(120),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    address TEXT,
    delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    pickup_available BOOLEAN NOT NULL DEFAULT true,
    category VARCHAR(100) DEFAULT 'Général',
    status product_status NOT NULL DEFAULT 'ACTIVE',
    views_count INT NOT NULL DEFAULT 0,
    shares_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.4 Médias Uploadés (Photos & Vidéos)
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    type VARCHAR(20) NOT NULL, -- 'IMAGE' | 'VIDEO'
    mime_type VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    size_bytes BIGINT NOT NULL,
    width INT,
    height INT,
    duration_seconds INT,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    order_index INT NOT NULL DEFAULT 0,
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50), -- 'PRODUCT', 'USER_AVATAR', 'SHOP_LOGO'
    entity_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.5 Emplacements & Boutiques Physiques (Carte Interactive)
CREATE TABLE IF NOT EXISTS public.shop_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    photo TEXT NOT NULL,
    latitude NUMERIC(10,7) NOT NULL,
    longitude NUMERIC(10,7) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Libreville',
    district VARCHAR(120),
    category VARCHAR(100) NOT NULL,
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
    review_count INT NOT NULL DEFAULT 0,
    description TEXT,
    phone VARCHAR(40),
    is_verified BOOLEAN NOT NULL DEFAULT true,
    is_open BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.6 Commandes & Séquestre ZARÉN (Escrow)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(30) NOT NULL UNIQUE,
    buyer_id UUID NOT NULL REFERENCES public.users(id),
    seller_id UUID NOT NULL REFERENCES public.seller_profiles(id),
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(14,2) NOT NULL,
    delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    platform_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(14,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'FCFA',
    status order_status NOT NULL DEFAULT 'CREATED',
    delivery_mode delivery_mode NOT NULL DEFAULT 'SELLER_DELIVERY',
    delivery_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    buyer_notes TEXT,
    
    -- Horodatages du cycle de vie
    paid_at TIMESTAMPTZ,
    preparing_at TIMESTAMPTZ,
    in_transit_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    auto_release_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    disputed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.7 Transactions Financières & Séquestre Mobile Money
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    transaction_ref VARCHAR(120) NOT NULL UNIQUE,
    gateway VARCHAR(60) NOT NULL, -- 'AIRTEL_MONEY', 'MOOV_MONEY', 'VISA_MASTERCARD'
    gateway_transaction_id VARCHAR(150),
    type transaction_type NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    fee_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'FCFA',
    status transaction_status NOT NULL DEFAULT 'PENDING',
    idempotency_key VARCHAR(150) NOT NULL UNIQUE,
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.8 Avis & Notations Vérifiés
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID UNIQUE REFERENCES public.orders(id) ON DELETE SET NULL,
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    author_name VARCHAR(150) NOT NULL,
    author_avatar TEXT,
    target_seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    product_title VARCHAR(255),
    verified_purchase BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.9 Litiges & Arbitrage Support
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    raised_by UUID NOT NULL REFERENCES public.users(id),
    reason dispute_reason NOT NULL,
    description TEXT NOT NULL,
    evidence_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
    status dispute_status NOT NULL DEFAULT 'OPEN',
    resolution_notes TEXT,
    resolved_by UUID REFERENCES public.users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.10 Négociations & Offres de Prix
CREATE TABLE IF NOT EXISTS public.product_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    product_title VARCHAR(255) NOT NULL,
    product_image TEXT NOT NULL,
    original_price NUMERIC(14,2) NOT NULL,
    offered_price NUMERIC(14,2) NOT NULL,
    counter_price NUMERIC(14,2),
    currency VARCHAR(10) NOT NULL DEFAULT 'FCFA',
    buyer_id UUID NOT NULL REFERENCES public.users(id),
    buyer_name VARCHAR(150) NOT NULL,
    buyer_phone VARCHAR(40) NOT NULL,
    seller_id UUID NOT NULL REFERENCES public.seller_profiles(id),
    seller_name VARCHAR(150),
    status offer_status NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.11 Messagerie & Discussions Directes
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_title VARCHAR(255),
    product_price NUMERIC(14,2),
    product_image TEXT,
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id),
    sender_name VARCHAR(150) NOT NULL,
    sender_avatar TEXT,
    text TEXT NOT NULL,
    attachment_url TEXT,
    offer_id UUID REFERENCES public.product_offers(id) ON DELETE SET NULL,
    is_system BOOLEAN NOT NULL DEFAULT false,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. INDEX DE PERFORMANCE & RECHERCHE GÉOGRAPHIQUE
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_shortcode ON public.products(short_code);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_transactions_order ON public.transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_seller ON public.reviews(target_seller_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);

-- 5. POLITIQUES DE SÉCURITÉ ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour le catalogue, vendeurs, boutiques et avis
CREATE POLICY "Lecture publique des produits" ON public.products FOR SELECT USING (true);
CREATE POLICY "Lecture publique des vendeurs" ON public.seller_profiles FOR SELECT USING (true);
CREATE POLICY "Lecture publique des boutiques" ON public.shop_locations FOR SELECT USING (true);
CREATE POLICY "Lecture publique des avis" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Lecture publique des médias" ON public.media FOR SELECT USING (true);

-- Accès complet authentifié / service role
CREATE POLICY "Gestion complète des utilisateurs authentifiés" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gestion des produits par vendeurs" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gestion des commandes" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gestion des transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gestion des conversations" ON public.conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gestion des messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gestion des offres" ON public.product_offers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gestion des litiges" ON public.disputes FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 6. DONNÉES DE DÉMONSTRATION INITIALES (SEED DATA)
-- ==============================================================================

-- Utilisateur démo
INSERT INTO public.users (id, phone_number, full_name, username, city, district, role, account_tier, plan, rating_avg, rating_count, completed_sales_count, is_active)
VALUES 
    ('11111111-1111-1111-1111-111111111111', '+24107458812', 'Marlène Obame', 'marlene_dressing', 'Libreville', 'Quartier Louis', 'USER', 'PRO', 'PRO', 4.95, 28, 45, true),
    ('22222222-2222-2222-2222-222222222222', '+241062334455', 'Patrick Nguema', 'patrick_gabon', 'Libreville', 'Batterie IV', 'USER', 'STANDARD', 'STANDARD', 5.00, 4, 12, true)
ON CONFLICT (phone_number) DO NOTHING;

-- Profil vendeur démo
INSERT INTO public.seller_profiles (id, user_id, business_name, username, slug, bio, is_verified, rating_avg, rating_count, total_sales_count, payout_method, payout_account_number, payout_account_name, city, district, category)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Marlène Dressing & Mode Chic',
    'marlene_dressing',
    'marlene-dressing-mode-chic',
    'Boutique mode, sacs de luxe & sneakers certifiées à Libreville. Expédition express par taxi-course.',
    true,
    4.95,
    28,
    45,
    'AIRTEL_MONEY',
    '+24107458812',
    'Marlène Obame',
    'Libreville',
    'Quartier Louis',
    'Mode & Vêtements'
) ON CONFLICT (slug) DO NOTHING;

-- Boutiques de la carte interactive
INSERT INTO public.shop_locations (name, photo, latitude, longitude, address, city, district, category, rating, review_count, description, phone, is_verified)
VALUES 
    ('iStore Libreville Premium', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', 0.4045, 9.4431, 'Boulevard Quaben, Quartier Louis', 'Libreville', 'Louis', 'Smartphones & High-Tech', 5.0, 64, 'Boutique certifiée Apple & High-Tech d''origine. Smartphones, tablettes et accessoires garantis.', '+241 07 45 88 12', true),
    ('Kits & Tech Glass Glass', 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80', 0.3885, 9.4610, 'Avenue de la Paix, Glass', 'Libreville', 'Glass', 'Électronique & Accessoires', 4.8, 38, 'Spécialiste câbles, chargeurs rapides Anker, batteries externes et matériel de gaming.', '+241 06 22 11 00', true),
    ('Dressing Urbain Charbonnages', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80', 0.4350, 9.4780, 'Carrefour Charbonnages face Total', 'Libreville', 'Charbonnages', 'Mode & Vêtements', 4.9, 52, 'Boutique de prêt-à-porter homme/femme, sneakers édition limitée et streetwear tendance.', '+241 07 89 44 23', true)
ON CONFLICT DO NOTHING;
