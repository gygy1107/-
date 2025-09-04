
import React, { useState, useRef, useCallback } from 'react';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
}

const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    } else {
      setPreview(null);
      onImageChange(null);
    }
  };
  
  const handleAreaClick = () => {
      fileInputRef.current?.click();
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    }
  }, [onImageChange]);


  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
        <h2 className="text-xl font-semibold text-gray-700 mb-1">1. Upload Your Garden Photo</h2>
        <p className="text-sm text-gray-500 mb-4">Upload a clear picture of your garden for the best results.</p>
        <div 
            className="relative flex-grow border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center text-center p-4 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300"
            onClick={handleAreaClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
            />
            {preview ? (
            <div className="relative w-full h-full">
                <img src={preview} alt="Garden preview" className="w-full h-full object-cover rounded-md" />
                 <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="font-semibold">Click or drag to change image</p>
                </div>
            </div>
            ) : (
                <div className="text-gray-500">
                    <UploadIcon className="w-12 h-12 mx-auto mb-2 text-gray-400"/>
                    <p className="font-semibold">Click to upload or drag & drop</p>
                    <p className="text-xs mt-1">PNG, JPG, or WEBP</p>
                </div>
            )}
        </div>
    </div>
  );
};
