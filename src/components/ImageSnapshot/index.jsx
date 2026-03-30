import { useEffect, useRef } from "react";

const ImageSnapshot = ({ isUsingCamera, handleAfterSnapshot }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // open camera
  useEffect(() => {
    // Mở webcam khi component mount
    if (isUsingCamera) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Lỗi mở webcam: ", err);
        });
    }
  }, [isUsingCamera]);

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL("image/png");
    console.log(imageDataURL);
    handleAfterSnapshot(imageDataURL);
  };
  return (
    <>
      {isUsingCamera && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%", maxWidth: 250 }}
          />
          <button onClick={handleCapture} className="take-camera">
            📸 Chụp ảnh
          </button>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </>
      )}
    </>
  );
};

export default ImageSnapshot;
