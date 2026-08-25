import { NextResponse } from 'next/server';
import { zarenStore } from '@/db/store';

export async function POST(
  request: Request,
  { params }: { params: { gateway: string } }
) {
  try {
    const payload = await request.json();
    const { orderId, status, transactionId, signature } = payload;

    // 1. Vérification de la signature du webhook (Wave, Orange, MTN)
    // const isValid = verifyGatewaySignature(signature, payload, process.env.GATEWAY_WEBHOOK_SECRET);
    
    // 2. Traitement idempotent
    if (status === 'SUCCESS' && orderId) {
      const order = zarenStore.getOrderById(orderId);
      if (order && order.status === 'CREATED') {
        zarenStore.updateOrderStatus(orderId, 'PAID');
      }
    }

    return NextResponse.json({ received: true, gateway: params.gateway });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
