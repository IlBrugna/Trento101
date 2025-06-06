import { deleteFile,UploadcareSimpleAuthSchema } from '@uploadcare/rest-client';
import dotenv from 'dotenv';
dotenv.config({path:'./config/.env'});
export default async function deleteOldUploadcareImage(oldImageUrl) {

    const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
        publicKey: process.env.UPLOADCARE_PUBLIC,
        secretKey: process.env.UPLOADCARE_PRIVATE,
    });

  try {

    // Extract UUID from Uploadcare URL
    const uuidMatch = oldImageUrl.match(/\/([a-f0-9-]{36})\//);
    
    if (!uuidMatch) {
      console.warn('Could not extract UUID from Uploadcare URL:', oldImageUrl);
      return;
    }
    
    const fileUuid = uuidMatch[1];
    
    await deleteFile({ uuid: fileUuid }, { authSchema: uploadcareSimpleAuthSchema});

    console.log('Successfully deleted old image from Uploadcare:', fileUuid);
   
  } catch (error) {
    console.error('Error deleting old image from Uploadcare:', error);
   }
}
