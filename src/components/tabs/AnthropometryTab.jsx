import './TabStyles.css';

import React from 'react';

function AnthropometryTab({ faceData, isLoading }) {
  // Check if we have face data
  const { anthropometryData, anthropometryScores } = faceData || {};

  // Function to get feature description and score
  const getFeatureDetails = (key, title) => {
    return {
      key,
      title,
      description: anthropometryData?.[key] || "",
      score: anthropometryScores?.[key] || 0
    };
  };

  // Define features to display
  const features = [
    getFeatureDetails('faceShape', "Hình dáng mặt"),      // 0.12
    getFeatureDetails('symmetryIndex', "Sự cân đối"),     // 0.11
    getFeatureDetails('faceRatio', "Tỷ lệ mặt"),    // 0.09
    getFeatureDetails('noseRatio', "Tỷ lệ mũi"),          // 0.06
    getFeatureDetails('eyeDistance', "Khoảng cách mắt"),  // 0.07
    getFeatureDetails('faceBoneStructure', "Cấu trúc xương") // 0.05
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
              {feature.title}
              <div className="feature-score">
                <div className="score-badge-highlight">{feature.score || ''}</div>
              </div>
            </div>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnthropometryTab;
