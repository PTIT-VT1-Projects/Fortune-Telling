import {features, getFeatureDetails} from "./features"

const ScoreMap = ({overallEvaluation, overallEvaluationScores}) => {
    return (
        <>
            {features.map((feature, index) => (
                <div key={index} className="feature-row">
                    <div className="feature-name">
                        {feature.label}
                        <div className="feature-score">
                            <div className="score-badge-highlight">
                                {getFeatureDetails(overallEvaluation, overallEvaluationScores).scores[index] !== null ? 
                                getFeatureDetails(overallEvaluation, overallEvaluationScores).scores[index] : '0'}
                            </div>
                        </div>
                    </div>
                    <p className="feature-description">
                        {getFeatureDetails(overallEvaluation, overallEvaluationScores).descriptions[index] || `Không có dữ liệu về ${feature.name.toLowerCase()}.`}
                    </p>
                </div>
            ))}
        </>
    )
}

export default ScoreMap