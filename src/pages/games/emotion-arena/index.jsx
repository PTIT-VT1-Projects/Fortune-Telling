import { useRef, useEffect } from "react";
import styles from "./index.module.css";
import imageUtil from "../../../utils/imageUtil";
import imageCompareService from "../../../services/imageCompareService";

const EmotionArena = () => {
  const comparedImageRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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
      console.log(result);
    } catch (err) {
      console.log("Error on compared image: " + err);
    }
  };

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
  }, []);

  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Đấu trường cảm xúc</h1>
          <div className="hero-decoration"></div>
        </div>

        <div className={styles["arena"]}>
          <div className="row">
            <div className="col-md-5">
              <div className={styles["emotion-area"]}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{ width: "100%", maxWidth: 250 }}
                />
                <canvas ref={canvasRef} style={{ display: "none" }} />
              </div>
            </div>
            <div className="col-md-2">
              <button onClick={compareImage}>Compare</button>
            </div>
            <div className="col-md-5">
              <div className={styles["emotion-area"]}>
                <img
                  ref={comparedImageRef}
                  src="https://www.shutterstock.com/image-photo/handsome-happy-african-american-bearded-260nw-2460702995.jpg"
                  alt="smile"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmotionArena;
