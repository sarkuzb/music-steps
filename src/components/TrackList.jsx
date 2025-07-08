import React from "react";
import TrackCard from "./TrackCard";

const TrackList = ({
  tracks,
  musicLibrary,
  currentTrackIndex,
  visibleCount,
  onTrackSelect,
  onLoadMore,
  audioRef,
  isPlaying,
  setIsPlaying,
  loadTrack,
}) => {
  const handleTrackClick = (track) => {
    const actualIndex = musicLibrary.findIndex(
      (t) => t.title === track.title && t.artist === track.artist
    );

    if (actualIndex === currentTrackIndex) {
      if (audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error("Playback error:", err));
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      loadTrack(actualIndex);
      setTimeout(() => {
        audioRef.current
          ?.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error("Playback error:", err));
      }, 100);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.slice(0, visibleCount).map((track, index) => {
          const actualIndex = musicLibrary.findIndex(
            (t) => t.title === track.title && t.artist === track.artist
          );
          return (
            <TrackCard
              key={index}
              track={track}
              isCurrentTrack={actualIndex === currentTrackIndex}
              onTrackClick={() => handleTrackClick(track)}
            />
          );
        })}
      </div>

      {visibleCount < tracks.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            className="font-light px-6 py-2 bg-white/10 text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
};

export default TrackList;
