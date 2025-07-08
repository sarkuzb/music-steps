import React, { useState, useEffect } from "react";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { loadMusicLibraryWithDurations } from "./utils/musicUtils";
import PlayerPanel from "./components/PlayerPanel";
import TrackList from "./components/TrackList";
import musicLibraryData from "./data";
import IMG from "./assets/view-black-white-light-projector-theatre.jpg";

const MusicPlayer = () => {
  const [musicLibrary, setMusicLibrary] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  const audioPlayer = useAudioPlayer(musicLibrary);

  const filteredTracks = musicLibrary.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTrack = musicLibrary[audioPlayer.currentTrackIndex];

  useEffect(() => {
    const loadMusicLibrary = async () => {
      const tracksWithDurations = await loadMusicLibraryWithDurations(
        musicLibraryData
      );
      setMusicLibrary(tracksWithDurations);
    };

    loadMusicLibrary();
  }, []);

  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <img
          className="w-full h-full object-cover"
          src={IMG}
          alt="background"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70" />
      </div>

      <div className="backdrop-blur-[8px]">
        <div className="container mx-auto px-4 py-8 max-w-6xl text-gray-200">
          <header className="text-center mb-10">
            <h1 className="text-5xl font-extralight font-mono mb-4 drop-shadow-lg">
              Mening Musiqiy Kolleksiyam
            </h1>
            <p className="text-xl opacity-80 font-extralight">
              Shaxsiy Musiqalar
            </p>
          </header>

          <PlayerPanel
            currentTrack={currentTrack}
            isPlaying={audioPlayer.isPlaying}
            currentTime={audioPlayer.currentTime}
            duration={audioPlayer.duration}
            volume={audioPlayer.volume}
            isMuted={audioPlayer.isMuted}
            isDragging={audioPlayer.isDragging}
            setIsDragging={audioPlayer.setIsDragging}
            progressBarRef={audioPlayer.progressBarRef}
            animationFrameRef={audioPlayer.animationFrameRef}
            onTogglePlay={audioPlayer.togglePlay}
            onNextTrack={audioPlayer.nextTrack}
            onPrevTrack={audioPlayer.prevTrack}
            onSeek={audioPlayer.handleSeek}
            onVolumeChange={audioPlayer.handleVolumeChange}
            onToggleMute={audioPlayer.toggleMute}
          />

          <TrackList
            tracks={filteredTracks}
            musicLibrary={musicLibrary}
            currentTrackIndex={audioPlayer.currentTrackIndex}
            visibleCount={visibleCount}
            onLoadMore={() => setVisibleCount((prev) => prev + 9)}
            audioRef={audioPlayer.audioRef}
            isPlaying={audioPlayer.isPlaying}
            setIsPlaying={(playing) => (audioPlayer.isPlaying = playing)}
            loadTrack={audioPlayer.loadTrack}
          />

          <audio ref={audioPlayer.audioRef} preload="metadata" />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
