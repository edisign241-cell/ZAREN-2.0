import { NextResponse } from 'next/server';
import { zarenStore } from '@/db/store';
import { generateShortCode } from '@/lib/utils';

export async function GET() {
  const products = zarenStore.getProducts();
  return NextResponse.json({ success: true, data: products });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, stockQuantity, images, city, district, deliveryFee, pickupAvailable } = body;

    if (!title || !price) {
      return NextResponse.json({ success: false, error: 'Titre et prix requis' }, { status: 400 });
    }

    const seller = zarenStore.getSellerProfile();
    const shortCode = `zrn-${generateShortCode(4).toLowerCase()}`;

    const newProduct = zarenStore.addProduct({
      sellerId: seller.id,
      shortCode,
      title,
      description: description || '',
      price: Number(price),
      currency: 'XOF',
      stockQuantity: Number(stockQuantity) || 1,
      images: images || [],
      city: city || 'Abidjan',
      district: district || '',
      deliveryFee: Number(deliveryFee) || 0,
      pickupAvailable: pickupAvailable ?? true,
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
