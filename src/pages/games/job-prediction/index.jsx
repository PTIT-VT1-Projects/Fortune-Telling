import React from "react";

import ImageUploader from "../../../components/ImageUploader/ImageUploader";
import AgingTransition from "./components/AgingTransition";

import jobPredictionService from "./services/jobPredictionService";
import imageService from "../../../api/imageService";
import ScoreStamp from "./components/ScoreStamp";
import HTMLFlipBook from "react-pageflip";
import "./index.css";

const randomMath = () => {
  return 3;
};

const JobPrediction = () => {
  const [file, setFile] = React.useState(null);
  const [portraitImage, setPortraitImage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const flipBookRef = React.useRef(null);

  const setOriginalImage = async (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
  };

  const handleImageSelect = async () => {
    if (!file) {
      console.warn("Chưa chọn ảnh");
      return;
    }

    try {
      setLoading(true);

      const result =
        await jobPredictionService.createPortraitAfterFiveYears(file);

      // Nếu API trả Blob
      if (result instanceof Blob) {
        const base64 = await imageService.blobToBase64(result);
        setPortraitImage(base64);
        return;
      }

      // Nếu API trả object chứa blob
      if (result?.data instanceof Blob) {
        const base64 = await imageService.blobToBase64(result.data);
        setPortraitImage(base64);
        return;
      }

      // Nếu API đã trả base64 hoặc URL
      if (typeof result === "string") {
        setPortraitImage(result);
        return;
      }

      // Nếu API trả object dạng:
      // { image: "data:image/png;base64,..." }
      if (result?.image) {
        setPortraitImage(result.image);
        return;
      }

      // Nếu API trả:
      // { data: "data:image/png;base64,..." }
      if (typeof result?.data === "string") {
        setPortraitImage(result.data);
        return;
      }

      console.error("Không nhận diện được format ảnh trả về:", result);
    } catch (error) {
      console.error("Lỗi tạo ảnh:", error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPortraitImage(null);
  };

  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Dự đoán nghề nghiệp</h1>

          <div className="hero-subtitle">
            Đối đầu biểu cảm, bùng nổ thần thái.
          </div>

          <div className="hero-decoration" />
        </div>
      </div>

      {/* Chưa chọn ảnh */}
      {!file && (
        <ImageUploader
          onImageSelect={setOriginalImage}
          render={({ src }) => (
            <div className="text-center">
              <img
                src={src}
                alt="Preview"
                style={{
                  width: 450,
                  height: 450,
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        />
      )}

      {/* Có ảnh gốc nhưng chưa có ảnh kết quả */}
      {file && !portraitImage && (
        <div className="text-center">
          <img
            src={URL.createObjectURL(file)}
            alt="Original"
            style={{
              width: 450,
              height: 450,
              objectFit: "cover",
            }}
          />

          <div className="mt-3">
            <button
              type="button"
              onClick={handleImageSelect}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Đang xử lý..." : "Biến đổi"}
            </button>

            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="btn btn-secondary ms-2"
            >
              Chọn ảnh khác
            </button>
          </div>
        </div>
      )}

      {file && portraitImage && (
        <HTMLFlipBook
          ref={flipBookRef}
          width={500}
          height={500}
          size="fixed"
          drawShadow={true}
          showCover={true}
          flippingTime={1200}
          onInit={() => {
            setTimeout(() => {
              flipBookRef.current?.pageFlip()?.flipNext();
            }, 300);
          }}
        >
          <div className="page page-left">
            <ScoreStamp score={randomMath()} />
          </div>

          <div className="page page-right">
            <AgingTransition
              fromImage={URL.createObjectURL(file)}
              toImage={portraitImage}
              width={500}
              height={500}
              duration={5000}
              autoPlay
            />
          </div>
        </HTMLFlipBook>
      )}

      {/* Có đủ 2 ảnh -> chạy transition */}
      {file && portraitImage && (
        <div className="text-center">
          <AgingTransition
            fromImage={URL.createObjectURL(file)}
            toImage={portraitImage}
            width={500}
            height={500}
            duration={5000}
            autoPlay
          />

          <div className="mt-3">
            <button type="button" onClick={reset} className="btn btn-secondary">
              Chọn ảnh khác
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default JobPrediction;
