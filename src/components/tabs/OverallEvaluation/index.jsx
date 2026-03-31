import styles from "./index.module.css";

import React, { useRef } from "react";
import PrintArea from "../PrintArea/PrintArea";
import ScoreMap from "../ScoreMap";
import { getFeatureDetails } from "../features";
import { useReactToPrint } from "react-to-print";
import ProgressBar from "../../ProgressBar/ProgressBar";
import RadarChart from "../RadarChart";
import { FiPrinter } from "react-icons/fi";

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
    return (
      <div className={styles["loading-message"]}>Đang tải dữ liệu ...</div>
    );
  }

  if (!getFeatureDetails(overallEvaluation, overallEvaluationScores)) {
    return (
      <div className={styles["tab-container"]}>
        <div className={styles["loading-message"]}>
          Không có dữ liệu phân tích. Vui lòng tải lên hình ảnh khuôn mặt để AI
          phân tích.
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="">
        <PrintArea
          ref={printRef}
          image={image}
          overallEvaluation={overallEvaluation}
          overallEvaluationScores={overallEvaluationScores}
          age={faceData?.basicInfo?.age}
        />
      </div>

      <div className="col-xl-6 col-12 mt-2">
        <div className={`mb-3 ${styles["overall-chart-panel"]}`}>
          <div className={styles["overall-chart-toolbar"]}>
            <button className={styles["print"]} onClick={handlePrint}>
              <FiPrinter /> &nbsp; In
            </button>
          </div>

          <div className={styles["overall-chart-wrapper"]}>
            <RadarChart
              overallEvaluation={overallEvaluation}
              overallEvaluationScores={overallEvaluationScores}
              isPrinting={isPrinting}
            />
          </div>
        </div>

        <div className="mt-4">
          <h4 className={"user-simple-info"}>
            Mức độ tương thích ngành Viễn thông:
          </h4>
          <ProgressBar />
        </div>
      </div>

      <div className="col-xl-6 col-12 mt-2">
        <div className="d-flex flex-column justify-content-between h-100">
          <ScoreMap
            overallEvaluation={overallEvaluation}
            overallEvaluationScores={overallEvaluationScores}
            number={-1}
          />
        </div>
      </div>
    </div>
  );
}

export default OverallEvaluationTab;
