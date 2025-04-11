const features = [
    { featureKey: 'appearance', label: 'Ngoại hình' },
    { featureKey: 'personality', label: 'Tính cách' },
    { featureKey: 'lifestyle', label: 'Lối sống' },
    { featureKey: 'interests', label: 'Sở thích' },
    { featureKey: 'strengths', label: 'Điểm mạnh' },
    { featureKey: 'weaknesses', label: 'Điểm yếu' },
];

// Function to get feature description and score
const getFeatureDetails = (overallEvaluation, overallEvaluationScores) => {
    let descriptions = [];
    let scores = [];
    features.map(feature => {
        const featureKey = feature.featureKey
        // Try to get description from overallEvaluation data
        if (overallEvaluation && overallEvaluation[featureKey]) {
            let description = overallEvaluation[featureKey];
            descriptions.push(description)
        }

        // Try to get score from overallEvaluationScores
        if (overallEvaluationScores && overallEvaluationScores[featureKey] !== undefined) {
            let score = overallEvaluationScores[featureKey];
            scores.push(score)
        }
    })

    return {
        descriptions,
        scores
    }
};

export {
    features,
    getFeatureDetails
}