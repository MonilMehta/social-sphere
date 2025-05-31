import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToS3 } from '@/lib/aws';

export async function POST(request: NextRequest) {
  try {
    // Check if AWS is properly configured
    const requiredEnvVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET_NAME'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `AWS configuration incomplete. Missing: ${missingVars.join(', ')}` 
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('profilepic') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

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
      );
    }

    // Upload to S3 in the 'profile-pics' folder
    const uploadResult = await uploadImageToS3(file, 'profile-pics');

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
