// ScaleSwap.tsx
import { easeInOut, motion, type Transition } from "framer-motion";

type Props = {
  period?: number;   // 왕복 한쪽 구간 시간(초)
  angle?: number;    // 최대 기울기 (deg)
  drop?: number;     // 접시 상하 이동량 (px)
  loop?: boolean;
  className?: string;
};

export default function ScaleSwap({
  period = 1.6,
  angle = 12,
  drop = 10,
  loop = true,
  className = "",
}: Props) {
  // TS 친화적으로 미리 Transition 객체를 만든다
  const common: Transition = {
    duration: period,
    ease: easeInOut,          // ✅ 문자열 대신 이징 함수
    repeat: loop ? Infinity : 0,
    repeatType: "reverse",
  };

  return (
    <svg viewBox="0 0 360 300" className={className}>
      {/* 축(고정) */}
      <rect x="176" y="60" width="8" height="160" rx="4" fill="#F3C231" />
      <circle cx="180" cy="60" r="10" fill="#F3C231" />

      {/* 빔: 중앙 축 기준 회전 */}
      <motion.g
        style={{ transformOrigin: "180px 70px" }}
        animate={{ rotate: [-angle, angle] }}
        transition={common}
      >
        <rect x="60" y="66" width="240" height="8" rx="4" fill="#F3C231" />

        {/* 왼쪽 줄 */}
        <g>
          <circle cx="100" cy="70" r="3" fill="#F3C231" />
          <line x1="100" y1="70" x2="86" y2="140" stroke="#F3C231" strokeWidth="4" strokeLinecap="round" />
          <line x1="100" y1="70" x2="114" y2="140" stroke="#F3C231" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* 오른쪽 줄 */}
        <g>
          <circle cx="260" cy="70" r="3" fill="#F3C231" />
          <line x1="260" y1="70" x2="246" y2="140" stroke="#F3C231" strokeWidth="4" strokeLinecap="round" />
          <line x1="260" y1="70" x2="274" y2="140" stroke="#F3C231" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* 왼쪽 접시: 오른쪽이 무거우면 올라가고, 반대면 내려감 */}
        <motion.g
          animate={{ y: [drop, -drop] }}
          transition={common}
        >
          <ellipse cx="100" cy="162" rx="44" ry="16" fill="#4B5BFF" />
        </motion.g>

        {/* 오른쪽 접시: 역상 */}
        <motion.g
          animate={{ y: [-drop, drop] }}
          transition={common}
        >
          <ellipse cx="260" cy="162" rx="44" ry="16" fill="#7F89FF" />
        </motion.g>
      </motion.g>
    </svg>
  );
}