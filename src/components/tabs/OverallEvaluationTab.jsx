import './TabStyles.css';

import {
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    PointElement,
    RadialLinearScale,
    Tooltip,
} from 'chart.js';
import React, { useRef } from 'react';

import PrintArea from './PrintArea';
import {Radar} from 'react-chartjs-2'
import annotationPlugin from 'chartjs-plugin-annotation';
import { useReactToPrint } from 'react-to-print';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    annotationPlugin
);

const features = [
    { featureKey: 'appearance', label: 'Ngoại hình' },
    { featureKey: 'personality', label: 'Tính cách' },
    { featureKey: 'lifestyle', label: 'Lối sống' },
    { featureKey: 'interests', label: 'Sở thích' },
    { featureKey: 'strengths', label: 'Điểm mạnh' },
    { featureKey: 'weaknesses', label: 'Điểm yếu' },
];


const options = {
    maintainAspectRatio: false, // Cho phép chiều cao co giãn
    scales: {
        r: {
            min: 0,
            max: 10,
            ticks: {
                stepSize: 1
            },
            pointLabels: {
                font: {
                    size: 11
                }
            }
        }
    }
};

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

const data = (overallEvaluation, overallEvaluationScores) => {
    return {
        labels: features.map(item => item.label),
        datasets: [
            {
                label: 'Điểm số',
                data: getFeatureDetails(overallEvaluation, overallEvaluationScores).scores,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    }
};



function OverallEvaluationTab({ faceData, isLoading }) {
    const printRef = useRef();

    // Check if we have face data
    const { overallEvaluation, overallEvaluationScores } = faceData || {};

    const print = useReactToPrint({
            documentTitle: 'Title',
            contentRef: printRef,
        })
    
    
    if (isLoading) {
        return <div className="loading-message">Đang tải dữ liệu ...</div>;
    }

    // Check if we have any data in the overall evaluation section

    if (!getFeatureDetails(overallEvaluation, overallEvaluationScores)) {
        return (
            <div className="tab-container">
                <div className="loading-message">
                    Không có dữ liệu phân tích. Vui lòng tải lên hình ảnh khuôn mặt để AI phân tích.
                </div>
            </div>
        );
    }

    return (
        <div className='row'>
            <div style={{display: 'none'}}>
                <PrintArea ref={printRef}/>
            </div>
            <div className='col-xl-6 col-12'>
                <div className='mb-3 d-flex justify-content-center flex-column'>
                    <div>
                        <button onClick={print}>Print this area</button>
                    </div>
                    {/* <Radar data={data(overallEvaluation, overallEvaluationScores)} options={options}/> */}
                </div>
            </div>
            <div className='col-xl-6 col-12'>
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
            </div>
        </div>
    );
}

export default OverallEvaluationTab;
