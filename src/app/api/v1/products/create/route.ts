import { NextRequest, NextResponse } from 'next/server';
import { productCreationSchema } from '@/lib/validations/product';
import { zarenStore } from '@/db/store';
import { generateShortCode } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = productCreationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Données invalides',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    const seller = zarenStore.getSellerProfile();
    const shortCode = `zrn-${generateShortCode(4).toLowerCase()}`;

    // Règle métier : Vendeur Pro -> Publication directe ACTIVE. Vendeur Standard -> PAYMENT_PENDING (500 FCFA)
    const isPro = data.accountTier === 'PRO';
    const initialStatus = isPro ? 'ACTIVE' : 'OUT_OF_STOCK'; // OUT_OF_STOCK / DRAFT tant que 500 FCFA non payé

    const product = zarenStore.addProduct({
      sellerId: seller.id,
      shortCode,
      title: data.title,
      description: data.description,
      price: data.price,
      currency: data.currency,
      stockQuantity: data.stockQuantity,
      images: data.images,
      city: data.city,
      district: data.district,
      deliveryFee: data.deliveryFee,
      pickupAvailable: data.pickupAvailable,
      category: data.category,
      condition: data.condition,
      size: data.size,
      status: initialStatus,
    });

    // Insertion optionnelle dans Supabase si configuré
    try {
      await supabase.from('products').insert({
        seller_id: seller.id,
        short_code: shortCode,
        title: data.title,
        description: data.description,
        price: data.price,
        currency: data.currency,
        stock_quantity: data.stockQuantity,
        images: data.images,
        city: data.city,
        district: data.district,
        delivery_fee: data.deliveryFee,
        pickup_available: data.pickupAvailable,
        status: isPro ? 'ACTIVE' : 'OUT_OF_STOCK',
      });
    } catch (e) {
      console.warn('Supabase product insert warning:', e);
    }

    if (!isPro) {
      return NextResponse.json({
        success: true,
        status: 'PAYMENT_PENDING',
        feeAmount: 500,
        currency: 'FCFA',
        message: 'Paiement de 500 FCFA requis pour activer la publication.',
        product,
      });
    }

    return NextResponse.json({
      success: true,
      status: 'ACTIVE',
      message: 'Article publié directement avec votre Pass Pro.',
      product,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
