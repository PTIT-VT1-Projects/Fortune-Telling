import RadarChart from './RadarChart';
import React from 'react'
import ScoreMap from './ScoreMap';

const PrintArea = React.forwardRef(({image: avatar, overallEvaluation, overallEvaluationScores}, ref) => {
    return (
        <div ref={ref}>
            <div className='d-flex justify-content-between align-items-center ms-3 me-3'>
                <img src='/images/ptit.png' alt='ptit' width={130} height={130} className='mt-3'/>
                <div>
                    <p>Học viện Công nghệ Bưu chính Viễn thông</p>
                    <p className='text-center'>Khoa Viễn thông 1</p>
                </div>
                <img src='/images/vt1.png' alt='ptit' width={130} height={130} className='mt-3'/>
            </div>

            <div className='ml-3 mr-3 d-flex justify-content-center'>
                <img src={avatar} width={200} height={200}/>
            </div>

                <div className="row mt-4 me-3 align-items-center">
                    <div className='col-6'>
                        <RadarChart width={350} height={350} overallEvaluation={overallEvaluation} overallEvaluationScores={overallEvaluationScores}/>
                    </div>
                    <div className='col-6'>
                        <ScoreMap overallEvaluation={overallEvaluation} overallEvaluationScores={overallEvaluationScores}/>
                    </div>
                </div>
        </div>
    )
});

export default PrintArea