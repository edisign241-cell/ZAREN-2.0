import { NextRequest, NextResponse } from 'next/server';
import { storageService, validateUploadedFile } from '@/lib/storage/storageAdapter';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      // Vérifier si un seul fichier "file" a été envoyé
      const singleFile = formData.get('file') as File | null;
      if (singleFile) {
        files.push(singleFile);
      } else {
        return NextResponse.json(
          { error: 'Aucun fichier fourni dans la requête.' },
          { status: 400 }
        );
      }
    }

    const uploadedMedia = [];
    const errors = [];

    for (const file of files) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const validation = validateUploadedFile(file.name, file.type, buffer.length);
        if (!validation.isValid) {
          errors.push({ fileName: file.name, error: validation.error });
          continue;
        }

        const mediaItem = await storageService.saveFile(buffer, file.name, file.type);
        uploadedMedia.push(mediaItem);
      } catch (err: any) {
        errors.push({ fileName: file.name, error: err.message || 'Erreur d\'écriture' });
      }
    }

    return NextResponse.json({
      success: true,
      media: uploadedMedia,
      errors: errors.length > 0 ? errors : undefined,
      count: uploadedMedia.length
    });
  } catch (error: any) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du téléversement.' },
      { status: 500 }
    );
  }
}
