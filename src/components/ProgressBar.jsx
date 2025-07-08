import React, { useEffect } from "react";
import { formatTime } from "../utils/timeUtils";

const ProgressBar = ({
  currentTime,
  duration,
  progressBarRef,
  isDragging,
  setIsDragging,
  onSeek,
  animationFrameRef,
}) => {
  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    onSeek(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      onSeek(e);
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging]);

  return (
    <div className="mb-4">
      <div
        ref={progressBarRef}
        className="w-full h-2 bg-white/15 rounded-full cursor-pointer mb-2"
        onMouseDown={handleMouseDown}
      >
        <div
          className="h-full bg-white/50 rounded-l-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-sm opacity-70">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
