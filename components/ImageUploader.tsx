import React, { useState, useCallback, useRef } from 'react';
import { downscaleImage } from '../services/imageService';
import { MAX_FILE_SIZE_MB } from '../constants';
import { UploadCloudIcon, XIcon } from './Icons';

interface ImageUploaderProps {
  onImageSelect: (image: { file: File, dataUrl: string } | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = React.memo(({ onImageSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    try {
      const downscaledDataUrl = await downscaleImage(file);
      setPreview(downscaledDataUrl);
      onImageSelect({ file, dataUrl: downscaledDataUrl });
    } catch (err) {
      setError('Could not process image. Please try another file.');
      console.error(err);
    }
  }, [onImageSelect]);

  const handleClear = () => {
    setPreview(null);
    setError(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      {preview ? (
        <div className="relative group">
          <img src={preview} alt="Image preview" className="w-full h-auto max-h-96 object-contain rounded-md" />
          <button
            onClick={handleClear}
            aria-label="Remove image"
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-300 focus:ring-brand-secondary transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center cursor-pointer hover:border-brand-secondary focus-within:border-brand-secondary focus-within:ring-2 focus-within:ring-brand-secondary"
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          tabIndex={0}
          role="button"
          aria-label="Upload an image"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
          />
          <div className="flex flex-col items-center justify-center space-y-2 text-text-secondary">
            <UploadCloudIcon className="w-12 h-12" />
            <p className="font-semibold text-text-primary">Click to upload or drag and drop</p>
            <p className="text-sm">PNG or JPG (max {MAX_FILE_SIZE_MB}MB)</p>
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
});
ImageUploader.displayName = 'ImageUploader';
