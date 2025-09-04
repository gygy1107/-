import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { StyleSelector } from './components/StyleSelector';
import { ImageUploader } from './components/ImageUploader';
import { ReportDisplay } from './components/ReportDisplay';
import { Loader } from './components/Loader';
import { generateRedesignedImage, generateRedesignPlan, generateFloorPlanImage } from './services/geminiService';
import { GARDEN_STYLES } from './constants';
import type { Report, GardenStyle } from './types';

const convertImageToBase64JPEG = (base64Data: string, inputMimeType: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }
            // Fill background with white, as JPEG doesn't support transparency
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0);
            
            const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9); // 90% quality
            resolve(jpegDataUrl.split(',')[1]); // return only the base64 part
        };
        image.onerror = (error) => {
            reject(error);
        };
        image.src = `data:${inputMimeType};base64,${base64Data}`;
    });
};

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
    setReport(null);
    setError(null);
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyleId(styleId);
    setReport(null);
    setError(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleGenerate = useCallback(async () => {
    if (!selectedImage || !selectedStyleId) {
      setError("Please upload an image and select a style.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setReport(null);

    const selectedStyle = GARDEN_STYLES.find(style => style.id === selectedStyleId);
    if (!selectedStyle) {
      setError("Invalid style selected.");
      setIsLoading(false);
      return;
    }

    try {
      setLoadingMessage("Converting image for analysis...");
      const base64Image = await fileToBase64(selectedImage);
      const mimeType = selectedImage.type;

      setLoadingMessage("Envisioning your new garden... (This may take a moment)");
      const redesignedImagePromise = generateRedesignedImage(base64Image, mimeType, selectedStyle.name);
      
      setLoadingMessage("Drafting the floor plan and professional advice...");
      const redesignPlanPromise = generateRedesignPlan(base64Image, mimeType, selectedStyle.name);

      const [redesignedImageResult, redesignPlan] = await Promise.all([redesignedImagePromise, redesignPlanPromise]);
      
      if (!redesignedImageResult || !redesignPlan || !redesignPlan.floorPlan) {
        throw new Error("Failed to get a complete response from the AI. Please try again.");
      }
      
      setLoadingMessage("Optimizing redesigned image...");
      const redesignedImageJpgBase64 = await convertImageToBase64JPEG(redesignedImageResult.data, redesignedImageResult.mimeType);

      setLoadingMessage("Rendering floor plan visualization...");
      const floorPlanImageBase64 = await generateFloorPlanImage(redesignPlan.floorPlan);

      setLoadingMessage("Finalizing your personalized report...");

      setReport({
        redesignedImage: `data:image/jpeg;base64,${redesignedImageJpgBase64}`,
        floorPlan: `data:image/jpeg;base64,${floorPlanImageBase64}`,
        redesignAdvice: redesignPlan.redesignAdvice,
        styleName: selectedStyle.name,
        floorPlanDescription: redesignPlan.floorPlan,
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please check the console and try again.");
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [selectedImage, selectedStyleId]);

  const canGenerate = selectedImage !== null && selectedStyleId !== null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-lg text-gray-600 mb-8">
            Transform your garden with the power of AI. Upload a photo, choose your desired style, and receive a comprehensive redesign plan in moments.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-start">
            <ImageUploader onImageChange={handleImageChange} />
            <StyleSelector selectedStyleId={selectedStyleId} onStyleSelect={handleStyleSelect} />
          </div>

          <div className="text-center mb-12">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || isLoading}
              className={`px-8 py-4 text-lg font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105
                ${canGenerate && !isLoading
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {isLoading ? 'Generating...' : 'Generate Redesign'}
            </button>
          </div>

          {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg mb-8">{error}</div>}

          {isLoading && <Loader message={loadingMessage} />}

          {report && !isLoading && (
            <div className="animate-fade-in">
              <ReportDisplay report={report} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;