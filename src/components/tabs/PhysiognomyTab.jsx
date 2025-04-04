import './TabStyles.css';

import React from 'react';

function PhysiognomyTab({ faceData, isLoading }) {
  // Check if we have face data
  const { physiognomy, physiognomyScores } = faceData || {};

  // Function to get feature description and score
  const getFeatureDetails = (featureKey, title) => {
    let description = '';
    let score = null; // No default score

    // Try to get description from physiognomy data
    if (physiognomy && physiognomy[featureKey]) {
      description = physiognomy[featureKey];
    }

    // Try to get score from physiognomyScores
    if (physiognomyScores && physiognomyScores[featureKey] !== undefined) {
      score = physiognomyScores[featureKey];
    }
    return {
      name: title,
      description: description,
      score: typeof score === 'number' ? Math.round(score) : null
    };
  };

  // Features for display
  const features = [
    getFeatureDetails('wisdom', "Trí tuệ"),
    getFeatureDetails('romance', "Tình cảm"),
    getFeatureDetails('relationships', "Quan hệ"),
    getFeatureDetails('fortune', "Tài lộc"),
    getFeatureDetails('career', "Sự nghiệp"),
    getFeatureDetails('future', "Vận mệnh")
  ];

  if (isLoading) {
    return <div className="loading-message">Đang tải dữ liệu ...</div>;
  }

  return (
    <div className="tab-container">
      <div className="facial-features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-row">
            <div className="feature-name">
              {feature.name}
              <div className="feature-score">
                <div className="score-badge-highlight">
                  {feature.score !== null ? feature.score : "N/A"}
                </div>
              </div>
            </div>
            <p className="feature-description">
              {feature.description || "Không có thông tin"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhysiognomyTab;
