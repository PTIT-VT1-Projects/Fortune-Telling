import './Features.css';

import React from 'react';

function Features() {
  return (
    <div className="page-container features-page">
      <div className="page-content">
        <div className="features-grid">
          {/* Tổng quan */}
          <div className="feature-card">
            <div className="feature-icon-container">
              <div className="feature-icon overview-icon">
                <img
                  src="/images/overview.svg"
                  alt="Tổng quan"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="feature-text">
              <h2 className="feature-title">TỔNG QUAN</h2>
              <p>Đưa ra các đánh giá toàn diện vể ngoại hình, tính cách, điểm mạnh yếu hay phong cách sống của bạn.</p>
            </div>
          </div>

          {/* Tướng số học */}
          <div className="feature-card">
            <div className="feature-icon-container">
              <div className="feature-icon physiognomy-icon">
                <img
                  src="/images/physiognomy.svg"
                  alt="Tướng số học"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="feature-text">
              <h2 className="feature-title">TƯỚNG SỐ</h2>
              <p>Phân tích khuôn mặt dựa trên tướng số học, cho kết quả về tình cảm, vận mệnh, tài lộc, sự nghiệp và tương lai.</p>
            </div>
          </div>

          {/* Nhân trắc học */}
          <div className="feature-card">
            <div className="feature-icon-container">
              <div className="feature-icon anthropometry-icon">
                <img
                  src="/images/anthropometry.svg"
                  alt="Nhân trắc học"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="feature-text">
              <h2 className="feature-title">NHÂN TRẮC</h2>
              <p>Phân tích khuôn mặt dựa trên nhân trắc học, đưa ra các thông số định lượng, chỉ số cân đối và đánh giá sự hài hòa.</p>
            </div>
          </div>

          {/* Nhân tướng học */}
          <div className="feature-card">
            <div className="feature-icon-container">
              <div className="feature-icon face-reading-icon">
                <img
                  src="/images/face-reading.svg"
                  alt="Nhân tướng học"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="feature-text">
              <h2 className="feature-title">NHÂN TƯỚNG</h2>
              <p>Phân tích khuôn mặt dựa trên nhân tướng học, cho đánh giá chuyên sâu về tính thẩm mỹ của các bộ phận trên khuôn mặt.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;