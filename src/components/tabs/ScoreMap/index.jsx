import { features, getFeatureDetails } from "../features";
import styles from "./index.module.css";

const ScoreMapItem = ({ feature, featureDetails, index }) => {
  return (
    <div className={styles["feature-row"]}>
      <div className={styles["feature-name"]}>
        {feature.label}
        <div className={styles["feature-score"]}>
          <div className={styles["score-badge-highlight"]}>
            {featureDetails.scores[index] !== null
              ? featureDetails.scores[index]
              : "0"}
          </div>
        </div>
      </div>
      <p className={styles["feature-description"]}>
        {featureDetails.descriptions[index] || "Không có dữ liệu"}
      </p>
    </div>
  );
};

const ScoreMap = ({ overallEvaluation, overallEvaluationScores, number }) => {
  const featureDetails = getFeatureDetails(
    overallEvaluation,
    overallEvaluationScores,
  );

  return (
    <>
      {features.map((feature, index) => {
        if (number == -1) {
          return (
            <ScoreMapItem
              feature={feature}
              featureDetails={featureDetails}
              key={index}
              index={index}
            />
          );
        }
        if (index % 2 == number) {
          return (
            <ScoreMapItem
              feature={feature}
              featureDetails={featureDetails}
              key={index}
              index={index}
            />
          );
        }
      })}
    </>
  );
};

export default ScoreMap;
