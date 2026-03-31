import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

function Features() {
  const navigate = useNavigate();

  return (
    <div className="page-container features-page">
      <div className="page-content">
        <div className="row">
          <div
            className="col-md-6 mt-2"
            onClick={() => navigate("face-reading")}
          >
            <div className={styles["feature-card"]}>
              <div className="feature-icon-container">
                <div className="feature-icon overview-icon">
                  <img
                    src="/images/face-reader.svg"
                    alt="Tổng quan"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
              <div className={styles["feature-text"]}>
                <h2 className="feature-title">BÓI MẶT AI</h2>
                <p>
                  Chụp ảnh bằng camera để AI đoán tuổi, soi tính cách và chấm
                  điểm gương mặt. Vui là chính, chính xác là chuyện tính sau.
                </p>
              </div>
            </div>
          </div>
          <div
            className="col-md-6 mt-2"
            onClick={() => navigate("emotion-arena")}
          >
            <div className={styles["feature-card"]}>
              <div className="feature-icon-container">
                <div className="feature-icon physiognomy-icon">
                  <img
                    src="/images/face-arena.svg"
                    alt="Tướng số học"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
              <div className={styles["feature-text"]}>
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
    </div>
  );
}

export default Features;
