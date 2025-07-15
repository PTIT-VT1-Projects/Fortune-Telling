import './ProgressBar.css'

const ProgressBar = ({randomNumber}) => {
    return (
        <div className="w3-light-grey w3-round-xlarge">
            <div className="w3-container w3-blue w3-round-xlarge text-center" style={{ width: randomNumber + "%" }}>{randomNumber}%</div>
        </div>
    )
}

export default ProgressBar