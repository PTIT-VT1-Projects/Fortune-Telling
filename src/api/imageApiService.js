import { GoogleGenAI } from "@google/genai";
import config from "../config";

const ai = new GoogleGenAI({
  apiKey: config.api.key,
});

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      resolve(String(result).split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function imageToImageRaw(imageBlob) {
  try {
    const base64Image = await blobToBase64(imageBlob);

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: [
        {
          text: "make this person look 5 years older, highly realistic, wrinkles",
        },
        {
          inlineData: {
            mimeType: imageBlob.type || "image/png",
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

export default { imageToImageRaw };
