'use client';

import { AnimatePresence, motion } from "framer-motion";

export default function Toast({ show, message }: { show: boolean; message: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="
            fixed inset-0 
            flex items-center justify-center
            z-[9999]
          "
        >
          <div className="bg-orange-500/80 text-white text-xs px-3 py-2 rounded-md shadow-md">
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}