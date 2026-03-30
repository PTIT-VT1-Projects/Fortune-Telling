import "./index.css";

import React, { useRef } from "react";
import PrintArea from "../PrintArea/PrintArea";
import ScoreMap from "../ScoreMap";
import { getFeatureDetails } from "../features";
import { useReactToPrint } from "react-to-print";
import ProgressBar from "../../ProgressBar/ProgressBar";
import RadarChart from "../RadarChart";

function OverallEvaluationTab({ faceData, isLoading, image }) {
  const printRef = useRef();
  const [isPrinting, setIsPrinting] = React.useState(false);

  const { overallEvaluation, overallEvaluationScores } = faceData || {};

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Fortune teller",
    onBeforePrint: async () => {
      setIsPrinting(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  if (isLoading) {
    return <div className="loading-message">Đang tải dữ liệu ...</div>;
  }

  if (!getFeatureDetails(overallEvaluation, overallEvaluationScores)) {
    return (
      <div className="tab-container">
        <div className="loading-message">
          Không có dữ liệu phân tích. Vui lòng tải lên hình ảnh khuôn mặt để AI
          phân tích.
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="d-none">
        <PrintArea
          ref={printRef}
          image={image}
          overallEvaluation={overallEvaluation}
          overallEvaluationScores={overallEvaluationScores}
          age={faceData?.basicInfo?.age}
        />
      </div>

      <div className="col-xl-6 col-12">
        <div className="mb-3 overall-chart-panel">
          <div className="overall-chart-toolbar">
            <button className="take-camera" onClick={handlePrint}>
              In
            </button>
          </div>

          <div className="overall-chart-wrapper">
            <RadarChart
              overallEvaluation={overallEvaluation}
              overallEvaluationScores={overallEvaluationScores}
              isPrinting={isPrinting}
            />
          </div>
        </div>

        <div className="mt-4">
          <h4>Mức độ tương thích ngành Viễn thông:</h4>
          <ProgressBar />
        </div>
      </div>

      <div className="col-xl-6 col-12">
        <ScoreMap
          overallEvaluation={overallEvaluation}
          overallEvaluationScores={overallEvaluationScores}
        />
      </div>
    </div>
  );
}

export default OverallEvaluationTab;
