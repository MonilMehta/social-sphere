import AWS from 'aws-sdk';

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1', // Default region
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'socialflow-storage';

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
}

/**
 * Upload an image file to AWS S3
 * @param file - The image file to upload
 * @param folder - Optional folder path within the bucket (e.g., 'profile-pics', 'posts')
 * @returns Promise containing the uploaded file URL and metadata
 */
export const uploadImageToS3 = async (
  file: File, 
  folder?: string
): Promise<UploadResult> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    
    // Construct S3 key (file path)
    const key = folder ? `${folder}/${fileName}` : fileName;

    // Convert File to Buffer for upload
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);    // Upload parameters
    const uploadParams: AWS.S3.PutObjectRequest = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ContentDisposition: 'inline',
      // Make the file publicly readable
      // Set cache control
      CacheControl: 'max-age=31536000', // 1 year
      // Optional: Add metadata
      Metadata: {
        'uploaded-at': new Date().toISOString(),
        'original-name': file.name,
        'file-size': file.size.toString(),
      },
    };

    // Upload to S3
    const uploadResult = await s3.upload(uploadParams).promise();

    return {
      url: uploadResult.Location,
      key: uploadResult.Key,
      bucket: uploadResult.Bucket,
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete an image from S3
 * @param key - The S3 key (file path) to delete
 * @returns Promise that resolves when deletion is complete
 */
export const deleteImageFromS3 = async (key: string): Promise<void> => {
  try {
    const deleteParams: AWS.S3.DeleteObjectRequest = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(deleteParams).promise();
    console.log(`Successfully deleted ${key} from S3`);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Upload multiple images to S3
 * @param files - Array of image files to upload
 * @param folder - Optional folder path within the bucket
 * @returns Promise containing array of upload results
 */
export const uploadMultipleImagesToS3 = async (
  files: File[], 
  folder?: string
): Promise<UploadResult[]> => {
  try {
    const uploadPromises = files.map(file => uploadImageToS3(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images to S3:', error);
    throw new Error(`Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get a pre-signed URL for direct browser upload (useful for large files)
 * @param fileName - The name of the file
 * @param fileType - The MIME type of the file
 * @param folder - Optional folder path
 * @returns Promise containing the pre-signed URL and key
 */
export const getPresignedUploadUrl = async (
  fileName: string,
  fileType: string,
  folder?: string
): Promise<{ uploadUrl: string; key: string }> => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}-${randomString}.${fileExtension}`;
    
    // Construct S3 key
    const key = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      Expires: 300, // URL expires in 5 minutes
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);

    return {
      uploadUrl,
      key,
    };
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw new Error(`Failed to generate upload URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Extract S3 key from a full S3 URL
 * @param url - The full S3 URL
 * @returns The S3 key (file path)
 */
export const extractS3KeyFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Remove the leading slash
    return urlObj.pathname.substring(1);
  } catch (error) {
    console.error('Error extracting S3 key from URL:', error);
    return '';
  }
};

export default {
  uploadImageToS3,
  deleteImageFromS3,
  uploadMultipleImagesToS3,
  getPresignedUploadUrl,
  extractS3KeyFromUrl,
};
