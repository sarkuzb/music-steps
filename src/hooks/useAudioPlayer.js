import { useState, useRef, useEffect } from "react";

export const useAudioPlayer = (musicLibrary) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const animationFrameRef = useRef(null);

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

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
      if (isMuted && newVolume > 0) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteState = !isMuted;
      audioRef.current.muted = newMuteState;
      setIsMuted(newMuteState);
    }
  };

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
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    if (musicLibrary.length > 0) {
      loadTrack(currentTrackIndex);
    }
  }, [musicLibrary]);

  return {
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isDragging,
    setIsDragging,
    audioRef,
    progressBarRef,
    animationFrameRef,
    togglePlay,
    nextTrack,
    prevTrack,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    loadTrack,
  };
};
