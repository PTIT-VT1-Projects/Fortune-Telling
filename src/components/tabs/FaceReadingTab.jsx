import './TabStyles.css';

import React from 'react';

function FaceReadingTab({ faceData, isLoading }) {
  // Check if we have face data
  const { faceReadingData, faceReadingScores } = faceData || {};

  // Function to get feature description and score
  const getFeatureDetails = (featureKey, defaultTitle) => {
    let description = '';
    let score = null; // No default score
    let title = defaultTitle; // Default title if not found in data

    // Try to get description and title from faceReadingData
    if (faceReadingData && faceReadingData.features) {
      const feature = faceReadingData.features.find(f => f.key === featureKey);
      if (feature) {
        if (feature.description) {
          description = feature.description;
        }
        if (feature.title) {
          title = feature.title;
        }
      }
    }

    // Get description for chin from faceReading if needed
    if (featureKey === 'chin' && description === '' && faceData?.faceReading?.chinAnalysis) {
      description = faceData.faceReading.chinAnalysis;
    }

    // Try to get score from faceReadingScores
    if (faceReadingScores && faceReadingScores[featureKey] !== undefined) {
      score = faceReadingScores[featureKey];
    }

    // Check faceFeatureScores for chin if needed
    if (featureKey === 'chin' && (score === null) && faceData?.faceFeatureScores?.chin !== undefined) {
      score = faceData.faceFeatureScores.chin;
    }

    return {
      name: title,
      description: description,
      score: typeof score === 'number' ? Math.round(score) : null
    };
  };

  // Features for display - sắp xếp theo trọng số
  const features = [
    getFeatureDetails('eyes', "Mắt"),         // 0.12
    getFeatureDetails('nose', "Mũi"),         // 0.10
    getFeatureDetails('mouth', "Miệng"),      // 0.08
    getFeatureDetails('forehead', "Trán"),    // 0.08
    getFeatureDetails('chin', "Cằm"),         // 0.06
    getFeatureDetails('eyebrows', "Lông mày") // 0.06
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
                <div className="score-badge-highlight">{feature.score !== null ? feature.score : ''}</div>
              </div>
            </div>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FaceReadingTab;
