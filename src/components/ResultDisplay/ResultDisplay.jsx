import './ResultDisplay.css';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import AnalysisProgress from '../AnalysisProgress/AnalysisProgress';
import AnthropometryTab from '../tabs/AnthropometryTab';
import FaceReadingTab from '../tabs/FaceReadingTab';
import ImageService from '../../services/imageService';
import OverallEvaluationTab from '../tabs/OverallEvaluationTab';
import PhysiognomyTab from '../tabs/PhysiognomyTab';

const ResultDisplay = ({ image, faceData, onUploadNew, loading }) => {
    const [activeTab, setActiveTab] = useState('overallEvaluation');
    const [averageScore, setAverageScore] = useState(0);
    const [scoreRating, setScoreRating] = useState('');
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // Calculate overall score with weighted features from anthropometry and face reading
    const calculateOverallScore = useCallback((data) => {
    if (!data) return 0;

    // Define feature weights (total = 1)
    const featureWeights = [
        // Anthropometry (total 0.5)
        { source: 'anthropometryScores', key: 'faceShape', weight: 0.12 },
        { source: 'anthropometryScores', key: 'symmetryIndex', weight: 0.11 },
        { source: 'anthropometryScores', key: 'faceRatio', weight: 0.09 },
        { source: 'anthropometryScores', key: 'eyeDistance', weight: 0.07 },
        { source: 'anthropometryScores', key: 'noseRatio', weight: 0.06 },
        { source: 'anthropometryScores', key: 'faceBoneStructure', weight: 0.05 },

        // Face Reading (total 0.5)
        { source: 'faceReadingScores', key: 'eyes', weight: 0.12 },
        { source: 'faceReadingScores', key: 'nose', weight: 0.10 },
        { source: 'faceReadingScores', key: 'mouth', weight: 0.08 },
        { source: 'faceReadingScores', key: 'forehead', weight: 0.08 },
        { source: 'faceReadingScores', key: 'chin', weight: 0.06 },
        { source: 'faceReadingScores', key: 'eyebrows', weight: 0.06 }
    ];

    let totalScore = 0;
    let totalWeight = 0;
    let validScores = 0;

    // Calculate weighted score
    for (const feature of featureWeights) {
        let score = null;

        // Get score from appropriate source
        if (feature.source === 'anthropometryScores') {
        score = data.anthropometryScores?.[feature.key];
        } else if (feature.source === 'faceReadingScores') {
        score = data.faceReadingScores?.[feature.key];

        // Special handling for chin score
        if (feature.key === 'chin' && (score === undefined || score === null)) {
            score = data.faceFeatureScores?.chin;
        }
        }

        if (typeof score === 'number' && !isNaN(score)) {
        totalScore += score * feature.weight;
        totalWeight += feature.weight;
        validScores++;
        }
    }

    // Only calculate average if we have at least 75% of scores
    if (validScores >= Math.floor(featureWeights.length * 0.75)) {
        return totalScore / totalWeight;
    }

    return 0;
    }, []);

    // Function to get rating based on score and gender - chi tiết hơn, mỗi thang điểm riêng biệt
    const getRatingFromScore = useCallback((score) => {
    if (score === null || score === undefined || score === 0) return '';

    const gender = faceData?.basicInfo?.gender?.toLowerCase() || '';
    const age = faceData?.basicInfo?.age || 30;
    const isMale = gender === 'nam';
    const roundedScore = Math.round(score);

    // Ensure we have a valid gender before proceeding
    if (!gender) {
        return 'Chưa xác định';
    }

    // Trẻ em (dưới 12 tuổi)
    if (age < 12) {
        switch (roundedScore) {
        case 10: return 'Vô cùng dễ thương';
        case 9: return 'Cực kỳ dễ thương';
        case 8: return 'Rất dễ thương';
        case 7: return 'Dễ thương';
        case 6: return 'Khá dễ thương';
        case 5: return 'Dễ mến';
        case 4: return 'Bình thường';
        case 3: return 'Hơi kém hài hòa';
        case 2: return 'Hơi thiếu nét dễ thương';
        case 1: return 'Ít nét dễ thương';
        default: return 'Chưa đánh giá';
        }
    }

    // Thiếu niên (12-17 tuổi)
    if (age >= 12 && age < 18) {
        if (isMale) {
        switch (roundedScore) {
            case 10: return 'Cực kỳ hài hòa';
            case 9: return 'Rất dễ mến';
            case 8: return 'Dễ mến';
            case 7: return 'Khá dễ mến';
            case 6: return 'Dễ nhìn';
            case 5: return 'Ưa nhìn';
            case 4: return 'Trung bình';
            case 3: return 'Tạm được';
            case 2: return 'Hơi kém hài hòa';
            case 1: return 'Ít nét hài hòa';
            default: return 'Chưa đánh giá';
        }
        } else {
        switch (roundedScore) {
            case 10: return 'Cực kỳ xinh xắn';
            case 9: return 'Rất xinh xắn';
            case 8: return 'Xinh xắn';
            case 7: return 'Khá xinh xắn';
            case 6: return 'Dễ thương';
            case 5: return 'Ưa nhìn';
            case 4: return 'Trung bình';
            case 3: return 'Tạm được';
            case 2: return 'Hơi kém hài hòa';
            case 1: return 'Ít nét hài hòa';
            default: return 'Chưa đánh giá';
        }
        }
    }

    // Thanh niên (18-29 tuổi)
    if (age >= 18 && age < 30) {
        if (isMale) {
        switch (roundedScore) {
            case 10: return 'Cực kỳ phong độ';
            case 9: return 'Rất phong độ';
            case 8: return 'Phong độ';
            case 7: return 'Khá phong độ';
            case 6: return 'Điển trai';
            case 5: return 'Dễ nhìn';
            case 4: return 'Trung bình';
            case 3: return 'Bình thường';
            case 2: return 'Tạm được';
            case 1: return 'Ít nét cân đối';
            default: return 'Chưa đánh giá';
        }
        } else {
        switch (roundedScore) {
            case 10: return 'Cực kỳ quyến rũ';
            case 9: return 'Rất quyến rũ';
            case 8: return 'Quyến rũ';
            case 7: return 'Khá quyến rũ';
            case 6: return 'Duyên dáng';
            case 5: return 'Dễ nhìn';
            case 4: return 'Trung bình';
            case 3: return 'Bình thường';
            case 2: return 'Tạm được';
            case 1: return 'Ít nét cân đối';
            default: return 'Chưa đánh giá';
        }
        }
    }

    // Người trưởng thành (30-49 tuổi)
    if (age >= 30 && age < 50) {
        if (isMale) {
        switch (roundedScore) {
            case 10: return 'Cực kỳ lịch lãm';
            case 9: return 'Rất lịch lãm';
            case 8: return 'Lịch lãm';
            case 7: return 'Khá lịch lãm';
            case 6: return 'Nam tính';
            case 5: return 'Điềm đạm';
            case 4: return 'Trung bình';
            case 3: return 'Bình thường';
            case 2: return 'Tạm được';
            case 1: return 'Ít nét cân đối';
            default: return 'Chưa đánh giá';
        }
        } else {
        switch (roundedScore) {
            case 10: return 'Cực kỳ thanh lịch';
            case 9: return 'Rất thanh lịch';
            case 8: return 'Thanh lịch';
            case 7: return 'Khá thanh lịch';
            case 6: return 'Nữ tính';
            case 5: return 'Dịu dàng';
            case 4: return 'Trung bình';
            case 3: return 'Bình thường';
            case 2: return 'Tạm được';
            case 1: return 'Ít nét cân đối';
            default: return 'Chưa đánh giá';
        }
        }
    }

    // Người cao tuổi (từ 50 tuổi)
    if (age >= 50) {
        switch (roundedScore) {
        case 10: return isMale ? 'Cực kỳ phúc hậu' : 'Cực kỳ đằm thắm';
        case 9: return isMale ? 'Rất phúc hậu' : 'Rất đằm thắm';
        case 8: return isMale ? 'Phúc hậu' : 'Đằm thắm';
        case 7: return isMale ? 'Khá phúc hậu' : 'Khá đằm thắm';
        case 6: return isMale ? 'Đáng kính' : 'Đáng mến';
        case 5: return 'Hiền hòa';
        case 4: return 'Trung bình';
        case 3: return 'Bình thường';
        case 2: return 'Tạm được';
        case 1: return 'Hơi thiếu nét hài hòa';
        default: return 'Chưa đánh giá';
        }
    }

    // Fallback mặc định
    if (isMale) {
        switch (roundedScore) {
        case 10: return 'Cực kỳ đẹp trai';
        case 9: return 'Rất đẹp trai';
        case 8: return 'Đẹp trai';
        case 7: return 'Khá đẹp trai';
        case 6: return 'Dễ nhìn';
        case 5: return 'Trung bình khá';
        case 4: return 'Trung bình';
        case 3: return 'Bình thường';
        case 2: return 'Tạm được';
        case 1: return 'Ít nét hài hòa';
        default: return 'Chưa đánh giá';
        }
    } else {
        switch (roundedScore) {
        case 10: return 'Cực kỳ xinh đẹp';
        case 9: return 'Rất xinh đẹp';
        case 8: return 'Xinh đẹp';
        case 7: return 'Khá xinh đẹp';
        case 6: return 'Dễ thương';
        case 5: return 'Trung bình khá';
        case 4: return 'Trung bình';
        case 3: return 'Bình thường';
        case 2: return 'Tạm được';
        case 1: return 'Ít nét hài hòa';
        default: return 'Chưa đánh giá';
        }
    }
    }, [faceData?.basicInfo?.gender, faceData?.basicInfo?.age]);

    // Update score when face data changes
    useEffect(() => {
    if (faceData) {
        // Only calculate average score when no faceScore from API
        if (!faceData.faceScore) {
        const overallScore = calculateOverallScore(faceData);
        if (overallScore > 0) {
            // Chuyển sang số nguyên
            const roundedScore = Math.round(overallScore);
            setAverageScore(roundedScore);
            setScoreRating(getRatingFromScore(roundedScore));
        } else {
            setAverageScore(0);
            setScoreRating('Chưa đủ dữ liệu');
        }
        } else {
        // Use existing score from API and round to whole number
        const roundedScore = Math.round(faceData.faceScore);
        setAverageScore(roundedScore);
        setScoreRating(getRatingFromScore(roundedScore));
        }
    }
    }, [faceData, calculateOverallScore, getRatingFromScore]);

    // Handle file input change
    const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        try {
        // Validate image before processing
        const validationResult = await ImageService.validateBasic(file);

        if (!validationResult.isValid) {
            setError(validationResult.error);
            return;
        }

        const url = URL.createObjectURL(file);
        onUploadNew(file, url);
        } catch (err) {
        setError('Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.');
        }
    }
    };

    // Trigger file input click
    const handleUploadClick = () => {
    // Open file dialog when button is clicked
    fileInputRef.current?.click();
    };

    // Render tab content based on active tab
    const renderTabContent = () => {
    // Kiểm tra kỹ lưỡng faceData trước khi render
    if (!faceData) {
        return (
        <div className="loading-message">
            Không có dữ liệu phân tích, vui lòng thử lại
        </div>
        );
    }

    // Kiểm tra nếu faceData là object rỗng
    if (Object.keys(faceData).length === 0) {
        return (
        <div className="loading-message">
            Không có dữ liệu phân tích, vui lòng thử lại
        </div>
        );
    }

    try {
        // Kiểm tra các thuộc tính quan trọng có tồn tại không
        const hasBasicData = faceData.basicInfo && typeof faceData.basicInfo === 'object';
        const hasFaceScore = typeof faceData.faceScore === 'number' ||
                            (faceData.faceReadingScores && Object.keys(faceData.faceReadingScores).length > 0) ||
                            (faceData.anthropometryScores && Object.keys(faceData.anthropometryScores).length > 0);

        if (!hasBasicData || !hasFaceScore) {
        return (
            <div className="loading-message">
            Dữ liệu không đầy đủ, vui lòng thử lại với ảnh khác
            </div>
        );
        }

        // Render the appropriate tab based on activeTab
        switch (activeTab) {
        case 'overallEvaluation':
            return <OverallEvaluationTab faceData={faceData} isLoading={loading} />;
        case 'physiognomy':
            return <PhysiognomyTab faceData={faceData} isLoading={loading} />;
        case 'anthropometry':
            return <AnthropometryTab faceData={faceData} isLoading={loading} />;
        case 'faceReading':
            return <FaceReadingTab faceData={faceData} isLoading={loading} />;
        default:
            return <OverallEvaluationTab faceData={faceData} isLoading={loading} />;
        }
    } catch (error) {
        console.error("Error rendering tab content:", error);
        return (
        <div className="loading-message">
            Có lỗi xảy ra khi hiển thị dữ liệu, vui lòng thử lại
        </div>
        );
    }
    };

    // Render loading state with our new AnalysisInProgress component
    if (loading) {
    return <AnalysisProgress image={image} />;
    }

    // Render invalid image message if error code is INVALID_PORTRAIT
    if (error && error.includes('INVALID_PORTRAIT')) {
    return (
        <div className="result-display">
        <div className="invalid-image-message">
            <div className="invalid-image-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            </div>
            <h2 className="invalid-image-title">Ảnh không hợp lệ</h2>
            <p className="invalid-image-text">
            {error.replace('INVALID_PORTRAIT', '').trim() || 'Đây không phải là ảnh chân dung hợp lệ. Vui lòng upload ảnh khác.'}
            </p>
            <button className="analyze-again-button" onClick={handleUploadClick}>
            Upload ảnh mới
            </button>
            <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="file-input"
            style={{ display: 'none' }}
            />
        </div>
        </div>
    );
    }

    // Render invalid image message if error code is INVALID_PORTRAIT
    if (error) {
    return (
        <div className="result-display">
        <div className="invalid-image-message">
            <div className="invalid-image-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            </div>
            <h2 className="invalid-image-title">Ảnh không hợp lệ</h2>
            <p className="invalid-image-text">
            {error.includes('INVALID_PORTRAIT')
                ? error.replace('INVALID_PORTRAIT', '').trim() || 'Đây không phải là ảnh chân dung hợp lệ. Vui lòng tải lên ảnh khác.'
                : error || 'Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại với ảnh khác.'}
            </p>
            <button className="analyze-again-button" onClick={handleUploadClick}>
            Tải lên ảnh mới
            </button>
            <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="file-input"
            style={{ display: 'none' }}
            />
        </div>
        </div>
    );
    }

    // Render analysis results
    return (
    <div className="result-display">
        <div className="result-container">
        {/* Profile Section */}
        <div className="profile-section">
            <div className="profile-section-inner">
            <div className="profile-image-container">
                <img src={image} alt="Uploaded face" className="profile-image" />
            </div>

            <div className="basic-info">
                <div className="user-simple-info">
                {faceData?.basicInfo?.age} tuổi
                </div>
            </div>

            <div className="score-section">
                <div className="score-circle">
                <span className="score-value">
                    {faceData?.faceScore
                    ? Math.round(faceData.faceScore)
                    : Math.round(averageScore)}
                </span>
                </div>
            </div>

            <div className="rating-section">
                <div className="score-rating">
                {faceData?.faceScoreRating || scoreRating}
                </div>
            </div>

            <button className="analyze-again-button" onClick={handleUploadClick}>
                Chọn ảnh khác
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="file-input"
                style={{ display: 'none' }}
            />
            </div>
        </div>

        {/* Results Column */}
        <div className="results-column">
            {/* Tabs Navigation */}
            <div className="result-area">
            <div className="tabs-container">
                <div className="tab-buttons">
                <button
                    className={`tab-button ${activeTab === 'overallEvaluation' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overallEvaluation')}
                >
                    Tổng quan
                </button>
                <button
                    className={`tab-button ${activeTab === 'physiognomy' ? 'active' : ''}`}
                    onClick={() => setActiveTab('physiognomy')}
                >
                    Tướng số
                </button>
                <button
                    className={`tab-button ${activeTab === 'anthropometry' ? 'active' : ''}`}
                    onClick={() => setActiveTab('anthropometry')}
                >
                    Nhân trắc
                </button>
                <button
                    className={`tab-button ${activeTab === 'faceReading' ? 'active' : ''}`}
                    onClick={() => setActiveTab('faceReading')}
                >
                    Nhân tướng
                </button>
                </div>
            </div>
            {/* Tab Content */}
            <div className="tab-content">
                {renderTabContent()}
            </div>
            </div>
        </div>
        </div>
    </div>
    );
};

export default ResultDisplay;