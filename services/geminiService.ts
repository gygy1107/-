import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { RedesignPlan } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a redesigned garden image using the Nanobanana model.
 * @param base64ImageData The base64 encoded string of the user's image.
 * @param mimeType The MIME type of the user's image.
 * @param styleName The name of the selected garden style.
 * @returns An object with the base64 encoded image data and its mime type.
 */
export const generateRedesignedImage = async (
  base64ImageData: string,
  mimeType: string,
  styleName: string
): Promise<{data: string; mimeType: string}> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: `Redesign this garden in a photorealistic ${styleName} style. Show a complete transformation.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return { data: part.inlineData.data, mimeType: part.inlineData.mimeType };
      }
    }
    throw new Error("AI did not return an image. It might have refused the request due to safety policies. Please try a different image.");
  } catch (error) {
    console.error("Error generating redesigned image:", error);
    throw new Error("Failed to generate redesigned image from AI.");
  }
};


/**
 * Generates a floor plan and redesign advice.
 * @param base64ImageData The base64 encoded string of the user's image.
 * @param mimeType The MIME type of the user's image.
 * @param styleName The name of the selected garden style.
 * @returns An object containing the floor plan and redesign advice.
 */
export const generateRedesignPlan = async (
    base64ImageData: string,
    mimeType: string,
    styleName: string
): Promise<RedesignPlan> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: `Analyze this garden image. Based on a "${styleName}" redesign, create a professional report.`,
                    },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        floorPlan: {
                            type: Type.STRING,
                            description: "A textual, top-down description of the new garden layout. Use simple terms like 'Left: Flower bed with roses', 'Center: Stone pathway leading to a small pond', 'Back-right: Wooden pergola with climbing vines'. Be descriptive and clear.",
                        },
                        redesignAdvice: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                            description: "A list of at least 4 professional, actionable tips for the redesign. Cover key areas like suggested plants, materials (for paths, patios), furniture choices, lighting ideas, and water features, relevant to the chosen style.",
                        },
                    },
                    required: ["floorPlan", "redesignAdvice"],
                },
            },
        });
        
        const jsonText = response.text.trim();
        const parsedPlan: RedesignPlan = JSON.parse(jsonText);
        return parsedPlan;

    } catch (error) {
        console.error("Error generating redesign plan:", error);
        throw new Error("Failed to generate redesign plan from AI.");
    }
};

/**
 * Generates a 2D floor plan image from a text description.
 * @param description The textual description of the garden layout.
 * @returns A base64 encoded string of the generated image.
 */
export const generateFloorPlanImage = async (
  description: string
): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A simple, clean, 2D, black and white, top-down schematic floor plan for a garden layout. Minimalist and clear. Do not include any text, labels, or dimensions. The layout is as follows: ${description}`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }
    throw new Error("AI did not return a floor plan image.");
  } catch (error) {
    console.error("Error generating floor plan image:", error);
    throw new Error("Failed to generate floor plan image from AI.");
  }
};