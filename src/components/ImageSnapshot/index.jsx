import { useEffect, useRef, cloneElement } from "react";

const ImageSnapshot = ({ handleAfterSnapshot, element }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video || !video.videoWidth || !video.videoHeight) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL("image/png");
    handleAfterSnapshot(imageDataURL);
  };

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", maxWidth: 250 }}
      />

      {element ? (
        cloneElement(element, {
          onClick: handleCapture,
        })
      ) : (
        <button onClick={handleCapture} className="take-camera">
          📸 Chụp ảnh
        </button>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
};

export default ImageSnapshot;
