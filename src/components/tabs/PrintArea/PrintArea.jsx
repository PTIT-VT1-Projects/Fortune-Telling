import React from "react";
import RadarChart from "../RadarChart";
import ScoreMap from "../ScoreMap";
import "./PrintArea.css"; // Nếu dùng CSS thuần, import trực tiếp như này

const PrintArea = React.forwardRef(
  ({ age, image: avatar, overallEvaluation, overallEvaluationScores }, ref) => {
    // Tạo props chung để truyền vào ScoreMap cho đỡ lặp code
    const scoreProps = { overallEvaluation, overallEvaluationScores };

    return (
      <div ref={ref} className="print-container">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center px-4 mt-4">
          <img src="/images/ptit.png" alt="Logo PTIT" width={80} height={80} />
          <div className="text-center">
            <p className="fw-bold m-0 uppercase">
              Học viện Công nghệ Bưu chính Viễn thông
            </p>
            <p className="m-0">Khoa Viễn thông 1</p>
          </div>
          <img src="/images/vt1.png" alt="Logo VT1" width={80} height={80} />
        </div>

        {/* Profile & Radar Chart Section */}
        <div className="mt-4 d-flex justify-content-center align-items-center gap-4">
          <div className="text-center">
            <img
              src={avatar}
              alt="User Avatar"
              width={200}
              height={200}
              className="border rounded"
            />
            <div className="user-simple-info mt-2">
              <span className="fw-bold">Tuổi dự đoán: {age}</span>
            </div>
          </div>

          <div className="radar-chart-wrapper">
            <RadarChart width={370} height={370} {...scoreProps} />
          </div>
        </div>

        {/* Score Maps Section - Logic Odd/Even */}
        <div className="row mt-4 mx-3 align-items-center">
          {/* Cột hiển thị cho trường hợp ODD (ẩn hàng chẵn theo CSS của bạn) */}
          <div className="col-6 odd">
            <ScoreMap {...scoreProps} />
          </div>

          {/* Cột hiển thị cho trường hợp EVEN (ẩn hàng lẻ theo CSS của bạn) */}
          <div className="col-6 even">
            <ScoreMap {...scoreProps} />
          </div>
        </div>
      </div>
    );
  },
);

PrintArea.displayName = "PrintArea"; // Tốt cho debugging khi dùng forwardRef

export default PrintArea;
