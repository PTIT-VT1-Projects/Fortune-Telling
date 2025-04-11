import React from 'react'

const PrintArea = React.forwardRef((props, ref) => (
    <div ref={ref}>
        <div className='d-flex justify-content-between align-items-center ml-2 mr-2'>
            <img src='/images/ptit.png' alt='ptit' width={130} height={130} className='ml-2 mt-2'/>
            <div>
                <p>Học viện Công nghệ Bưu chính Viễn thông</p>
                <p className='text-center'>Khoa Viễn thông 1</p>
            </div>
            <img src='/images/vt1.png' alt='ptit' width={130} height={130} className='ml-2 mt-2'/>
        </div>
    </div>
));

export default PrintArea