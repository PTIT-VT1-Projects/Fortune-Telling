// AgingTransition.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";

import { Surface } from "gl-react-dom";
import GLTransition from "react-gl-transition";
import GLTransitions from "gl-transitions";

const dreamyTransition = GLTransitions.find(
  (transition) => transition.name === "Dreamy",
);

const AgingTransition = ({
  fromImage,
  toImage,
  width = 500,
  height = 500,
  duration = 3000,
  autoPlay = true,
}) => {
  const [progress, setProgress] = useState(0);

  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  const animate = useCallback(
    (timestamp) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;

      const nextProgress = Math.min(elapsed / duration, 1);

      setProgress(nextProgress);

      if (nextProgress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
      }
    },
    [duration],
  );

  const play = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    setProgress(0);

    startTimeRef.current = null;

    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  useEffect(() => {
    if (autoPlay && fromImage && toImage) {
      play();
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [autoPlay, fromImage, toImage, play]);

  if (!dreamyTransition) {
    console.error("Không tìm thấy transition 'dreamy' trong gl-transitions");

    return null;
  }

  if (!fromImage || !toImage) {
    return null;
  }

  return (
    <Surface width={width} height={height}>
      <GLTransition
        progress={progress}
        from={fromImage}
        to={toImage}
        transition={dreamyTransition}
      />
    </Surface>
  );
};

export default AgingTransition;
