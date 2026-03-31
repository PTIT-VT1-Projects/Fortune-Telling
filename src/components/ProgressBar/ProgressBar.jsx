import "./ProgressBar.css";

const ProgressBar = ({ compatibleLevel }) => {
  return (
    <div className="w3-light-grey w3-round-xlarge">
      <div
        className="w3-container w3-blue w3-round-xlarge text-center"
        style={{ width: compatibleLevel + "%" }}
      >
        {compatibleLevel}%
      </div>
    </div>
  );
};

export default ProgressBar;
