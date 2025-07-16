import React from 'react';
import EmailScoreMap from './EmailScoreMap';

const emailAreaStyle = {
    fontFamily: 'Arial, sans-serif',
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '1rem',
    marginRight: '1rem',
    marginTop: '1rem',
};

const centerTextStyle = {
    textAlign: 'center',
};

const sectionStyle = {
    marginLeft: '1rem',
    marginRight: '1rem',
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const ageInfoStyle = {
    marginTop: '0.5rem',
};

const rowStyle = {
    display: 'flex',
    marginTop: '1rem',
    marginLeft: '1rem',
    marginRight: '1rem',
    alignItems: 'center',
};

const colLeftStyle = {
    width: '50%',
    paddingRight: '0.5rem',
};

const colRightStyle = {
    width: '50%',
    paddingLeft: '0.5rem',
};

const progressContainerStyle = {
    marginLeft: '1rem',
    marginRight: '1rem',
    marginTop: '1rem',
    color: '#ffffff',
    backgroundColor: '#f1f1f1',
    textAlign:'center'
};

const progressBarBackgroundStyle = {
    width: '100%',
    backgroundColor: '#eee',
    height: '20px',
    borderRadius: '10px',
    overflow: 'hidden',
};

const progressBarFillStyle = (fitnessLevel) => ({
    width: `${fitnessLevel}%`,
    backgroundColor: '#007bff',
    height: '100%',
});


const EmailArea = React.forwardRef(({age, overallEvaluation, overallEvaluationScores, fitnessLevel}, ref) => {
    return (
        <div ref={ref} id="emailArea" style={emailAreaStyle}>
            <div style={headerStyle}>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRygpS_6SRTLuPqHmkebAqcEhyS1d1lDAPUyw&s" alt="ptit" width="80" height="80" />
                <div style={centerTextStyle}>
                <p style={{ fontWeight: 'bold', margin: 0 }}>Học viện Công nghệ Bưu chính Viễn thông</p>
                <p style={{ margin: 0 }}>Khoa Viễn thông 1</p>
                </div>
                <img src="https://tel.ptit.edu.vn/wp-content/uploads/sites/24/2025/01/Logo-VT1_v9-902x750-copy1.png" alt="ptit" width="80" height="80" />
            </div>

            <div style={sectionStyle}>
                <div style={centerTextStyle}>
                <div style={ageInfoStyle}>
                    <span>Tuổi dự đoán: {age}</span>
                </div>
                </div>
            </div>

            <div style={rowStyle}>
                <div style={colLeftStyle}>
                    <EmailScoreMap isEven={true} overallEvaluation={overallEvaluation} overallEvaluationScores={overallEvaluationScores}/>
                </div>
                <div style={colRightStyle}>
                    <EmailScoreMap isEven={false} overallEvaluation={overallEvaluation} overallEvaluationScores={overallEvaluationScores}/>
                </div>
            </div>

            <h4>Mức độ tương thích ngành Viễn thông</h4>
            <div style={progressContainerStyle}>
                <div style={progressBarBackgroundStyle}>
                <div style={progressBarFillStyle(fitnessLevel)}>{fitnessLevel}%</div>
                </div>
            </div>
        </div>

    )
});

export default EmailArea