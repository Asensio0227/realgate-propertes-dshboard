import { getAuthUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// ─── POST /api/upload ─────────────────────────────────────────────────────────
// Accepts multipart/form-data with one or more files under the key "files".
// Returns an array of Cloudinary secure_url strings.
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const cloudName = process.env.CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET; // unsigned preset

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        { success: false, message: 'Cloudinary is not configured' },
        { status: 500 },
      );
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files.length) {
      return NextResponse.json(
        { success: false, message: 'No files provided' },
        { status: 400 },
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { success: false, message: 'Maximum 10 images per upload' },
        { status: 400 },
      );
    }

    // Upload each file to Cloudinary in parallel
    const uploads = await Promise.all(
      files.map(async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', uploadPreset);
        fd.append('folder', 'realgate/properties');

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: fd },
        );
        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error?.message ?? 'Cloudinary upload failed');
        }

        return data.secure_url as string;
      }),
    );

    return NextResponse.json({ success: true, urls: uploads });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    console.error('[POST /api/upload]', err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
