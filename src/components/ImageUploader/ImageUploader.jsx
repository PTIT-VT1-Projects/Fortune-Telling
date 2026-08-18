import styles from "./ImageUploader.module.css";

import { cloneElement, useCallback, useRef, useState } from "react";

import AnalysisProgress from "../AnalysisProgress/AnalysisProgress";
import ImageService from "../../services/imageService";
import ImageSnapshot from "../ImageSnapshot/index";
import { CiCamera } from "react-icons/ci";

const ImageUploader = ({ onImageSelect, previewComponent }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [isUsingCamera, setIsUsingCamera] = useState(true);

  //Xử lí hậu kì chụp ảnh
  const handleAfterSnapshot = (imageDataUrl) => {
    handleFileSelect(ImageService.base64ToImageFile(imageDataUrl));
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
    // Nếu có previewComponent được truyền từ ngoài vào, dùng nó (kèm props image + onRetry)
    if (previewComponent) {
      return cloneElement(previewComponent, {
        image: previewUrl,
        src: previewUrl,
        onRetry: handleRetry,
      });
    }

    // Fallback mặc định
    return <AnalysisProgress src={previewUrl} onRetry={handleRetry} />;
  }

  return (
    <>
      <div className={styles["upload-container"]}>
        <div className={styles["upload-area"]}>
          {isUsingCamera && (
            <ImageSnapshot
              handleAfterSnapshot={handleAfterSnapshot}
              element={
                <button className={styles["take-camera"]}>
                  <CiCamera /> &nbsp; Chụp ảnh
                </button>
              }
            />
          )}

          {!isUsingCamera && (
            <div onClick={handleUploadClick}>
              <div className={styles["upload-icon"]}>
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

              <h3 className={styles["upload-title"]}>
                Kéo thả hoặc tải ảnh chân dung
              </h3>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className={styles["file-input"]}
              />
            </div>
          )}
        </div>
      </div>
      <div className="text-center">
        {isUsingCamera && (
          <p
            className="mt-2"
            style={{ cursor: "pointer" }}
            onClick={() => setIsUsingCamera(false)}
          >
            Không quay được camera? Ấn vào đây để tải ảnh lên
          </p>
        )}

        {!isUsingCamera && (
          <p
            style={{ cursor: "pointer" }}
            onClick={() => setIsUsingCamera(true)}
          >
            Quay lại trang quét camera
          </p>
        )}
      </div>
    </>
  );
};

export default ImageUploader;
