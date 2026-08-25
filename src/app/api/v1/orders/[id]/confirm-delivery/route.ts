import { NextResponse } from 'next/server';
import { zarenStore } from '@/db/store';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const { rating, comment } = body;

    const updated = zarenStore.updateOrderStatus(params.id, 'COMPLETED');

    if (rating && updated.sellerId) {
      zarenStore.addReview({
        orderId: updated.id,
        authorId: updated.buyerId,
        authorName: updated.deliveryAddress.fullName || updated.deliveryAddress.phone,
        targetSellerId: updated.sellerId,
        rating: Number(rating),
        comment: comment || 'Article validé et reçu en bon état.',
        productTitle: updated.product?.title || 'Commande ZARÉN Séquestre',
        verifiedPurchase: true,
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
