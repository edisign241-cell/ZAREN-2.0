import { NextResponse } from 'next/server';
import { zarenStore } from '@/db/store';

export async function GET() {
  const orders = zarenStore.getOrders();
  return NextResponse.json({ success: true, data: orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, buyerName, buyerPhone, city, district, deliveryMode, buyerNotes, quantity } = body;

    if (!productId || !buyerName || !buyerPhone) {
      return NextResponse.json({ success: false, error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    const newOrder = zarenStore.createOrder({
      productId,
      buyerName,
      buyerPhone,
      city: city || 'Abidjan',
      district: district || '',
      deliveryMode: deliveryMode || 'SELLER_DELIVERY',
      buyerNotes,
      quantity: Number(quantity) || 1,
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
