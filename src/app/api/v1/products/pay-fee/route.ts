import { NextRequest, NextResponse } from 'next/server';
import { publicationPaymentSchema } from '@/lib/validations/product';
import { zarenStore } from '@/db/store';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = publicationPaymentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Données de paiement invalides',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { productId, amount, paymentMethod, phoneNumber } = validation.data;

    // Simulation de validation de paiement Mobile Money instantané
    const updated = zarenStore.updateProductStatus(productId, 'ACTIVE');

    // Mise à jour Supabase si configuré
    try {
      await supabase
        .from('products')
        .update({ status: 'ACTIVE' })
        .eq('id', productId);
    } catch (e) {}

    return NextResponse.json({
      success: true,
      status: 'PUBLISHED',
      transactionRef: `tx_fee_${Date.now()}`,
      message: `Paiement de ${amount} FCFA confirmé via ${paymentMethod} (${phoneNumber}). L'article est désormais en ligne sur le Grand Marché ZARÉN !`,
      product: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors du paiement' },
      { status: 500 }
    );
  }
}
