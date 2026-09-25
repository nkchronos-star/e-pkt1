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
