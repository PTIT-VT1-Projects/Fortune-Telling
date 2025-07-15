import './ProgressBar.css'

const ProgressBar = () => {
    const randomInt = Math.floor(Math.random() * (100 - 80 + 1)) + 80;
    return (
        <div className="w3-light-grey w3-round-xlarge">
            <div className="w3-container w3-blue w3-round-xlarge text-center" style={{ width: randomInt + "%" }}>{randomInt}%</div>
        </div>
    )
}

export default ProgressBar