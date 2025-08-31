'use client';

import dayjs, { Dayjs } from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Props = {
  onClose: () => void;
  onConfirm: (range: { start: string; end: string }) => void;
};

export default function RangeCalendarModal({ onClose, onConfirm }: Props) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [start, setStart] = useState<Dayjs | null>(null);
  const [end, setEnd] = useState<Dayjs | null>(null);

  const handleSelect = (date: Dayjs) => {
    if (!start) {
      setStart(date);
      setEnd(null);
    } else if (!end) {
      if (date.isBefore(start)) {
        setStart(date);
      } else {
        setEnd(date);
      }
    } else {
      setStart(date);
      setEnd(null);
    }
  };

  const isInRange = (date: Dayjs) => {
    if (start && !end) {
      return date.isSame(start, "day");
    }
    if (start && end) {
      return (
        date.isSame(start, "day") ||
        date.isSame(end, "day") ||
        (date.isAfter(start, "day") && date.isBefore(end, "day"))
      );
    }
    return false;
  };

  // ✅ 항상 6주치 달력 데이터 생성
  const generateCalendarDays = (month: Dayjs) => {
    const startOfMonth = month.startOf("month");
    const startOfCalendar = startOfMonth.startOf("week"); // 일요일 시작
    return Array.from({ length: 42 }).map((_, i) =>
      startOfCalendar.add(i, "day")
    );
  };

  const days = generateCalendarDays(currentMonth);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-end z-50">
      <AnimatePresence>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white w-full rounded-t-2xl p-6"
        >
          {/* 상단 네비게이션 */}
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={() => setCurrentMonth((m) => m.subtract(1, "month"))}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <span className="text-sm font-semibold">
              {currentMonth.format("YYYY년 M월")}
            </span>
            <button
              onClick={() => setCurrentMonth((m) => m.add(1, "month"))}
              className="p-2"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 text-center text-xs mb-2 text-gray-400">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* 날짜 */}
          <div className="relative grid grid-cols-7 text-center text-sm">
            {days.map((date, i) => {
              const selectedStart = start?.isSame(date, "day");
              const selectedEnd = end?.isSame(date, "day");
              const inRange = isInRange(date);

              const isCurrentMonth = date.month() === currentMonth.month();

              return (
                <div key={i} className="relative flex justify-center">
                  {/* 🔶 하이라이트 레이어 */}
                  {inRange && (
                    <div
                      className={`
                        absolute inset-0 bg-orange-500
                        ${selectedStart && !end ? "rounded-full" : ""} 
                        ${selectedStart && end ? "rounded-l-full" : ""}
                        ${selectedEnd ? "rounded-r-full" : ""}
                      `}
                    />
                  )}

                  {/* 날짜 버튼 */}
                  <button
                    onClick={() => handleSelect(date)}
                    className={`
                      relative z-10 w-10 h-10 flex items-center justify-center
                      ${selectedStart || selectedEnd ? "text-white font-bold" : inRange ? "text-white" : isCurrentMonth ? "text-gray-800" : "text-gray-400"}
                    `}
                  >
                    {date.date()}
                  </button>
                </div>
              );
            })}
          </div>

          {/* 하단 버튼 */}
          <div className="flex gap-2 my-4">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gray-100 rounded-xl"
            >
              닫기
            </button>
            <button
              onClick={() => {
                if (start) {
                  onConfirm({
                    start: start.format("YYYY-MM-DD"),
                    end: (end ?? start).format("YYYY-MM-DD"),
                  });
                }
                onClose();
              }}
              className="flex-1 py-2 bg-orange-500 text-white rounded-xl"
            >
              이동하기
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}