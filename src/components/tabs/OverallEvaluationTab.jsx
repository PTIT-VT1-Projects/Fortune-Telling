import './TabStyles.css';

import React from 'react';

function OverallEvaluationTab({ faceData, isLoading }) {
    // Check if we have face data
    const { overallEvaluation, overallEvaluationScores } = faceData || {};

    // Function to get feature description and score
    const getFeatureDetails = (featureKey, title) => {
        let description = '';
        let score = null;

        // Try to get description from overallEvaluation data
        if (overallEvaluation && overallEvaluation[featureKey]) {
            description = overallEvaluation[featureKey];
        }

        // Try to get score from overallEvaluationScores
        if (overallEvaluationScores && overallEvaluationScores[featureKey] !== undefined) {
            score = overallEvaluationScores[featureKey];
        }

        return {
            name: title,
            description: description,
            score: typeof score === 'number' ? Math.round(score) : null
        };
    };

    // Features for display
    const features = [
        getFeatureDetails('appearance', "Ngoại hình"),
        getFeatureDetails('personality', "Tính cách"),
        getFeatureDetails('lifestyle', "Phong cách sống"),
        getFeatureDetails('interests', "Sở thích"),
        getFeatureDetails('strengths', "Điểm mạnh"),
        getFeatureDetails('weaknesses', "Điểm yếu")
    ];

    if (isLoading) {
        return <div className="loading-message">Đang tải dữ liệu ...</div>;
    }

    // Check if we have any data in the overall evaluation section
    const hasData = features.some(feature => feature.description || feature.score);

    if (!hasData) {
        return (
            <div className="tab-container">
                <div className="loading-message">
                    Không có dữ liệu phân tích. Vui lòng tải lên hình ảnh khuôn mặt để AI phân tích.
                </div>
            </div>
        );
    }

    return (
        <div className="tab-container">
            <div className="facial-features-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-row">
                        <div className="feature-name">
                            {feature.name}
                            <div className="feature-score">
                                <div className="score-badge">
                                    {feature.score !== null ? feature.score : '0'}
                                </div>
                            </div>
                        </div>
                        <p className="feature-description">
                            {feature.description || `Không có dữ liệu về ${feature.name.toLowerCase()}.`}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OverallEvaluationTab;