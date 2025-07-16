import { features, getFeatureDetails } from "../../../../components/tabs/features";

const featureRow = {
    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2px 8px',
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgb(248, 249, 250)',
    borderRadius: '12px',
    padding: '1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgb(229, 231, 235)',
    transition: '0.3s',
    animation: 'fadeIn 0.5s ease-out 0s 1 normal none running',
    marginBottom: '12px',
};

const featureName = {
    fontWeight: 600,
    fontSize: '1rem',
    color: 'red',
    marginBottom: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}

const featureScore = {
    display: 'flex',
    alignItems: 'center'
}

const scoreBadgeHighlightStyle = {
    background: 'red',
    color: 'white',
    borderRadius: '10px',
    width: '1.2rem',
    height: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1rem',
    padding: '13px',
    marginLeft: '8px',
};

const featureDescriptionStyle = {
    margin: '0.5rem 0 0',
    lineHeight: 1.5,
    color: '#333',
    fontSize: '0.8rem',
};

const EmailScoreMap = ({overallEvaluation, overallEvaluationScores, isEven}) => {
    return (
        <>
            {features.filter((_, index) => isEven ? index % 2 == 0 : index % 2 != 0).map((feature, index) => (
                <div key={index} style={featureRow}>
                    <div style={featureName}>
                        {feature.label}
                        <div style={featureScore}>
                            <div style={scoreBadgeHighlightStyle}>
                                {getFeatureDetails(overallEvaluation, overallEvaluationScores).scores[index] !== null ? 
                                getFeatureDetails(overallEvaluation, overallEvaluationScores).scores[index] : '0'}
                            </div>
                        </div>
                    </div>
                    <p style={featureDescriptionStyle}>
                        {getFeatureDetails(overallEvaluation, overallEvaluationScores).descriptions[index] || `Không có dữ liệu về ${feature.name.toLowerCase()}.`}
                    </p>
                </div>
            ))}
        </>
    )
}

export default EmailScoreMap