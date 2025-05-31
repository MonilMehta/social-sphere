import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if AWS environment variables are configured
    const requiredEnvVars = [
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY', 
      'AWS_REGION',
      'AWS_S3_BUCKET_NAME'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'AWS configuration incomplete',
        missingVariables: missingVars
      }, { status: 500 });
    }

    // Test AWS SDK import
    try {
      const AWS = require('aws-sdk');
      
      // Test S3 configuration
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      });

      // Test bucket access (list objects with limit 1)
      await s3.listObjectsV2({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        MaxKeys: 1
      }).promise();

      return NextResponse.json({
        success: true,
        message: 'AWS S3 configuration is working correctly',
        config: {
          region: process.env.AWS_REGION,
          bucket: process.env.AWS_S3_BUCKET_NAME,
          hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
          hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
        }
      });

    } catch (awsError: any) {
      return NextResponse.json({
        success: false,
        message: 'AWS connection failed',
        error: awsError.message
      }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Server error during AWS test',
      error: error.message
    }, { status: 500 });
  }
}
