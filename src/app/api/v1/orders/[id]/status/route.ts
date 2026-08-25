import { NextResponse } from 'next/server';
import { zarenStore } from '@/db/store';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, reason } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: 'Statut requis' }, { status: 400 });
    }

    const updated = zarenStore.updateOrderStatus(params.id, status, reason);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
