import React, { useState } from "react";
import { motion } from "framer-motion";
import { formatTime } from "../utils/timeUtils";

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
  onTogglePlay, // Add this prop
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleTrackClick = (track) => {
    const actualIndex = musicLibrary.findIndex(
      (t) => t.title === track.title && t.artist === track.artist
    );

    if (actualIndex === currentTrackIndex) {
      // If it's the same track, just toggle play/pause using the proper callback
      onTogglePlay();
    } else {
      // If it's a different track, load it
      loadTrack(actualIndex);

      // Use setTimeout to wait for the track to load, then use onTogglePlay
      setTimeout(() => {
        // Only play if not already playing (to avoid double-play)
        if (!isPlaying) {
          onTogglePlay();
        }
      }, 100);
    }
  };

  const handleDropdownToggle = (index, event) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleDownload = async (track, event) => {
    event.stopPropagation(); // Prevent track selection when clicking download

    let audioUrl;
    try {
      audioUrl = track.src || track.url || track.file;

      if (!audioUrl) {
        console.error("No audio URL found for track:", track);
        alert("Unable to download: No audio source found.");
        setOpenDropdown(null);
        return;
      }

      // Fetch the audio file as a blob
      const response = await fetch(audioUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      // Create object URL from blob
      const blobUrl = URL.createObjectURL(blob);

      // Get file extension from the original URL or default to mp3
      let extension = "mp3";
      try {
        const urlPath = new URL(audioUrl).pathname;
        const extractedExt = urlPath.split(".").pop().split("?")[0];
        if (extractedExt && extractedExt.length <= 4) {
          extension = extractedExt;
        }
      } catch (e) {
        // If URL parsing fails, keep default extension
        console.log("Could not parse URL for extension, using default mp3");
      }

      // Create download link
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${track.artist} - ${track.title}.${extension}`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error("Download failed:", error);
      console.error("Audio URL was:", audioUrl);
      alert(
        "Download failed. Please try again or check your internet connection."
      );
    }

    // Close dropdown after download attempt
    setOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    if (openDropdown !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openDropdown]);

  return (
    <>
      <div className="flex flex-col">
        {/* Header Row */}
        <div className="w-full h-10 grid grid-cols-[auto_2fr_2fr_1fr_auto] items-center px-4 text-sm font-mono border-b border-white/20 mb-2">
          <div className="opacity-60 w-8 text-xs">#</div>
          <div className="opacity-60">Name</div>
          <div className="opacity-60">Artist</div>
          <div className="text-right opacity-60">
            <svg
              className="w-4 h-4 inline"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="w-8"></div> {/* Spacer for menu column */}
        </div>

        {/* Track Rows */}
        {tracks.slice(0, visibleCount).map((track, index) => {
          const actualIndex = musicLibrary.findIndex(
            (t) => t.title === track.title && t.artist === track.artist
          );
          const isCurrentTrack = actualIndex === currentTrackIndex;

          return (
            <motion.div
              key={index}
              onClick={() => handleTrackClick(track)}
              className={`w-full h-10 grid grid-cols-[auto_2fr_2fr_1fr_auto] items-center px-4 text-sm hover:bg-white/20 cursor-pointer transition-all duration-150 ${
                isCurrentTrack ? "bg-white/20 border-white/30" : ""
              }`}
            >
              <div className="opacity-30 w-8 text-xs font-light">
                {index + 1}
              </div>
              <div className="truncate font-mono">{track.title}</div>
              <div className="truncate opacity-30 font-extralight">
                {track.artist}
              </div>
              <div className="text-right opacity-30 font-extralight">
                {formatTime(track.duration)}
              </div>
              <div className="w-8 flex justify-center relative">
                <button
                  onClick={(e) => handleDropdownToggle(index, e)}
                  className="opacity-30 hover:opacity-100 transition-opacity duration-150 p-1 rounded hover:bg-white/10 cursor-pointer"
                  title="More options"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path d="M10 4a2 2 0 100-4 2 2 0 000 4z" />
                    <path d="M10 20a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openDropdown === index && (
                  <div className="absolute right-0 top-9 bg-black/20 backdrop-blur-sm border border-white/20 rounded shadow-lg z-10">
                    <div className="">
                      <button
                        onClick={(e) => handleDownload(track, e)}
                        className="py-1 px-4 hover:underline w-full text-center text-sm hover:bg-white/10 transition-colors duration-150 cursor-pointer"
                      >
                        Download
                      </button>
                      {/* Add more menu items here in the future */}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {visibleCount < tracks.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            className="font-light px-5 py-1 text-sm bg-white/20 text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
};

export default TrackList;
