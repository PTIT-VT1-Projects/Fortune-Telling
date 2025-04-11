import RadarChart from './RadarChart';
import React from 'react'

const PrintArea = React.forwardRef(({image: avatar, overallEvaluation, overallEvaluationScores}, ref) => {
    return (
        <div ref={ref}>
            <div className='d-flex justify-content-between align-items-center ml-3 mr-3'>
                <img src='/images/ptit.png' alt='ptit' width={130} height={130} className='ml-2 mt-2'/>
                <div>
                    <p>Học viện Công nghệ Bưu chính Viễn thông</p>
                    <p className='text-center'>Khoa Viễn thông 1</p>
                </div>
                <img src='/images/vt1.png' alt='ptit' width={130} height={130} className='ml-2 mt-2'/>
            </div>

            <div className='ml-3 mr-3 d-flex justify-content-center'>
                <img src={avatar} width={200} height={200}/>
            </div>

            <RadarChart overallEvaluation={overallEvaluation} overallEvaluationScores={overallEvaluationScores}/>
        </div>
    )
});

export default PrintArea