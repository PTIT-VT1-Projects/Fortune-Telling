// AgingTransition.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Surface } from "gl-react-dom";
import GLTransition from "react-gl-transition";
import GLTransitions from "gl-transitions";

// Lấy transition "perlin" theo tên từ danh sách gl-transitions
const perlinTransition = GLTransitions.find((t) => t.name === "perlin");

const AgingTransition = ({
  fromImage,
  toImage,
  width = 500,
  height = 500,
  duration = 3000, // thời gian chạy hiệu ứng (ms)
  autoPlay = true,
}) => {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  const animate = useCallback(
    (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const p = Math.min(elapsed / duration, 1);

      setProgress(p);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [duration],
  );

  const play = useCallback(() => {
    startTimeRef.current = null;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  useEffect(() => {
    if (autoPlay) play();
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoPlay, play]);

  if (!perlinTransition) {
    console.error("Không tìm thấy transition 'perlin' trong gl-transitions");
    return null;
  }

  return (
    <div>
      <Surface width={width} height={height}>
        <GLTransition
          progress={progress}
          from={fromImage}
          to={toImage}
          transition={perlinTransition}
          transitionParams={{
            scale: 4,
            smoothness: 0.01,
            seed: 12.9898,
          }}
        />
      </Surface>
    </div>
  );
};

export default AgingTransition;
