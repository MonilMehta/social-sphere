# AWS S3 Setup for Profile Image Uploads

This guide explains how to set up AWS S3 for profile image uploads in the Social Sphere application.

## Prerequisites

1. An AWS account
2. Basic knowledge of AWS S3 and IAM

## Step 1: Create an S3 Bucket

1. Log in to your AWS Console
2. Navigate to S3 service
3. Click "Create bucket"
4. Enter bucket name: `socialflow-storage` (or your preferred name)
5. Select your preferred region (e.g., `us-east-1`)
6. Configure the following settings:
   - **Block Public Access**: Uncheck "Block all public access" (we need public read access for profile images)
   - **Bucket Versioning**: Enable (optional but recommended)
   - **Server-side encryption**: Enable with Amazon S3 managed keys (SSE-S3)

## Step 2: Configure Bucket Policy

Add the following bucket policy to allow public read access to uploaded images:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::socialflow-storage/*"
        }
    ]
}
```

Replace `socialflow-storage` with your actual bucket name.

## Step 3: Create IAM User

1. Navigate to IAM service in AWS Console
2. Click "Users" → "Add user"
3. Enter username: `socialflow-s3-user`
4. Select "Programmatic access"
5. Click "Next: Permissions"

## Step 4: Create IAM Policy

1. Click "Attach existing policies directly"
2. Click "Create policy"
3. Use the JSON editor and paste:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::socialflow-storage/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::socialflow-storage"
        }
    ]
}
```

4. Name the policy: `SocialFlowS3Policy`
5. Attach this policy to your user

## Step 5: Get Access Keys

1. After creating the user, save the Access Key ID and Secret Access Key
2. **Important**: Store these securely and never commit them to version control

## Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Update the following variables:

```env
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=socialflow-storage
```

## Step 7: Update Next.js Configuration

The `next.config.ts` file is already configured to allow images from AWS S3. If you use a different bucket name, update the hostname patterns:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-bucket-name.s3.amazonaws.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: '*.amazonaws.com',
      port: '',
      pathname: '/**',
    },
  ],
},
```

## Step 8: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the settings page
3. Try uploading a profile image
4. Check that the image appears correctly and is stored in your S3 bucket

## Security Best Practices

1. **Never commit AWS credentials to version control**
2. Use IAM policies with minimal required permissions
3. Enable CloudTrail for audit logging
4. Consider using signed URLs for more sensitive operations
5. Regularly rotate access keys
6. Use AWS Secrets Manager or SSM Parameter Store for production deployments

## Troubleshooting

### Common Issues:

1. **Access Denied**: Check IAM permissions and bucket policy
2. **CORS Issues**: Add CORS configuration to your S3 bucket:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
       "ExposeHeaders": []
     }
   ]
   ```
3. **Image Not Loading**: Verify the bucket policy allows public read access
4. **Upload Fails**: Check AWS credentials and region configuration

## Production Considerations

For production deployments:

1. Use environment variables or AWS Secrets Manager for credentials
2. Set up proper CORS policies
3. Consider using CloudFront for better performance
4. Implement image optimization and resizing (e.g., with AWS Lambda)
5. Set up proper monitoring and logging
6. Use signed URLs for enhanced security if needed

## Cost Optimization

1. Set up S3 lifecycle policies to manage storage costs
2. Use S3 Intelligent Tiering for automatic cost optimization
3. Monitor usage with AWS Cost Explorer
4. Consider implementing image compression to reduce storage and transfer costs
