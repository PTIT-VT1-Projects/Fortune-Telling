import config from '../config';

class AiService {
    static async validatePortrait(imageBase64, mimeType) {
        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

            try {
                const response = await fetch(`${config.api.url}?key=${config.api.key}`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                {
                                    text: `You are an expert at analyzing human portrait photos. Your task is to determine if the provided image is a valid human portrait.
                                            VALIDATION RULES:
                                            1. The image must contain exactly ONE human face
                                            2. The face must be clearly visible
                                            3. The face must be a real human face (not a drawing, cartoon, or object)

                                            RESPONSE FORMAT: You must respond with ONLY a JSON object in this format:
                                            {
                                            "isValidPortrait": true/false,
                                            "validationError": null or error message describing what's wrong with the image
                                            }

                                            All error messages must be in Vietnamese. 
                                            For valid portraits, set isValidPortrait to true and validationError to null.
                                            For invalid images, set isValidPortrait to false and provide a descriptive error message in Vietnamese.

                                            Common error messages in Vietnamese:
                                            - "Không tìm thấy khuôn mặt nào trong ảnh" (No face detected)
                                            - "Phát hiện nhiều khuôn mặt trong ảnh" (Multiple faces detected)
                                            - "Khuôn mặt không rõ ràng" (Face not clearly visible)
                                            - "Không phải khuôn mặt thật" (Not a real human face)
                                            - "Khuôn mặt bị che quá nhiều" (Face is too covered)
                                            - "Ảnh không phải là chân dung" (Image is not a portrait)`
                                                                            },
                                {
                                    inline_data: {
                                        mime_type: mimeType,
                                        data: imageBase64.split(',')[1]
                                    }
                                }
                            ]
                        }],
                        generationConfig: {
                            temperature: 0.1
                        }
                    }),
                    signal: controller.signal
                });

                // Clear the timeout
                clearTimeout(timeoutId);

                if (!response.ok) {
                    const statusCode = response.status;

                    // Handle different HTTP error codes
                    if (statusCode >= 500) {
                        throw new Error(`Lỗi máy chủ AI (${statusCode}). Vui lòng thử lại sau.`);
                    } else if (statusCode === 429) {
                        throw new Error('Máy chủ AI đang quá tải. Vui lòng thử lại sau ít phút.');
                    } else {
                        throw new Error('Lỗi kết nối với server AI');
                    }
                }

                const data = await response.json();

                if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                    throw new Error('Phản hồi không hợp lệ từ server AI');
                }

                const textContent = data.candidates[0].content.parts[0].text;

                let result;
                try {
                    result = JSON.parse(textContent);
                } catch (e) {
                    // Fallback approach - attempt to extract validation result
                    if (textContent.includes('"isValidPortrait": true') || textContent.includes('"isValidPortrait":true')) {
                        return { isValidPortrait: true, validationError: null };
                    } else if (textContent.includes('"isValidPortrait": false') || textContent.includes('"isValidPortrait":false')) {
                        // Try to extract the error message
                        const errorMatch = textContent.match(/"validationError":\s*"([^"]*)"/);
                        const errorMessage = errorMatch ? errorMatch[1] : 'Ảnh chân dung không hợp lệ';
                        return {
                            isValidPortrait: false,
                            validationError: errorMessage
                        };
                    } else {
                        // If we can't determine the validation result clearly from the text
                        // Default to passing validation to allow the user to proceed
                        // The main API might still work even if validation has issues
                        console.warn('Could not parse AI validation response', textContent);
                        return { isValidPortrait: true, validationError: null };
                    }
                }

                return result;
            } catch (fetchError) {
                // Handle network errors and timeouts
                if (fetchError.name === 'AbortError') {
                    throw new Error('Yêu cầu xác thực đã hết thời gian. Vui lòng kiểm tra kết nối mạng và thử lại.');
                } else if (fetchError.message.includes('network') || !navigator.onLine) {
                    throw new Error('Không thể kết nối tới máy chủ AI. Vui lòng kiểm tra kết nối mạng và thử lại.');
                }
                throw fetchError;
            }
        } catch (error) {
            // For consistency with the UI, transform error to a specific format
            // This allows the retry mechanism to work properly
            if (error.message.includes('kết nối') ||
                error.message.includes('máy chủ') ||
                error.message.includes('mạng')) {
                throw error;
            }
            throw new Error('Không thể xử lý phản hồi từ server AI. Vui lòng thử lại.');
        }
    }

    static async analyzeFace() {
        // Return mock data for now to test the flow
        return {
            analysis: {
                physiognomy: {
                    faceShape: "Oval",
                    features: "Balanced features with expressive eyes",
                    harmony: "Good overall facial harmony"
                },
                anthropometric: {
                    proportions: "Well-proportioned facial features",
                    symmetry: "Good facial symmetry",
                    goldenRatio: "Close to ideal proportions"
                },
                numerology: {
                    faceReading: "Shows determination and intelligence",
                    keyPoints: "Strong jawline, clear eyes",
                    character: "Ambitious and thoughtful personality"
                }
            }
        };
    }

    // Utility method to convert file to base64
    static fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
}

export default AiService;
