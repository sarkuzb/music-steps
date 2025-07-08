import React from "react";
import { motion } from "framer-motion";
import { formatTime } from "../utils/timeUtils";

const TrackCard = ({ track, isCurrentTrack, onTrackClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onTrackClick}
      className={`bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-2 hover:bg-white/15 ${
        isCurrentTrack ? "bg-white/20 border-white/30" : ""
      }`}
    >
      <h3 className="text-xl font-mono mb-2">{track.title}</h3>
      <p className="opacity-70 mb-4 font-extralight">{track.artist}</p>
      <p className="opacity-60">{formatTime(track.duration)}</p>
    </motion.div>
  );
};

export default TrackCard;
