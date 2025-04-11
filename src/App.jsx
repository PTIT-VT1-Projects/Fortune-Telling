import './App.css';

import React, { useCallback, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AnalysisProgress from './components/AnalysisProgress/AnalysisProgress';
import Features from './pages/Features/Features';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader/ImageUploader';
import ResultDisplay from './components/ResultDisplay/ResultDisplay';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleImageSelect = useCallback((file) => {
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
  }, [previewUrl]);

  const handleAnalysisComplete = useCallback((result) => {
    setAnalysisResult(result);
    setShowResult(true);
  }, []);

  const handleReset = useCallback((file) => {
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
  }, [handleImageSelect, previewUrl]);

  // Clean up object URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Router>
      <div className="app" id="app">
        <Header onResetApp={() => handleReset(null)} />
        <main className="main-content">
          <div className='container'>
            <Routes>
              <Route
                path="/"
                element={
                  !previewUrl ? (
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
                  )
                }
              />
              <Route path="/features" element={<Features />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
