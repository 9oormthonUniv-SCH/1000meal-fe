import { motion } from "framer-motion";

export default function FlutteringLetter() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden">
      <motion.svg
        viewBox="0 0 80 60"
        className="absolute left-1/2 -translate-x-1/2"
        initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
        animate={{
          y: [ -40, 40, 120, 200, 280, 360 ],
          x: [   0, 20, -16, 18, -14, 10 ],
          rotate: [ 0, -8, 7, -6, 5, 0 ],
          opacity: [0, 1, 1, 1, 1, 1]
        }}
        transition={{ duration: 3.6, ease: "easeInOut" }}
      >
        {/* 봉투 */}
        <rect x="0" y="14" width="80" height="40" rx="6" fill="#ffd85a" />
        <path d="M0 14 L80 14 L40 36 Z" fill="#ffbf35" />
      </motion.svg>
    </div>
  );
}