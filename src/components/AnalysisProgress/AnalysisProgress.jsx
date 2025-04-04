import './AnalysisProgress.css';

import React, { useEffect, useRef, useState } from 'react';

import AiService from '../../services/aiService';
import ApiService from '../../services/apiService';
import ImageService from '../../services/imageService';

const AnalysisProgress = ({ file, image, onRetry, onAnalysisComplete }) => {
    const [statusText, setStatusText] = useState('Đang kiểm tra ảnh');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [validationError, setValidationError] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isApiError, setIsApiError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [dotsCount, setDotsCount] = useState(0);
    const fileInputRef = useRef(null);
    const maxRetries = 3;

    // Dots animation
    useEffect(() => {
    const dotsInterval = setInterval(() => {
        setDotsCount(prev => (prev + 1) % 4);
    }, 400);

    return () => clearInterval(dotsInterval);
    }, []);

    // Update viewport width on resize
    useEffect(() => {
    const handleResize = () => {
        setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate dynamic blur based on viewport size
    const getBlurAmount = () => {
    if (viewportWidth >= 1920) return '5px';
    if (viewportWidth >= 1024) return '4px';
    return '3px';
    };

    const handleFileSelect = (event) => {
    const newFile = event.target.files[0];
    if (newFile) {
        onRetry(newFile);
    }
    };

    // Handle direct retry with same image
    const handleRetry = () => {
    setValidationError(null);
    setIsApiError(false);
    setRetryCount(prevCount => prevCount + 1);
    };

    // Effect to notify parent when analysis is complete
    useEffect(() => {
    if (analysisResult && loadingProgress === 100) {
        // Add a slight delay for better UX
        const timer = setTimeout(() => {
        if (onAnalysisComplete) {
            onAnalysisComplete(analysisResult);
        }
        }, 1000);

        return () => clearTimeout(timer);
    }
    }, [analysisResult, loadingProgress, onAnalysisComplete]);

    useEffect(() => {
    // Only process if we have a file
    if (!file) return;

    // Reset states
    setValidationError(null);
    setAnalysisResult(null);
    setLoadingProgress(0);
    setStatusText('Đang kiểm tra ảnh');
    setIsApiError(false);

    const validateAndAnalyze = async () => {
        try {
        // Step 1: Basic validation (0-10%)
        setLoadingProgress(5);

        // Use the new unified Image Service for basic validation (type, size, etc)
        const validationResult = await ImageService.validateBasic(file);

        if (!validationResult.isValid) {
            setValidationError(validationResult.error);
            setLoadingProgress(20);
            return;
        }

        // Step 2: AI validation for portrait (10-20%)
        setLoadingProgress(10);
        setStatusText('Đang xác thực ảnh chân dung');

        try {
            // Convert to base64 for AI validation
            const reader = new FileReader();
            const base64Promise = new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
            });
            const base64Image = await base64Promise;

            // Use AiService to validate if it's a portrait
            const aiValidation = await AiService.validatePortrait(base64Image, file.type);

            if (!aiValidation.isValidPortrait) {
            const errorMessage = aiValidation.validationError || 'Ảnh chân dung không hợp lệ';
            setValidationError(errorMessage);
            setLoadingProgress(20);
            return;
            }
        } catch (error) {
            console.log(error)
            // If this is a network error or transient issue, let the user retry
            if (error.message.includes('server') || error.message.includes('kết nối')) {
            setIsApiError(true);
            setValidationError('Lỗi kết nối với máy chủ. Vui lòng thử lại.');
            setLoadingProgress(20);
            return;
            }

            // For development, we will continue despite other AI validation errors
            console.warn('AI validation error:', error.message);
        }

        // Validation passed (20%), continue with analysis
        setLoadingProgress(20);

        // Step 3: Analysis steps (20-90%)
        const analysisSteps = [
            { text: 'Đang phân tích tổng quan', progress: 30 },
            { text: 'Đang phân tích tướng số học', progress: 50 },
            { text: 'Đang phân tích nhân trắc học', progress: 70 },
            { text: 'Đang phân tích nhân tướng học', progress: 90 }
        ];

        for (const step of analysisSteps) {
            setStatusText(step.text);
            setLoadingProgress(step.progress);
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Step 4: Final analysis with real API
        setStatusText('Đang tính toán kết quả');
        // Add a special class to highlight the final step
        document.querySelector('.analysis-badge').classList.add('final-analysis');
        setLoadingProgress(90);

        try {
            // Call the actual API service to get real analysis
            // Convert to base64 again for API
            const reader = new FileReader();
            const base64Promise = new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
            });
            const base64Image = await base64Promise;

            // Call the ApiService with a built-in retry mechanism
            let apiResult = null;
            let retryAttempts = 0;
            const maxApiRetries = 2; // Try up to 3 times total (initial + 2 retries)

            while (retryAttempts <= maxApiRetries) {
            try {
                apiResult = await ApiService.analyzeFace(base64Image);
                break; // Success, exit the loop
            } catch (apiError) {
                retryAttempts++;

                // If we've reached the max retries, throw the error
                if (retryAttempts > maxApiRetries) {
                throw apiError;
                }

                // Wait before retrying (exponential backoff)
                const retryDelay = 1000 * Math.pow(2, retryAttempts);
                await new Promise(resolve => setTimeout(resolve, retryDelay));

                // Update status for retry
                setStatusText(`Đang thử lại lần ${retryAttempts} ...`);
            }
            }

            // Set the analysis result from the API
            setAnalysisResult(apiResult);
        } catch (apiError) {
            setIsApiError(true);
            throw new Error('Có lỗi xảy ra khi phân tích khuôn mặt với API. Vui lòng thử lại.');
        }

        setLoadingProgress(100);

        } catch (error) {
        setValidationError(error.message || 'Có lỗi xảy ra khi kiểm tra ảnh. Vui lòng thử lại.');
        setLoadingProgress(20);
        }
    };

    validateAndAnalyze();
    }, [file, retryCount]);

    // If there's a validation error, show error UI
    if (validationError) {
    return (
        <div className="analysis-wrapper">
        <div className="analysis-container error-container">
            <div className="analysis-badge error-badge">
            {isApiError ? 'Lỗi kết nối API' : 'Xác thực ảnh lỗi'}
            </div>

            <div className="analysis-content error-content">
            {image && (
                <img
                src={image}
                alt="Ảnh không hợp lệ"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: `blur(${getBlurAmount()}) brightness(0.8) ${isApiError ? '' : 'grayscale(80%)'}`,
                    transform: 'scale(1.05)',
                    borderRadius: `clamp(8px, 1vw, 16px)`
                }}
                />
            )}

            <div className="analysis-error">
                <div className="error-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                </div>
                <p className="error-text">{validationError}</p>
                <div className="error-actions">
                {isApiError && (
                    <button
                    className="retry-button api-retry-button"
                    onClick={handleRetry}
                    disabled={retryCount >= maxRetries}
                    >
                    Thử lại
                    </button>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
                <button
                    className="retry-button"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Chọn ảnh khác
                </button>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    }

    // Show analysis progress UI
    return (
    <div className="analysis-wrapper">
        <div className="analysis-container">
        <div className="analysis-badge">Ảnh đang được xử lý</div>

        <div className="analysis-content">
            {image && (
            <img
                src={image}
                alt="Ảnh đang phân tích"
                style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: `blur(${getBlurAmount()}) brightness(0.8)`,
                transform: 'scale(1.05)',
                borderRadius: `clamp(8px, 1vw, 16px)`
                }}
            />
            )}

            <div className="analysis-loading">
            <div className="scanning-line"></div>
            <div className="loading-spinner"></div>

            <div className="analysis-progress">
                <div
                className="progress-bar"
                style={{
                    width: `${loadingProgress}%`,
                    animation: 'none'
                }}
                ></div>
            </div>

            <div className="analysis-status">
                {statusText}<span className="animated-dots">{''.padEnd(dotsCount, '.')}</span>
            </div>
            </div>
        </div>
        </div>
    </div>
    );
};

export default AnalysisProgress;