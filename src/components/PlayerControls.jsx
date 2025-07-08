import React from "react";
import { motion } from "framer-motion";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";

const PlayerControls = ({
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
}) => {
  return (
    <div className="flex justify-center items-center gap-6 mb-6">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onPrevTrack}
        className="bg-white/10 hover:bg-white/30 rounded-full w-14 h-14 flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 cursor-pointer"
      >
        <FaStepBackward />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onTogglePlay}
        className="bg-white/10 hover:bg-white/40 rounded-full w-20 h-20 flex items-center justify-center text-3xl transition-all duration-300 hover:scale-110 cursor-pointer"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </motion.button>

      <motion.button
        whileTap={{ scale: 1.2 }}
        onClick={onNextTrack}
        className="bg-white/10 hover:bg-white/30 rounded-full w-14 h-14 flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 cursor-pointer"
      >
        <FaStepForward />
      </motion.button>
    </div>
  );
};

export default PlayerControls;
