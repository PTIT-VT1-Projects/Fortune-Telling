import "./ImageUploader.css";

import React, { useCallback, useEffect, useRef, useState } from "react";

import AnalysisProgress from "../AnalysisProgress/AnalysisProgress";
import ImageService from "../../services/imageService";

const ImageUploader = ({ onImageSelect }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [useCamera, setUseCamera] = useState(true);

  // open camera
  useEffect(() => {
    // Mở webcam khi component mount
    if (useCamera) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Lỗi mở webcam: ", err);
        });
    }
  }, [useCamera]);

  //chụp ảnh
  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL("image/png");
    handleFileSelect(ImageService.base64ToImageFile(imageDataURL));
  };

  const handleFileSelect = useCallback(
    async (file) => {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageSelect(file, url);
    },
    [onImageSelect],
  );

  const handleRetry = useCallback(() => {
    setPreviewUrl(null);
  }, []);

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // If image is selected, show the analysis in progress UI
  if (previewUrl) {
    return <AnalysisProgress image={previewUrl} onRetry={handleRetry} />;
  }

  return (
    <div className="image-uploader">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Khám phá khuôn mặt</h1>
          <p className="hero-subtitle">Tìm hiểu bản thân, vén màn số phận</p>
          <div className="hero-decoration"></div>
        </div>
      </div>

      <div className="upload-container">
        <div className="upload-area">
          {useCamera && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: "100%", maxWidth: 250 }}
              />
              <button onClick={handleCapture} className="take-camera">
                📸 Chụp ảnh
              </button>
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </>
          )}

          {!useCamera && (
            <div onClick={handleUploadClick}>
              <div className="upload-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <h3 className="upload-title">Kéo thả hoặc tải ảnh chân dung</h3>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="file-input"
              />
            </div>
          )}
        </div>
        {/* Manual upload */}
        {useCamera && (
          <p style={{ cursor: "pointer" }} onClick={() => setUseCamera(false)}>
            Không quay được camera? Ấn vào đây để tải ảnh lên
          </p>
        )}
        {!useCamera && (
          <p style={{ cursor: "pointer" }} onClick={() => setUseCamera(true)}>
            Quay lại trang quét camera
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
