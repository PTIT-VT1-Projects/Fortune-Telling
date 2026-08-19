import { GoogleGenAI } from "@google/genai";
import config from "../../../../config";
import imageService from "../../../../api/imageService";

const ai = new GoogleGenAI({
  apiKey: config.api.key,
});

async function createPortraitAfterFiveYears(image, mark) {
  let generatedImage = "";
  // Bước 1: tạo ảnh
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

    generatedImage = `data:${imagePart.inlineData.mimeType || "image/png"};base64,${imagePart.inlineData.data}`;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw error;
  }

  // BƯỚC 2: yêu cầu Gemini trả JSON text đúng schema
  const textPrompt = `
      Dựa trên yêu cầu trước đó, hãy chọn 1 nghề phù hợp thuộc:
      - Viễn thông
      - Kỹ thuật dữ liệu

      Viết thêm một đoạn chúc mừng khoảng 3-4 dòng cho người đạt điểm ${mark}.

      Chỉ trả về JSON hợp lệ với đúng cấu trúc sau:
      {
        "futureJob": "string",
        "futureJobDescription": "string",
        "congratulationText": "string"
      }
      `;
  try {
    const textResponse = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: textPrompt,
      config: {
        responseFormat: {
          text: {
            mimeType: "application/json",
            schema: {
              type: "object",
              properties: {
                futureJob: {
                  type: "string",
                },
                futureJobDescription: {
                  type: "string",
                },
                congratulationText: {
                  type: "string",
                },
              },
              required: ["futureJob", "congratulationText"],
              additionalProperties: false,
            },
          },
        },
      },
    });

    const textResult = JSON.parse(textResponse.text);

    // BƯỚC 3: ghép lại JSON cuối cùng
    const result = {
      futureJob: textResult.futureJob,
      futureJobDescription: textResult.futureJobDescription,
      congratulationText: textResult.congratulationText,
      generatedImage,
    };

    console.log(result);
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw error;
  }
}

const jobPredictionService = { createPortraitAfterFiveYears };

export default jobPredictionService;
