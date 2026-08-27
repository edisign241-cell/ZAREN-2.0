-- ==============================================================================
-- ZARÉN 2.0 — Architecture Base de Données Supabase & PostgreSQL 15+
-- Plateforme E-Commerce, Séquestre Mobile Money & Gestion des Profils Utilisateurs
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
    CREATE TYPE account_tier AS ENUM ('BUYER', 'STANDARD', 'PRO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_plan AS ENUM ('FREE', 'STANDARD', 'PRO', 'PER_LISTING');
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

-- ==============================================================================
-- 3. TABLES OFFICIELLES DU SYSTÈME ZARÉN
-- ==============================================================================

-- 3.1 Utilisateurs & Authentification
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    phone_number VARCHAR(35) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(80) UNIQUE,
    email VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    banner_url TEXT,
    country VARCHAR(80) DEFAULT 'Gabon',
    city VARCHAR(100) NOT NULL DEFAULT 'Libreville',
    district VARCHAR(120) DEFAULT 'Centre',
    role VARCHAR(30) NOT NULL DEFAULT 'USER',
    account_tier VARCHAR(30) NOT NULL DEFAULT 'STANDARD',
    plan VARCHAR(30) NOT NULL DEFAULT 'STANDARD',
    plan_expires_at TIMESTAMPTZ,
    rating_avg NUMERIC(3,2) NOT NULL DEFAULT 5.00,
    rating_count INT NOT NULL DEFAULT 0,
    completed_sales_count INT NOT NULL DEFAULT 0,
    completed_purchases_count INT NOT NULL DEFAULT 0,
    dispute_rate_percent NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_phone_verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 Sessions & Tokens d'Authentification Sécurisés
CREATE TABLE IF NOT EXISTS public.user_tokens (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_identifier VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(50),
    is_valid BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '365 days'
);

-- 3.3 Profils Vendeurs & Marchands
CREATE TABLE IF NOT EXISTS public.seller_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    business_name VARCHAR(150) NOT NULL,
    username VARCHAR(80),
    slug VARCHAR(150) NOT NULL UNIQUE,
    bio TEXT,
    logo_url TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    account_tier VARCHAR(30) NOT NULL DEFAULT 'STANDARD',
    plan VARCHAR(30) NOT NULL DEFAULT 'STANDARD',
    rating_avg NUMERIC(3,2) NOT NULL DEFAULT 5.00,
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
    district VARCHAR(120) DEFAULT 'Centre',
    category VARCHAR(100) DEFAULT 'Général',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.4 Produits du Catalogue
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL,
    short_code VARCHAR(30) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(14,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'FCFA',
    condition VARCHAR(60) DEFAULT 'Très bon état',
    size VARCHAR(40),
    brand VARCHAR(100),
    stock_quantity INT NOT NULL DEFAULT 1,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    videos JSONB NOT NULL DEFAULT '[]'::jsonb,
    city VARCHAR(100) NOT NULL DEFAULT 'Libreville',
    district VARCHAR(120) DEFAULT 'Centre',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    address TEXT,
    delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    pickup_available BOOLEAN NOT NULL DEFAULT true,
    category VARCHAR(100) DEFAULT 'Général',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    views_count INT NOT NULL DEFAULT 0,
    shares_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.5 Commandes & Séquestre ZARÉN (Escrow)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number VARCHAR(40) NOT NULL UNIQUE,
    buyer_id TEXT NOT NULL,
    seller_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(14,2) NOT NULL,
    delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    platform_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(14,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'FCFA',
    status VARCHAR(30) NOT NULL DEFAULT 'PAID',
    delivery_mode VARCHAR(40) NOT NULL DEFAULT 'SELLER_DELIVERY',
    delivery_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    buyer_notes TEXT,
    
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

-- 3.6 Transactions Financières
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    transaction_ref VARCHAR(120) NOT NULL UNIQUE,
    gateway VARCHAR(60) NOT NULL, -- 'AIRTEL_MONEY', 'MOOV_MONEY', 'CASH_ON_DELIVERY', 'WAVE'
    gateway_transaction_id VARCHAR(150),
    type VARCHAR(40) NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    fee_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'FCFA',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    idempotency_key VARCHAR(150) NOT NULL UNIQUE,
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.7 Avis & Notations Vérifiés
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    author_id TEXT NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    author_avatar TEXT,
    target_seller_id TEXT NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    product_title VARCHAR(255),
    verified_purchase BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.8 Litiges & Arbitrage Tiers de Confiance
CREATE TABLE IF NOT EXISTS public.disputes (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    raised_by TEXT NOT NULL,
    reason VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    evidence_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(40) NOT NULL DEFAULT 'OPEN',
    resolution_notes TEXT,
    resolved_by TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.9 Campagnes Publicitaires Partenaires
CREATE TABLE IF NOT EXISTS public.partner_ads (
    id TEXT PRIMARY KEY,
    partner_name VARCHAR(150) NOT NULL,
    title VARCHAR(255) NOT NULL,
    tagline TEXT NOT NULL,
    media_url TEXT NOT NULL,
    media_type VARCHAR(20) NOT NULL DEFAULT 'IMAGE',
    target_url TEXT NOT NULL,
    cta_text VARCHAR(80) NOT NULL DEFAULT 'En savoir plus',
    tier VARCHAR(30) NOT NULL DEFAULT 'GOLD',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    city VARCHAR(100) DEFAULT 'Libreville',
    country VARCHAR(80) DEFAULT 'Gabon',
    views_count INT NOT NULL DEFAULT 0,
    clicks_count INT NOT NULL DEFAULT 0,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. INDEX DE PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_user_tokens_user ON public.user_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_shortcode ON public.products(short_code);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_seller ON public.reviews(target_seller_id);
CREATE INDEX IF NOT EXISTS idx_disputes_order ON public.disputes(order_id);
CREATE INDEX IF NOT EXISTS idx_partner_ads_status ON public.partner_ads(status);

-- ==============================================================================
-- 5. POLITIQUES DE SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_ads ENABLE ROW LEVEL SECURITY;

-- Autorisations d'accès public et synchronisation
CREATE POLICY "Acces public lecture users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Acces public ecriture users" ON public.users FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Acces tokens" ON public.user_tokens FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces public seller_profiles" ON public.seller_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces public products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces public orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces public transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces public reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces public disputes" ON public.disputes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces public partner_ads" ON public.partner_ads FOR ALL USING (true) WITH CHECK (true);
