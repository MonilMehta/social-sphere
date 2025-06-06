import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToS3 } from '@/lib/aws';

export async function POST(request: NextRequest) {  try {
    console.log('Starting profile image upload...');
    
    // Check if AWS is properly configured
    const requiredEnvVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET_NAME'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      if (missingVars.length > 0) {
      console.error('AWS configuration incomplete:', missingVars);
      return NextResponse.json(
        { 
          success: false, 
          message: `AWS configuration incomplete. Missing: ${missingVars.join(', ')}` 
        },
        { status: 500 }
      );
    }

    console.log('AWS configuration OK');

    const formData = await request.formData();
    const file = formData.get('file') as File;
      if (!file) {
      console.error('No file provided in formData');
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );    }

    console.log('File received:', { name: file.name, size: file.size, type: file.type });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          message: `File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB` 
        },
        { status: 400 }
      );    }    console.log('File validation passed, uploading to S3...');

    // Upload to S3 in the 'profile-pics' folder
    const uploadResult = await uploadImageToS3(file, 'profile-pics');

    console.log('Upload successful:', uploadResult);

    return NextResponse.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        url: uploadResult.url,
        key: uploadResult.key,
      },
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to upload image' 
      },
      { status: 500 }
    );
  }
}
