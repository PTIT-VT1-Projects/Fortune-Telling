import React, { useState, useCallback } from "react";
import ImageUploader from "../../../components/ImageUploader/ImageUploader";
import ResultDisplay from "../../../components/ResultDisplay/ResultDisplay";
import AnalysisProgress from "../../../components/AnalysisProgress/AnalysisProgress";

const FaceReading = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnalysisComplete = useCallback((result) => {
    setAnalysisResult(result);
    setShowResult(true);
  }, []);

  const handleImageSelect = useCallback(
    (file) => {
      if (!file) return;

      // Clean up previous URL if exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysisResult(null);
      setShowResult(false);
    },
    [previewUrl],
  );

  const handleReset = useCallback(
    (file) => {
      // Clean up previous URL if exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      if (file) {
        handleImageSelect(file);
      } else {
        setSelectedFile(null);
        setPreviewUrl(null);
        setAnalysisResult(null);
        setShowResult(false);
      }
    },
    [handleImageSelect, previewUrl],
  );

  // Clean up object URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      {!previewUrl ? (
        <ImageUploader onImageSelect={handleImageSelect} />
      ) : showResult ? (
        <ResultDisplay
          image={previewUrl}
          faceData={analysisResult}
          onUploadNew={handleImageSelect}
        />
      ) : (
        <AnalysisProgress
          file={selectedFile}
          image={previewUrl}
          onRetry={handleReset}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}
    </>
  );
};

export default FaceReading;
