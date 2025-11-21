import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sends the captured image to Gemini to be processed for "thin and young" effects.
 * @param base64Image The raw base64 string of the captured image (without data prefix).
 * @param mimeType The mime type of the image.
 * @returns The processed image as a base64 string.
 */
export const processBeautyFilter = async (base64Image: string, mimeType: string = 'image/jpeg'): Promise<string> => {
  try {
    // We use the flash image model for speed and editing capabilities
    const model = 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Edit this photo to apply a strong beauty filter. Make the person look significantly younger (around 20 years old) and significantly thinner/slimmer. Smooth the skin, reduce wrinkles, refine facial features to be more delicate, and slim the body shape while maintaining a photorealistic high-fashion look. Return only the edited image.",
          },
        ],
      },
    });

    // Extract the image from the response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }

    throw new Error("No image data returned from AI.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};