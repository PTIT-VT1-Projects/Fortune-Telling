import './ImageUploader.css';

import React, { useCallback, useRef, useState } from 'react';

import AnalysisProgress from '../AnalysisProgress/AnalysisProgress';

const ImageUploader = ({ onImageSelect, isLoading }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = useCallback(async (file) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageSelect(file, url);
    }, [onImageSelect]);

    const handleRetry = useCallback(() => {
    setPreviewUrl(null);
    }, []);

    // Handle drag and drop operations
    const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
        setIsDragging(true);
    } else if (e.type === 'dragleave') {
        setIsDragging(false);
    }
    }, []);

    const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFileSelect(file);
    }
    }, [handleFileSelect]);

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
        <div
            className={`upload-area ${isDragging ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={handleUploadClick}
        >
            <div className="upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        </div>
    </div>
    );
};

export default ImageUploader;
