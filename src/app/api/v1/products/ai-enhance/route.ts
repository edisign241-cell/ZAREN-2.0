import { NextResponse } from 'next/server';
import { generateProductCopy } from '@/lib/ai/geminiCopywriter';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, keywords, price } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: 'Titre requis' }, { status: 400 });
    }

    const result = await generateProductCopy(title, keywords || '', price);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
