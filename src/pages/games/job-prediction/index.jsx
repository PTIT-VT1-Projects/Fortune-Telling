import React from "react";

import ImageUploader from "../../../components/ImageUploader/ImageUploader";
import AgingTransition from "./components/AgingTransition";

import jobPredictionService from "./services/jobPredictionService";
import "./index.css";
import Newspaper from "./components/Newspaper";
import AnalysisProgress from "../../../components/AnalysisProgress/AnalysisProgress";

function randomMarkOneDecimal() {
  return parseFloat((Math.random() * (4 - 3) + 3).toFixed(1));
}

const JobPrediction = () => {
  const [file, setFile] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const randomMark = React.useState(randomMarkOneDecimal());

  const handleImageSelect = async (file) => {
    if (!file) {
      console.warn("Chưa chọn ảnh");
      return;
    }

    try {
      setLoading(true);
      const result = await jobPredictionService.createPortraitAfterFiveYears(
        file,
        randomMark,
      );
      setData(result);
      setFile(file);
    } catch (error) {
      console.error("Lỗi tạo ảnh:", error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setData(null);
  };

  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Dự đoán nghề nghiệp</h1>

          <div className="hero-subtitle">AI soi tướng, luận ngay sự nghiệp</div>

          <div className="hero-decoration" />
        </div>
      </div>

      {/* Chưa chọn ảnh */}
      {!file && (
        <ImageUploader
          onImageSelect={handleImageSelect}
          render={({ src }) => <AnalysisProgress image={src} file={file} />}
        />
      )}

      {/* Có ảnh gốc nhưng chưa có ảnh kết quả */}
      {file && !data && (
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

      {data && (
        <Newspaper
          data={data}
          fromImage={URL.createObjectURL(file)}
          mark={randomMark}
        />
      )}
    </>
  );
};

export default JobPrediction;
