import React, { useState, useEffect } from "react";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { loadMusicLibraryWithDurations } from "./utils/musicUtils";
import PlayerPanel from "./components/PlayerPanel";
import TrackList from "./components/TrackList";
import musicLibraryData from "./data";
import Footer from "./components/footer.jsx";
import IMG from "./assets/view-black-white-light-projector-theatre.jpg";
import IMG2 from "./assets/closeupmusic.jpg";
import IMG3 from "./assets/stack-vinyl-record-black-background.jpg";
import IMG4 from "./assets/musical-background-with-musical-keys-black-flat-lay-copy-space.jpg";

const MusicPlayer = () => {
  const [musicLibrary, setMusicLibrary] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);
  const [current, setCurrent] = useState(0);
  const images = [IMG, IMG2, IMG3, IMG4];

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`background-${index}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-[5000ms] ease-in-out ${
              index === current ? "opacity-100 z-0" : "opacity-0 z-[-1]"
            }`}
          />
        ))}
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

          {/* Search Input */}
          {/* <div className="mb-8">
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search tracks or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all duration-200"
              />
            </div>
          </div> */}

          <TrackList
            tracks={filteredTracks}
            musicLibrary={musicLibrary}
            currentTrackIndex={audioPlayer.currentTrackIndex}
            visibleCount={visibleCount}
            onLoadMore={() => setVisibleCount((prev) => prev + 9)}
            audioRef={audioPlayer.audioRef}
            isPlaying={audioPlayer.isPlaying}
            setIsPlaying={audioPlayer.setIsPlaying}
            loadTrack={audioPlayer.loadTrack}
            onTogglePlay={audioPlayer.togglePlay}
          />

          <audio ref={audioPlayer.audioRef} preload="metadata" />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MusicPlayer;
