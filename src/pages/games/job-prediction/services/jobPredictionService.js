import { GoogleGenAI } from "@google/genai";
import config from "../../../../config";
import imageService from "../../../../api/imageService";

const ai = new GoogleGenAI({
  apiKey: config.api.key,
});

const jobFields = ["Viễn thông", "Hàng không vũ trụ", "Kỹ thuật dữ liệu"];

function pickRandomField() {
  const index = Math.floor(Math.random() * jobFields.length);
  return jobFields[index];
}

async function createPortraitAfterFiveYears(image, mark) {
  let generatedImage = "";
  const selectedField = pickRandomField();
  // Bước 1: tạo ảnh
  try {
    const base64Image = await imageService.blobToBase64(image);

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: [
        {
          text: `Làm cho người này trông già hơn 4 tuổi, chỉ lấy khuôn mặt và đặt vào bối cảnh nghề nghiệp thuộc ngành ${selectedField}, \
          kèm tên ngành đó, không dùng tên thật.`,
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
      Hãy chọn 1 nghề nghiệp cụ thể thuộc ngành "${selectedField}" (không được chọn ngành khác) và viết mô tả nghề nghiệp thuộc ngành ${selectedField}

      Viết thêm một đoạn chúc mừng khoảng 3-4 dòng theo hướng hài hước cho người đạt điểm ${mark} và viết trách nhiệm ngắn gọn của nghề nghiệp thuộc ngành ${selectedField}

      Chỉ trả về JSON hợp lệ với đúng cấu trúc sau:
      {
        "futureJob": "string",
        "futureJobDescription": "string",
        "congratulationText": "string",
        "keyResponsibilities": ["string", "string", "string"]
      }
      `;
  try {
    const textResponse = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: textPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            futureJob: { type: "string" },
            futureJobDescription: { type: "string" },
            congratulationText: { type: "string" },
            keyResponsibilities: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["futureJob", "congratulationText", "keyResponsibilities"],
        },
      },
    });

    const textResult = JSON.parse(textResponse.text);

    // BƯỚC 3: ghép lại JSON cuối cùng
    const result = {
      futureJob: textResult.futureJob,
      futureJobDescription: textResult.futureJobDescription,
      congratulationText: textResult.congratulationText,
      keyResponsibilities: textResult.keyResponsibilities,
      generatedImage,
    };

    return result;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw error;
  }
}

const jobPredictionService = { createPortraitAfterFiveYears };

export default jobPredictionService;
