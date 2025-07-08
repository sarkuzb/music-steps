import React from "react";
import TrackInfo from "./TrackInfo";
import PlayerControls from "./PlayerControls";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";

const PlayerPanel = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isDragging,
  setIsDragging,
  progressBarRef,
  animationFrameRef,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onSeek,
  onVolumeChange,
  onToggleMute,
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20">
      <TrackInfo currentTrack={currentTrack} />

      <PlayerControls
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
        onNextTrack={onNextTrack}
        onPrevTrack={onPrevTrack}
      />

      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        progressBarRef={progressBarRef}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        onSeek={onSeek}
        animationFrameRef={animationFrameRef}
      />

      <VolumeControl
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={onVolumeChange}
        onToggleMute={onToggleMute}
      />
    </div>
  );
};

export default PlayerPanel;
