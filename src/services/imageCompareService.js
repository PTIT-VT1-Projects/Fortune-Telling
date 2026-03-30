import {
  FaceLandmarker,
  FilesetResolver,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";

// Biến dùng chung để lưu trữ instance đã khởi tạo
let faceLandmarkerInstance = null;

async function getFaceLandmarker() {
  // Nếu đã khởi tạo rồi thì trả về luôn, không tải lại nữa
  if (faceLandmarkerInstance) return faceLandmarkerInstance;

  // 1. Khởi tạo landmarker từ Google CDN (Chỉ chạy 1 lần duy nhất)
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm",
  );

  faceLandmarkerInstance = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
    },
    outputFaceBlendshapes: true,
    runningMode: "IMAGE",
  });

  return faceLandmarkerInstance;
}

function createImgElement(base64) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject("Lỗi định dạng ảnh Base64");
    img.src = base64.startsWith("data:image")
      ? base64
      : `data:image/jpeg;base64,${base64}`;
  });
}

const imageCompareService = {
  compare: async (base64_1, base64_2) => {
    // Lấy instance (nếu chưa có sẽ tải, nếu có rồi sẽ dùng lại ngay lập tức)
    const faceLandmarker = await getFaceLandmarker();

    // 2. Chuyển base64 thành HTML Image
    const img1 = await createImgElement(base64_1);
    const img2 = await createImgElement(base64_2);

    // 3. Lấy Blendshapes (mảng các chỉ số biểu cảm)
    const result1 = faceLandmarker.detect(img1).faceBlendshapes[0]?.categories;
    const result2 = faceLandmarker.detect(img2).faceBlendshapes[0]?.categories;

    if (!result1 || !result2) return { error: "Không tìm thấy mặt" };

    // 4. So sánh sự khác biệt giữa các chỉ số biểu cảm
    let totalDiff = 0;
    result1.forEach((cat, index) => {
      totalDiff += Math.abs(cat.score - result2[index].score);
    });

    // Tính % tương đồng
    const similarity = Math.max(0, 100 - totalDiff * 10);

    return {
      similarity_percentage: similarity.toFixed(0), // Trả về số để dễ làm animation
      details: "Đã so sánh dựa trên 52 nhóm cơ mặt của Google MediaPipe",
    };
  },
};

export default imageCompareService;
