import RadarChart from './RadarChart';
import React from 'react'
import ScoreMap from './ScoreMap';
import './PrintArea.css'

const PrintArea = React.forwardRef(({age, image: avatar, overallEvaluation, overallEvaluationScores}, ref) => {
    return (
        <div ref={ref}>
            <div className='d-flex justify-content-between align-items-center ms-4 me-4 mt-4 align-items-center'>
                <img src='/images/ptit.png' alt='ptit' width={80} height={80} />
                <div>
                    <p className='fw-bold m-0'>Học viện Công nghệ Bưu chính Viễn thông</p>
                    <p className='text-center m-0'>Khoa Viễn thông 1</p>
                </div>
                <img src='/images/vt1.png' alt='ptit' width={80} height={80} />
            </div>

            <div className='ml-3 mr-3 mt-4 d-flex justify-content-center align-items-center'>
                <div>
                    <img src={avatar} width={200} height={200}/>
                    <div className="user-simple-info mt-2">
                        <span>{age} tuổi</span>
                    </div>
                </div>

                <div>
                    <RadarChart width={370} height={370} overallEvaluation={overallEvaluation} overallEvaluationScores={overallEvaluationScores}/>
                </div>
            </div>

                <div className="row mt-4 me-3 ms-3 align-items-center">
                    <div className='col-6 odd'>
                        <ScoreMap overallEvaluation={overallEvaluation} overallEvaluationScores={overallEvaluationScores}/>
                    </div>
                    <div className='col-6 even'>
                        <ScoreMap overallEvaluation={overallEvaluation} overallEvaluationScores={overallEvaluationScores}/>
                    </div>
                </div>
        </div>
    )
});

export default PrintArea