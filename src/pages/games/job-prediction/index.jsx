import ImageUploader from "../../../components/ImageUploader/ImageUploader";
import jobPredictionService from "./services/jobPredictionService";
import React from "react";

const JobPrediction = () => {
  const [portraitImage, setPortraitImage] = React.useState(null);

  const handleImageSelect = async (file) => {
    if (!file) return;
    const portraitAfterFiveYears =
      await jobPredictionService.createPortraitAfterFiveYears(file);
    setPortraitImage(portraitAfterFiveYears);
  };

  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Dự đoán nghề nghiệp</h1>
          <div className="hero-subtitle">
            Đối đầu biểu cảm, bùng nổ thần thái.
          </div>
          <div className="hero-decoration"></div>
        </div>
      </div>

      {portraitImage ? (
        <img src={portraitImage} alt="Portrait After Five Years" />
      ) : (
        <ImageUploader
          onImageSelect={handleImageSelect}
          previewComponent={<img />}
        />
      )}
    </>
  );
};

export default JobPrediction;
