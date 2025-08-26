// src/components/Loader.jsx
import React from 'react';
import { motion } from 'framer-motion';  // ← add this line

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
      <motion.div
        className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: 'linear',
        }}
      />
    </div>
  );
}
