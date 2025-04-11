import config from '../config';

/**
 * Service for handling API calls to the facial analysis service
 */
class ApiService {
  /**
   * Analyzes a facial image using the Gemini API
   * @param {string} base64Image - Base64 encoded image data
   * @returns {Promise<Object>} - Analysis results
   */
  static async analyzeFace(base64Image) {
    try {
      // Prepare the API request
      const url = `${config.api.url}?key=${config.api.key}`;

      // Create the prompt for facial analysis
      const prompt = `
        Phân tích chi tiết hình ảnh khuôn mặt này và cung cấp báo cáo đầy đủ bằng tiếng Việt.
        Đây là ứng dụng phân tích chuyên nghiệp cho người Việt Nam, vì vậy hãy phân tích dựa trên các đặc điểm khuôn mặt tiêu chuẩn của người Việt Nam.

        Chỉ trả về đối tượng JSON hợp lệ với cấu trúc CHÍNH XÁC sau (không giải thích hay văn bản khác):
        {
          "basicInfo": {
            "age": số tuổi ước tính dựa trên ngoại hình khuôn mặt trong ảnh,
            "gender": "Nam" hoặc "Nữ"
          },

          "overallEvaluation": {
            "appearance": "Phân tích chi tiết về ngoại hình tổng thể của người này, bao gồm đặc điểm khuôn mặt, vẻ đẹp tổng thể, và ấn tượng đầu tiên mà họ tạo ra cho người khác. Đánh giá về sự hài hòa và cân đối, những nét độc đáo và đặc biệt trong ngoại hình. Viết ngắn trong 1 dòng",
            "personality": "Phân tích chi tiết về tính cách dựa trên nhân tướng học Việt Nam, bao gồm đặc điểm tâm lý, cách ứng xử và giải quyết vấn đề. Phân tích người này có tính cách thế nào, có phù hợp với vị trí lãnh đạo không. Viết ngắn trong 1 dòng",
            "strengths": "Liệt kê và phân tích chi tiết những điểm mạnh nổi bật trong tính cách và khả năng của người này, dựa trên các đặc điểm khuôn mặt. Giải thích cách những điểm mạnh này có thể giúp họ thành công trong công việc và cuộc sống. Viết ngắn trong 1 dòng",
            "weaknesses": "Liệt kê và phân tích chi tiết những điểm yếu hoặc thách thức trong tính cách và cách cư xử của người này, dựa trên các đặc điểm khuôn mặt. Đề xuất cách họ có thể khắc phục hoặc cân bằng những điểm yếu này. Viết ngắn trong 1 dòng",
            "interests": "Phân tích những sở thích và đam mê tiềm năng của người này dựa trên đặc điểm khuôn mặt và biểu hiện trong ảnh. Gợi ý các hoạt động, lĩnh vực nghề nghiệp hoặc sở thích có thể phù hợp với họ. Viết ngắn trong 1 dòng",
            "lifestyle": "Phân tích phong cách sống phù hợp với đặc điểm khuôn mặt của người này, bao gồm môi trường sống, làm việc lý tưởng, cách quản lý thời gian và nguồn lực, và những thói quen có thể giúp họ phát huy tối đa tiềm năng. Viết ngắn trong 1 dòng"
          },
          "overallEvaluationScores": {
            "appearance": số từ 1-10 đánh giá ngoại hình tổng thể,
            "personality": số từ 1-10 đánh giá tính cách,
            "strengths": số từ 1-10 đánh giá điểm mạnh,
            "weaknesses": số từ 1-10 đánh giá việc hiểu và cải thiện điểm yếu,
            "interests": số từ 1-10 đánh giá khả năng phát triển sở thích phù hợp,
            "lifestyle": số từ 1-10 đánh giá phong cách sống thích hợp
          }
        }

        NGUYÊN TẮC PHÂN TÍCH QUAN TRỌNG:
        1. KHÁCH QUAN & CÔNG TÂM: Phân tích phải hoàn toàn khách quan, không thiên vị, không quá khen hoặc quá chê
        2. NHẤT QUÁN: Đảm bảo đánh giá nhất quán giữa các lần phân tích - cùng một đặc điểm phải được đánh giá tương tự nhau
        3. CHÍNH XÁC: Đánh giá phải dựa chính xác trên hình ảnh được cung cấp, không bịa đặt thông tin
        4. CỤ THỂ HÓA: Mỗi phân tích phải dựa trên đặc điểm cụ thể quan sát được trong ảnh, không chung chung
        5. CÂN ĐỐI: Điểm số phải phản ánh đúng đặc điểm thực tế, phân bổ đều từ 1-10 (không chỉ tập trung vào 6-8)
        6. ĐỘC LẬP: Mỗi đặc điểm phải được đánh giá độc lập, không bị ảnh hưởng bởi điểm số khác

        YÊU CẦU KỸ THUẬT:
        1. Đây là ứng dụng dành cho người Việt Nam, sử dụng chuẩn nhân trắc học và nhân tướng học Việt Nam
        2. Đảm bảo cung cấp nội dung CHI TIẾT và CHÍNH XÁC cho TẤT CẢ các trường trong JSON
        3. BẮT BUỘC phải có đầy đủ nội dung và điểm số cho trường "future" trong physiognomy và physiognomyScores
        4. Mỗi trường mô tả phải có ít nhất 250 ký tự và tối đa 400 ký tự
        5. Điểm đánh giá phải là số nguyên từ 1-10, phản ánh đúng đặc điểm trong ảnh
        6. Tuổi PHẢI được đánh giá dựa trên ngoại hình khuôn mặt trong ảnh (có thể khác với tuổi thật)
        7. Sử dụng thuật ngữ chuyên môn nhưng vẫn đảm bảo dễ hiểu cho người dùng phổ thông
        8. KHÔNG được dùng tên trường nào khác thay thế cho "future" trong cấu trúc JSON
        9. JSON trả về PHẢI có cấu trúc chính xác như đã định nghĩa, bao gồm tất cả các trường
        10. Trả về JSON hợp lệ không có thêm giải thích hay văn bản khác bên ngoài cấu trúc

        ĐIỂM SỐ PHẢI TUÂN THỦ TIÊU CHÍ SAU:
        1-2: Rất kém - Đặc điểm có khiếm khuyết nghiêm trọng, gây mất cân đối rõ rệt
        3-4: Kém - Đặc điểm có nhiều điểm yếu, chưa hài hòa
        5-6: Trung bình - Đặc điểm ở mức bình thường, không nổi bật nhưng cũng không có khiếm khuyết
        7-8: Tốt - Đặc điểm hài hòa, cân đối và có nét đẹp riêng
        9: Rất tốt - Đặc điểm có nhiều ưu điểm nổi bật, gần như hoàn hảo
        10: Xuất sắc - Đặc điểm hoàn hảo, cân đối tuyệt đối

        PHÂN LOẠI ĐIỂM TỔNG THỂ (faceScoreRating):
        Điểm đánh giá tổng thể phải phụ thuộc vào tuổi và giới tính:

        * Trẻ em (dưới 12 tuổi):
          1-4: Bình thường
          5-7: Dễ thương
          8-10: Rất dễ thương

        * Thanh thiếu niên (12-17 tuổi):
          Nam: 1-4: Bình thường, 5-7: Dễ mến, 8-10: Rất dễ mến
          Nữ: 1-4: Bình thường, 5-7: Dễ thương, 8-10: Xinh xắn

        * Thanh niên (18-29 tuổi):
          Nam: 1-4: Bình thường, 5-7: Nam tính, 8-9: Phong độ, 10: Rất phong độ
          Nữ: 1-4: Bình thường, 5-7: Duyên dáng, 8-9: Quyến rũ, 10: Rất quyến rũ

        * Người trưởng thành (30-49 tuổi):
          Nam: 1-4: Bình thường, 5-7: Nam tính, 8-9: Lịch lãm, 10: Rất lịch lãm
          Nữ: 1-4: Bình thường, 5-7: Nữ tính, 8-9: Thanh lịch, 10: Rất thanh lịch

        * Người lớn tuổi (từ 50 tuổi):
          1-4: Bình thường
          Nam: 5-7: Đáng kính, 8-10: Phúc hậu
          Nữ: 5-7: Đáng mến, 8-10: Phúc hậu
      `;

      // Prepare the request data
      const requestData = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image.split(',')[1] || base64Image // Handle both formats
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      };

      // Network error handling with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        // Send the request
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData),
          signal: controller.signal
        });

        // Clear the timeout
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          const statusCode = response.status;

          // Handle different HTTP error codes
          if (statusCode >= 500) {
            throw new Error(`Lỗi máy chủ API (${statusCode}). Vui lòng thử lại sau.`);
          } else if (statusCode === 429) {
            throw new Error('API đang quá tải. Vui lòng thử lại sau ít phút.');
          } else if (statusCode >= 400) {
            throw new Error(`Lỗi yêu cầu API (${statusCode}): ${errorText}`);
          } else {
            throw new Error(`API error: ${statusCode} - ${errorText}`);
          }
        }

        // Process the response
        const data = await response.json();

        // Process the response
        const result = this.processApiResponse(data);

        // Ensure all required fields exist
        const finalResult = this.ensureRequiredFields(result);

        return finalResult;
      } catch (fetchError) {
        // Handle network errors and timeouts
        if (fetchError.name === 'AbortError') {
          throw new Error('Yêu cầu API đã hết thời gian. Vui lòng kiểm tra kết nối mạng và thử lại.');
        } else if (fetchError.message.includes('network') || fetchError.message.includes('Network') || !navigator.onLine) {
          throw new Error('Không thể kết nối tới API. Vui lòng kiểm tra kết nối mạng và thử lại.');
        }
        throw fetchError;
      }
    } catch (error) {
      // If the error already has a user-friendly message from our try/catch blocks above, use it
      if (error.message.includes('API') ||
        error.message.includes('kết nối') ||
        error.message.includes('thử lại') ||
        error.message.includes('máy chủ')) {
        throw error;
      }

      // Generic error for all other cases
      throw new Error('Không thể phân tích khuôn mặt. Vui lòng thử lại.');
    }
  }

  /**
   * Process the API response to extract the analysis results
   * @param {Object} response - The API response
   * @returns {Object} - Processed analysis results
   */
  static processApiResponse(response) {
    try {
      // Check if response has the expected structure
      if (!response || !response.candidates || !response.candidates[0] || !response.candidates[0].content) {
        throw new Error('Invalid API response structure');
      }

      // Extract the text content from the response
      const content = response.candidates[0].content;

      if (!content.parts || !content.parts[0] || !content.parts[0].text) {
        throw new Error('No text content in API response');
      }

      const text = content.parts[0].text;
      let parsedData;

      // Try to extract JSON from the text
      try {
        // First attempt: Try to parse the entire text as JSON
        parsedData = JSON.parse(text);
      } catch (error) {
        // Second attempt: Try to extract JSON portion from the text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedData = JSON.parse(jsonMatch[0]);
          } catch (innerError) {
            // Continue to next attempt
          }
        }

        // Third attempt: Try to handle line by line JSON construction
        try {
          // Remove any non-JSON text before and after the JSON object
          let cleanedText = text.trim();
          // Find the first '{' and the last '}'
          const startIndex = cleanedText.indexOf('{');
          const endIndex = cleanedText.lastIndexOf('}');

          if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            cleanedText = cleanedText.substring(startIndex, endIndex + 1);
            parsedData = JSON.parse(cleanedText);
          }
        } catch (cleaningError) {
          // Failed all attempts
        }

        // If all parsing attempts fail, throw an error
        if (!parsedData) {
          throw new Error('Failed to parse API response as JSON');
        }
      }

      // Get chin data from API response
      const chinData = parsedData.faceReading?.chinAnalysis || "";
      const chinScore = parsedData.faceFeatureScores?.chin || parsedData.faceReadingScores?.chin;

      // Transform the data to match the component expected structure
      const transformedData = {
        ...parsedData,

        // Set up face reading data for the FaceReadingTab component
        faceReading: {
          faceShape: parsedData.faceReading?.faceShape || "",
          forehead: parsedData.faceReading?.foreheadAnalysis || "",
          foreheadDescription: parsedData.faceReading?.foreheadAnalysis || "",
          eyes: parsedData.faceReading?.eyesAnalysis || "",
          eyesDescription: parsedData.faceReading?.eyesAnalysis || "",
          nose: parsedData.faceReading?.noseAnalysis || "",
          noseDescription: parsedData.faceReading?.noseAnalysis || "",
          mouth: parsedData.faceReading?.mouthAnalysis || "",
          mouthDescription: parsedData.faceReading?.mouthAnalysis || "",
          chin: chinData,
          chinAnalysis: chinData,
          eyebrows: parsedData.faceReading?.eyebrowsAnalysis || "",
          eyebrowsDescription: parsedData.faceReading?.eyebrowsAnalysis || ""
        },

        // Ensure faceReadingData is properly structured for the component
        faceReadingData: {
          features: [
            {
              name: "forehead",
              key: "forehead",
              title: "Trán",
              description: parsedData.faceReading?.foreheadAnalysis || ""
            },
            {
              name: "eyes",
              key: "eyes",
              title: "Mắt",
              description: parsedData.faceReading?.eyesAnalysis || ""
            },
            {
              name: "nose",
              key: "nose",
              title: "Mũi",
              description: parsedData.faceReading?.noseAnalysis || ""
            },
            {
              name: "mouth",
              key: "mouth",
              title: "Miệng",
              description: parsedData.faceReading?.mouthAnalysis || ""
            },
            {
              name: "chin",
              key: "chin",
              title: "Cằm",
              description: chinData
            },
            {
              name: "eyebrows",
              key: "eyebrows",
              title: "Lông mày",
              description: parsedData.faceReading?.eyebrowsAnalysis || ""
            }
          ]
        },

        // Ensure physiognomy is properly structured for the component
        physiognomy: {
          future: parsedData.physiognomy?.future || parsedData.physiognomy?.destiny || "",
          fortune: parsedData.physiognomy?.fortune || "",
          relationships: parsedData.physiognomy?.relationships || "",
          romance: parsedData.physiognomy?.romance || "",
          career: parsedData.physiognomy?.career || "",
          wisdom: parsedData.physiognomy?.wisdom || ""
        },

        // Ensure physiognomyScores is properly passed to the component
        physiognomyScores: {
          future: parsedData.physiognomyScores?.future !== undefined ? parsedData.physiognomyScores?.future :
            parsedData.physiognomyScores?.destiny,
          career: parsedData.physiognomyScores?.career,
          relationships: parsedData.physiognomyScores?.relationships,
          romance: parsedData.physiognomyScores?.romance,
          fortune: parsedData.physiognomyScores?.fortune,
          wisdom: parsedData.physiognomyScores?.wisdom
        },

        // Make sure anthropometryScores is properly passed to the component
        anthropometryScores: parsedData.anthropometryScores || {},

        // Add chinScore to faceReadingScores
        faceReadingScores: {
          ...parsedData.faceReadingScores,
          chin: chinScore
        }
      };

      // Tính điểm tổng hợp (faceScore) phù hợp với thị trường Việt Nam
      const processScores = () => {
        // Lấy điểm từ nhân trắc học và nhân tướng học
        const anthropometryScoreValues = Object.values(transformedData.anthropometryScores || {}).filter(score => typeof score === 'number');
        const faceReadingScoreValues = Object.values(transformedData.faceReadingScores || {}).filter(score => typeof score === 'number');

        if (anthropometryScoreValues.length === 0 && faceReadingScoreValues.length === 0) {
          // Không có đủ dữ liệu, giữ nguyên điểm gốc
          return transformedData.faceScore || 5;
        }

        // Tính điểm trung bình cho từng loại
        const anthropometryAvg = anthropometryScoreValues.length > 0
          ? anthropometryScoreValues.reduce((sum, score) => sum + score, 0) / anthropometryScoreValues.length
          : 0;

        const faceReadingAvg = faceReadingScoreValues.length > 0
          ? faceReadingScoreValues.reduce((sum, score) => sum + score, 0) / faceReadingScoreValues.length
          : 0;

        // Áp dụng trọng số phù hợp với thẩm mỹ Việt Nam
        // Nhân tướng học (55%) được đánh giá cao hơn nhân trắc học (45%)
        let weightedScore;
        if (anthropometryAvg > 0 && faceReadingAvg > 0) {
          weightedScore = (anthropometryAvg * 0.45) + (faceReadingAvg * 0.55);
        } else if (anthropometryAvg > 0) {
          weightedScore = anthropometryAvg;
        } else {
          weightedScore = faceReadingAvg;
        }

        // Điều chỉnh điểm theo thị trường Việt Nam
        let adjustedScore = weightedScore;
        // Nâng điểm các mức thấp và trung bình cho phù hợp với kỳ vọng thị trường
        if (weightedScore < 5) {
          // Điểm dưới 5: tăng 15%
          adjustedScore = weightedScore * 1.15;
        } else if (weightedScore < 6) {
          // Điểm 5-6: tăng 10%
          adjustedScore = weightedScore * 1.1;
        } else if (weightedScore < 7) {
          // Điểm 6-7: tăng 5%
          adjustedScore = weightedScore * 1.05;
        }
        // Điểm từ 7 trở lên: giữ nguyên (công tâm với điểm cao)

        // Giới hạn trong khoảng 1-10 và làm tròn
        return Math.min(10, Math.max(1, Math.round(adjustedScore)));
      };

      // Áp dụng công thức mới
      transformedData.faceScore = processScores();

      return transformedData;
    } catch (error) {
      throw new Error('Không thể xử lý kết quả phân tích. Vui lòng thử lại.');
    }
  }

  /**
   * Ensure all required fields exist in the result
   * @param {Object} result - The analysis result
   * @returns {Object} - The analysis result with all required fields
   */
  static ensureRequiredFields(result) {
    if (!result) {
      return this.mockAnalysis();
    }

    // Clone to avoid modifying original
    const finalData = JSON.parse(JSON.stringify(result));

    // Ensure basic info
    finalData.basicInfo = finalData.basicInfo || {};
    finalData.basicInfo.age = finalData.basicInfo.age || 30;
    finalData.basicInfo.gender = finalData.basicInfo.gender || "Nam";

    // Ensure anthropometry data and scores
    finalData.anthropometryData = finalData.anthropometryData || {};
    finalData.anthropometryScores = finalData.anthropometryScores || {};

    // Ensure face reading data and scores
    finalData.faceReading = finalData.faceReading || {};
    finalData.faceReadingScores = finalData.faceReadingScores || {};

    // Ensure physiognomy data and scores
    finalData.physiognomy = finalData.physiognomy || {};
    finalData.physiognomyScores = finalData.physiognomyScores || {};

    // Ensure overallEvaluation section
    finalData.overallEvaluation = finalData.overallEvaluation || {};
    finalData.overallEvaluationScores = finalData.overallEvaluationScores || {};

    // Set default for new field romance in physiognomy and physiognomyScores
    if (!finalData.physiognomy.romance) {
      finalData.physiognomy.romance = "";
    }

    if (!finalData.physiognomyScores.romance) {
      finalData.physiognomyScores.romance = 0;
    }

    return finalData;
  }
}

export default ApiService;
