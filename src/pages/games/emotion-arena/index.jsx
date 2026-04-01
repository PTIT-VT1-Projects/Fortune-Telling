import { useRef, useEffect, useState } from "react";
import styles from "./index.module.css";
import imageUtil from "../../../utils/imageUtil";
import imageCompareService from "../../../services/imageCompareService";
import { IoIosRefresh } from "react-icons/io";
import { MdCompareArrows } from "react-icons/md";
import dbUtil from "../../../services/indexDBService";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";

const EmotionArena = () => {
  const [selectedMeme, setSelectedMeme] = useState(imageUtil.getRandomImage());
  const comparedImageRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [comparedImageAccuracy, setComparedImageAccuracy] = useState(0);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [topMemeScores, setTopMemeScores] = useState([]);

  // Compare image based on 2 base64 image
  const compareImage = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video || !video.videoWidth || !video.videoHeight) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const myImageBase64 = canvas.toDataURL("image/png");

    const comparedImage = comparedImageRef.current.src;
    const comparedImageBase64 =
      await imageUtil.imageSourceToBase64(comparedImage);

    try {
      const result = await imageCompareService.compare(
        myImageBase64,
        comparedImageBase64,
      );

      //Animating similarity accuracy
      const startTime = performance.now();
      const duration = 6000;

      const easeOut = (t) => 1 - Math.pow(1 - t, 3);
      const step = async (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        const resultScore = Math.round(
          parseInt(result.similarity_percentage) * easeOut(t),
        );
        setComparedImageAccuracy(resultScore);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          await dbUtil.addItem({
            id: Date.now(),
            image: myImageBase64,
            accuracy: resultScore,
          });
        }
      };
      requestAnimationFrame(step);
      //Reset to initial state
      setCapturedImage(myImageBase64);
      setIsRefreshed(true);
    } catch (err) {
      console.log("Error on compared image: " + err);
    }
  };

  // Reset image
  const resetImage = () => {
    setIsRefreshed(false);
    setSelectedMeme(imageUtil.getRandomImage());
    setComparedImageAccuracy(0);
    setCapturedImage(null);
  };

  // Streaming video
  useEffect(() => {
    let stream;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        stream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        console.error("Lỗi mở webcam:", err);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [capturedImage]);

  // Reload indexDB to update leaderboard immediately after new score is added
  useEffect(() => {
    dbUtil.getItemsSortedByAccuracyDesc(10).then((items) => {
      setTopMemeScores(items);
    });
  });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Đấu trường cảm xúc</h1>
          <div className="hero-subtitle">
            Đối đầu biểu cảm, bùng nổ thần thái.
          </div>
          <div className="hero-decoration"></div>
        </div>
        <div className={styles["arena"]}>
          <div className="row">
            <div className="col-md-4">
              <div className={styles["emotion-area"]}>
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="captured"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ width: "100%", maxWidth: "100%", height: "100%" }}
                  />
                )}
                <canvas ref={canvasRef} style={{ display: "none" }} />
              </div>
            </div>
            <div className="col-md-4">
              <div
                className={`d-flex flex-column justify-content-center align-items-center ${styles["compare-result"]}`}
              >
                <button
                  className={styles["btn-compare"]}
                  onClick={!isRefreshed ? compareImage : resetImage}
                >
                  {!isRefreshed ? (
                    <>
                      <span>
                        <MdCompareArrows />
                      </span>
                      &nbsp;
                      <span>So sánh</span>
                    </>
                  ) : (
                    <>
                      <IoIosRefresh /> &nbsp;
                      <span>Tải lại</span>
                    </>
                  )}
                </button>
                <h2 className={`mt-2 ${styles["counter"]}`}>
                  {comparedImageAccuracy}%
                </h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className={styles["emotion-area"]}>
                <img
                  ref={comparedImageRef}
                  src={selectedMeme}
                  alt="smile"
                  width="100%"
                />
              </div>
            </div>

            {/* Leaderboard */}
            <Button variant="primary" onClick={handleShow}>
              Bảng xếp hạng
            </Button>
            <Offcanvas show={show} onHide={handleClose}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Offcanvas</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <table className="table mt-4 table-striped">
                  <thead>
                    <tr>
                      <th>Hạng</th>
                      <th>Ảnh</th>
                      <th>Độ chính xác</th>
                    </tr>
                  </thead>
                  <tbody class="table-group-divider">
                    {topMemeScores.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={item.image}
                            alt={`Meme ${index + 1}`}
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td>{item.accuracy}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Offcanvas.Body>
            </Offcanvas>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmotionArena;

{
  /* <table className="table mt-4 table-striped">
  <thead>
    <tr>
      <th>Hạng</th>
      <th>Ảnh</th>
      <th>Độ chính xác</th>
    </tr>
  </thead>
  <tbody class="table-group-divider">
    {topMemeScores.map((item, index) => (
      <tr key={item.id}>
        <td>{index + 1}</td>
        <td>
          <img
            src={item.image}
            alt={`Meme ${index + 1}`}
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
            }}
          />
        </td>
        <td>{item.accuracy}%</td>
      </tr>
    ))}
  </tbody>
</table>; */
}
