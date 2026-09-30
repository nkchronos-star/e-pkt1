/**
 * Utility function to compress and resize images client-side before uploading to Firestore.
 * This prevents hitting Firestore document 1MB limit and accelerates network transfers.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 400,
  maxHeight = 500,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Basic verification
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Fail yang dimuat naik bukan gambar yang sah.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca fail gambar.'));
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memproses gambar.'));
      img.onload = () => {
        try {
          let { width, height } = img;

          // Maintain aspect ratio while bounding within maxWidth & maxHeight
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(width, 1);
          canvas.height = Math.max(height, 1);
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            // Fallback to original data if canvas is unavailable
            resolve(readerEvent.target?.result as string);
            return;
          }

          // Smooth scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // White background for transparent PNG converted to JPEG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convert to JPEG with chosen quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn('Canvas compression error, using original result:', err);
          resolve(readerEvent.target?.result as string);
        }
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

import { HAJAH_JUITA_SIGNATURE, HAJI_HASDAN_SIGNATURE } from './signatureData';

export const DEFAULT_TANDATANGAN_PENGETUA = HAJAH_JUITA_SIGNATURE;
export const DEFAULT_TANDATANGAN_PENGARAH = HAJI_HASDAN_SIGNATURE;

export async function compressSignatureFile(file: File, maxWidth = 380, maxHeight = 160): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Fail yang dimuat naik bukan gambar yang sah.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca fail gambar tandatangan.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memproses gambar tandatangan.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Try compact PNG first
        const pngUrl = canvas.toDataURL('image/png');
        if (pngUrl.length < 80000) {
          resolve(pngUrl);
        } else {
          // Fallback to high quality JPEG to guarantee compact size (< 40KB)
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
