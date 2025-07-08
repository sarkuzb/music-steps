import React, { useRef, useEffect } from "react";
import { FaVolumeDown, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const VolumeControl = ({ volume, isMuted, onVolumeChange, onToggleMute }) => {
  const sliderRef = useRef(null);

  const handleVolumeSliderChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    onVolumeChange(newVolume);
  };

  const decreaseVolume = () => {
    const newVolume = Math.max(volume - 10, 0);
    onVolumeChange(newVolume);
  };

  const increaseVolume = () => {
    const newVolume = Math.min(volume + 10, 100);
    onVolumeChange(newVolume);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY) * 5;
      const newVolume = Math.max(0, Math.min(100, volume - delta));
      onVolumeChange(newVolume);
    };

    if (slider) {
      slider.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (slider) {
        slider.removeEventListener("wheel", handleWheel);
      }
    };
  }, [volume, onVolumeChange]);

  return (
    <div className="flex items-center justify-center gap-4">
      {isMuted || volume === 0 ? (
        <FaVolumeMute
          className="text-xl cursor-pointer"
          onClick={onToggleMute}
        />
      ) : (
        <FaVolumeDown
          className="text-xl cursor-pointer"
          onClick={decreaseVolume}
        />
      )}

      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeSliderChange}
        ref={sliderRef}
        className="w-24 h-1 bg-white/5 rounded-full appearance-none cursor-pointer slider"
      />

      <FaVolumeUp className="text-xl cursor-pointer" onClick={increaseVolume} />
    </div>
  );
};

export default VolumeControl;
