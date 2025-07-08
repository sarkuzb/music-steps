import React from "react";

const TrackInfo = ({ currentTrack }) => {
  return (
    <div className="text-center mb-6">
      <h3 className="text-3xl font-mono mb-2">
        {currentTrack?.title || "Select a track to play"}
      </h3>
      <p className="text-lg opacity-50 font-light">
        {currentTrack?.artist || "No track selected"}
      </p>
    </div>
  );
};

export default TrackInfo;
