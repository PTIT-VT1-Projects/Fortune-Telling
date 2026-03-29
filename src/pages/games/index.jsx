import { useNavigate } from "react-router-dom";
function Features() {
  const navigate = useNavigate();

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
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
            <div
              className="feature-text"
              onClick={() => navigate("face-reading")}
            >
              <h2 className="feature-title">BÓI MẶT AI</h2>
              <p>
                Chụp ảnh bằng camera để AI đoán tuổi, soi tính cách và chấm điểm
                gương mặt. Vui là chính, chính xác là chuyện tính sau.
              </p>
            </div>
          </div>

          {/* Tướng số học */}
          <div className="feature-card">
            <div className="feature-icon-container">
              <div className="feature-icon physiognomy-icon">
                <img
                  src="/images/physiognomy.svg"
                  alt="Tướng số học"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="feature-text">
              <h2 className="feature-title">ĐẤU TRƯỜNG BIỂU CẢM</h2>
              <p>
                Dùng camera chụp khuôn mặt rồi so với ảnh mẫu để xem bạn bắt
                chước biểu cảm đỉnh cỡ nào. Giống thì được điểm, lệch thì được
                tiếng cười.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
