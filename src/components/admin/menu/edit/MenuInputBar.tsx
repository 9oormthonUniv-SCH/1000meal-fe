'use client';

import { storeIdAtom } from "@/atoms/user";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useAtomValue } from "jotai";
import { useState } from "react";

type WeeklyMenusByWeek = Record<string, Record<string, string[]>>;

export default function MenuInputBar({
  input,
  setInput,
  addMenu,
  setMenusByWeek,
  setDirty,
  selectedId,
  mondayId,
}: {
  input: string;
  setInput: (v: string) => void;
  addMenu: (menuText?: string) => void;
  setMenusByWeek: React.Dispatch<React.SetStateAction<WeeklyMenusByWeek>>;
  setDirty: (v: boolean) => void;
  selectedId: string;
  mondayId: string;
}) {
  const [showFrequent, setShowFrequent] = useState(false);

  const storeId = useAtomValue(storeIdAtom);
  const { lists } = useFavorites(storeId ?? undefined);

  return (
    <div className="relative flex items-center gap-2 mt-2 px-4 pt-4 pb-1">
      <button
        onClick={() => setShowFrequent(!showFrequent)}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200"
      >
        ☰
      </button>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메뉴 입력"
        className="flex-1 px-3 py-2 border rounded-xl text-base sm:text-sm"
      />
      <button
        onClick={() => addMenu()}
        className="px-3 py-2 bg-gray-200 text-black rounded-xl text-sm"
      >
        입력
      </button>

      {showFrequent && (
        <div className="absolute top-full left-5 w-[285px] bg-white rounded-xl shadow-lg border z-50">
          <ul className="divide-y">
            {lists.map((group) => (
              <li
                key={group.id}
                onClick={() => {
                  group.items.forEach(item => addMenu(item));
              
                  // menusByWeek에도 반영
                  setMenusByWeek((prev) => ({
                    ...prev,
                    [mondayId]: {
                      ...(prev[mondayId] ?? {}),
                      [selectedId]: [
                        ...(prev[mondayId]?.[selectedId] ?? []),
                        ...group.items,
                      ],
                    },
                  }));
                  setDirty(true);
                  setShowFrequent(false);
                }}
                className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
              >
                <span className="truncate">{group.items.join(", ")}</span>
                <span className="text-gray-400">›</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}