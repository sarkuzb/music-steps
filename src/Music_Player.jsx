import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeDown,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import musicLibraryData from "./data";
import IMG from "./assets/view-black-white-light-projector-theatre.jpg";

const MusicPlayer = () => {
  const [musicLibrary, setMusicLibrary] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const sliderRef = useRef(null);
  const progressBarRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const loadTrack = (index) => {
    const track = musicLibrary[index];
    if (!track || !audioRef.current) return;
    audioRef.current.src = track.file;
    setCurrentTrackIndex(index);
    audioRef.current.load();
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error("Playback error:", error);
          setIsPlaying(false);
        });
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % musicLibrary.length;
    loadTrack(nextIndex);
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play().catch(() => setIsPlaying(false));
      }, 100);
    }
  };

  const prevTrack = () => {
    const prevIndex =
      (currentTrackIndex - 1 + musicLibrary.length) % musicLibrary.length;
    loadTrack(prevIndex);
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play().catch(() => setIsPlaying(false));
      }, 100);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, offsetX / rect.width));
    const newTime = newProgress * duration;
    audioRef.current.currentTime = newTime;
  };

  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevent text selection
    setIsDragging(true);
    handleSeek(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      handleSeek(e);
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleProgressClick = (e) => {
    handleSeek(e);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
      if (isMuted && newVolume > 0) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const decreaseVolume = () => {
    setVolume((prev) => {
      const newVolume = Math.max(prev - 10, 0);
      if (audioRef.current) {
        audioRef.current.volume = newVolume / 100;
        audioRef.current.muted = newVolume === 0;
        setIsMuted(newVolume === 0);
      }
      return newVolume;
    });
  };

  const increaseVolume = () => {
    setVolume((prev) => {
      const newVolume = Math.min(prev + 10, 100);
      if (audioRef.current) {
        audioRef.current.volume = newVolume / 100;
        audioRef.current.muted = false;
        setIsMuted(false);
      }
      return newVolume;
    });
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteState = !isMuted;
      audioRef.current.muted = newMuteState;
      setIsMuted(newMuteState);
    }
  };

  const filteredTracks = musicLibrary.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTrack = musicLibrary[currentTrackIndex];
  const progress = duration ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    const loadDurations = async () => {
      const tracksWithDurations = await Promise.all(
        musicLibraryData.map(
          (track) =>
            new Promise((resolve) => {
              const tempAudio = new Audio(track.file);
              tempAudio.addEventListener("loadedmetadata", () => {
                resolve({ ...track, duration: tempAudio.duration });
              });
            })
        )
      );
      setMusicLibrary(tracksWithDurations);
    };

    loadDurations();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    if (musicLibrary.length > 0) {
      loadTrack(currentTrackIndex);
    }
  }, [musicLibrary]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.9;
    }
  }, []);

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

  useEffect(() => {
    const slider = sliderRef.current;
    const handleWheel = (e) => {
      e.preventDefault();
      setVolume((prev) => {
        const delta = Math.sign(e.deltaY) * 5;
        let newVolume = Math.max(0, Math.min(100, prev - delta));
        if (audioRef.current) {
          audioRef.current.volume = newVolume / 100;
          audioRef.current.muted = false;
          setIsMuted(false);
        }
        return newVolume;
      });
    };

    if (slider) {
      slider.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (slider) {
        slider.removeEventListener("wheel", handleWheel);
      }
    };
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

          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-mono mb-2">
                {currentTrack?.title || "Select a track to play"}
              </h3>
              <p className="text-lg opacity-50 font-light">
                {currentTrack?.artist || "No track selected"}
              </p>
            </div>

            <div className="flex justify-center items-center gap-6 mb-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={prevTrack}
                className="bg-white/10 hover:bg-white/30 rounded-full w-14 h-14 flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <FaStepBackward />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="bg-white/10 hover:bg-white/40 rounded-full w-20 h-20 flex items-center justify-center text-3xl transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </motion.button>

              <motion.button
                whileTap={{ scale: 1.2 }}
                onClick={nextTrack}
                className="bg-white/10 hover:bg-white/30 rounded-full w-14 h-14 flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <FaStepForward />
              </motion.button>
            </div>

            <div className="mb-4">
              <div
                ref={progressBarRef}
                className="w-full h-2 bg-white/15 rounded-full cursor-pointer mb-2"
                onMouseDown={handleMouseDown}
                onClick={handleProgressClick}
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

            <div className="flex items-center justify-center gap-4">
              {isMuted || volume === 0 ? (
                <FaVolumeMute
                  className="text-xl cursor-pointer"
                  onClick={toggleMute}
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
                onChange={handleVolumeChange}
                ref={sliderRef}
                className="w-24 h-1 bg-white/5 rounded-full appearance-none cursor-pointer slider"
              />

              <FaVolumeUp
                className="text-xl cursor-pointer"
                onClick={increaseVolume}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracks.slice(0, visibleCount).map((track, index) => {
              const actualIndex = musicLibrary.findIndex(
                (t) => t.title === track.title && t.artist === track.artist
              );
              return (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={index}
                  onClick={() => {
                    if (actualIndex === currentTrackIndex) {
                      if (audioRef.current.paused) {
                        audioRef.current
                          .play()
                          .then(() => setIsPlaying(true))
                          .catch((err) =>
                            console.error("Playback error:", err)
                          );
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
                          .catch((err) =>
                            console.error("Playback error:", err)
                          );
                      }, 100);
                    }
                  }}
                  className={`bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-2 hover:bg-white/15 ${
                    actualIndex === currentTrackIndex
                      ? "bg-white/20 border-white/30"
                      : ""
                  }`}
                >
                  <h3 className="text-xl font-mono mb-2">{track.title}</h3>
                  <p className="opacity-70 mb-4 font-extralight">
                    {track.artist}
                  </p>
                  <p className="opacity-60">{formatTime(track.duration)}</p>
                </motion.div>
              );
            })}
          </div>

          {visibleCount < filteredTracks.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + 9)}
                className="font-light px-6 py-2 bg-white/10 text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
              >
                Load More
              </button>
            </div>
          )}

          <audio ref={audioRef} preload="metadata" />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
