import './TabStyles.css';

import React, { useRef } from 'react';

import PrintArea from './PrintArea';
import RadarChart from './RadarChart';
import ScoreMap from './ScoreMap';
import {getFeatureDetails} from './features';
import { useReactToPrint } from 'react-to-print';

function OverallEvaluationTab({ faceData, isLoading, image }) {
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
            {/* Print area */}
            <div style={{display: 'none'}}>
                <PrintArea ref={printRef} image={image} overallEvaluation={overallEvaluation} overallEvaluationScores={overallEvaluationScores}/>
            </div>
            <div className='col-xl-6 col-12'>
                <div className='mb-3 d-flex justify-content-center flex-column'>
                    <div>
                        <button className='take-camera' onClick={print}> In</button>
                    </div>
                    <div className='align-items-center'>
                        <RadarChart overallEvaluation={overallEvaluation} overallEvaluationScores={overallEvaluationScores}/>
                    </div>
                </div>
            </div>
            <div className='col-xl-6 col-12'>
                <ScoreMap overallEvaluation={overallEvaluation} overallEvaluationScores={overallEvaluationScores} />
            </div>
        </div>
    );
}

export default OverallEvaluationTab;
