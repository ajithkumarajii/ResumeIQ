import React from "react";
import { motion } from "framer-motion";

const Spinner = () => (
  <motion.div
    className="spinner"
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="#ff6b35"
        strokeWidth="4"
        fill="none"
        strokeDasharray="60"
        strokeDashoffset="20"
      />
    </svg>
  </motion.div>
);

export default Spinner;
