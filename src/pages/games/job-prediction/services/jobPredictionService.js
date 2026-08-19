import { GoogleGenAI } from "@google/genai";
import config from "../../../../config";
import imageService from "../../../../api/imageService";

const ai = new GoogleGenAI({
  apiKey: config.api.key,
});

async function createPortraitAfterFiveYears(image) {
  try {
    const base64Image = await imageService.blobToBase64(image);

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: [
        {
          text: "make this person look 4 years older, only take the face and put in a job in telecommunication or data engineering field \
          with name of that field, without true name",
        },
        {
          inlineData: {
            mimeType: image.type || "image/png",
            data: base64Image,
          },
        },
      ],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p) => p.inlineData);

    if (!imagePart?.inlineData?.data) {
      throw new Error("No image returned from Gemini");
    }

    return `data:${imagePart.inlineData.mimeType || "image/png"};base64,${imagePart.inlineData.data}`;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw error;
  }
}

const jobPredictionService = { createPortraitAfterFiveYears };

export default jobPredictionService;
