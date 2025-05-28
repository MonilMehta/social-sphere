import { NextRequest, NextResponse } from 'next/server';
import { uploadMultipleImagesToS3 } from '@/lib/aws';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const folder = formData.get('folder') as string || 'posts';
    
    // Get all files from the 'images' field
    const files = formData.getAll('images') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        );
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'Each file must be less than 5MB' },
          { status: 400 }
        );
      }
    }

    // Upload all images to S3 in one batch
    const uploadResults = await uploadMultipleImagesToS3(files, folder);
    const urls = uploadResults.map(result => result.url);

    return NextResponse.json({
      success: true,
      data: { 
        urls,
        count: urls.length 
      },
      message: `${urls.length} images uploaded successfully`
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
