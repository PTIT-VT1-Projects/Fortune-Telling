import { useRef, useEffect, useState } from "react";
import styles from "./index.module.css";
import imageUtil from "../../../utils/imageUtil";
import imageCompareService from "../../../services/imageCompareService";

const imageModules = import.meta.glob(
  "/src/pages/games/emotion-arena/resources/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  },
);

const imageList = Object.values(imageModules);

export function getRandomImage() {
  if (!imageList.length) return null;
  const randomIndex = Math.floor(Math.random() * imageList.length);
  return imageList[randomIndex];
}

const EmotionArena = () => {
  const [selectedMeme, setSelectedMeme] = useState(getRandomImage());
  const comparedImageRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [comparedImageAccuracy, setComparedImageAccuracy] = useState(0);
  const [isRefreshed, setIsRefreshed] = useState(false);

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

      //Animating
      const startTime = performance.now();
      const duration = 6000;

      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const step = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        setComparedImageAccuracy(
          Math.round(parseInt(result.similarity_percentage) * easeOut(t)),
        );
        if (t < 1) requestAnimationFrame(step);
      };

      setIsRefreshed(true);
      requestAnimationFrame(step);
    } catch (err) {
      console.log("Error on compared image: " + err);
    }
  };

  // Reset image
  const resetImage = () => {
    setIsRefreshed(false);
    setSelectedMeme(getRandomImage());
    setComparedImageAccuracy(0);
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
  }, []);

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
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{ width: "100%", maxWidth: "100%", height: "100%" }}
                />
                <canvas ref={canvasRef} style={{ display: "none" }} />
              </div>
            </div>
            <div className="col-md-4">
              <div
                className={`d-flex flex-column justify-content-center ${styles["compare-result"]}`}
              >
                <button
                  className={styles["btn-compare"]}
                  onClick={!isRefreshed ? compareImage : resetImage}
                >
                  {!isRefreshed ? "So sánh" : "Tải lại"}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default EmotionArena;
