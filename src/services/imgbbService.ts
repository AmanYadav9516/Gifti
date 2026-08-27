// ImgBB Cloud Image Upload Service
// Ensures high-quality images with ultra-short URLs for WhatsApp sharing

const IMGBB_API_KEY = '6369d3c867f3bf8b52cd22675031e0d1';

export interface UploadResult {
  url: string;
  displayUrl: string;
  thumbUrl: string;
  deleteUrl?: string;
}

export async function uploadImageToImgBB(fileOrBase64: File | string): Promise<string> {
  const formData = new FormData();
  formData.append('key', IMGBB_API_KEY);

  if (typeof fileOrBase64 === 'string') {
    // Strip data URL prefix if present for clean base64 upload
    const cleanBase64 = fileOrBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    formData.append('image', cleanBase64);
  } else {
    formData.append('image', fileOrBase64);
  }

  try {
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`ImgBB upload failed with status ${response.status}`);
    }

    const result = await response.json();
    if (result.success && result.data && result.data.url) {
      return result.data.url;
    } else {
      throw new Error('ImgBB did not return a valid image URL');
    }
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw error;
  }
}
