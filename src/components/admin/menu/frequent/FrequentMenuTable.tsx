// src/components/admin/menu/FrequentMenuTable.tsx
'use client';

import { ChevronRight } from "lucide-react";

export default function FrequentMenuTable({
  lists,
  selectMode,
  selectedIds,
  toggleSelect,
  onRowClick
}: {
  lists: { id: string; items: string[] }[];
  selectMode: boolean;
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  onRowClick: (id: string) => void;
}) {
  return (
    <table className="w-full border border-gray-200 bg-white rounded-xl overflow-hidden">
      <tbody>
        {lists.map(list => (
          <tr
            key={list.id}
            onClick={() =>
              selectMode ? toggleSelect(list.id) : onRowClick(list.id)
            }
            className="border-t hover:bg-gray-50 cursor-pointer"
          >
            <td className="px-4 py-3 text-sm text-gray-500 truncate h-[50px]">
              {list.items.join(", ")}
            </td>
            {selectMode ? (
              <td className="px-4 py-3 text-center ">
                <input
                  type="checkbox"
                  checked={selectedIds.has(list.id)}
                  readOnly
                  className="w-4 h-4 accent-gray-200"
                />
              </td>
            ) : (
              <td className="px-4 py-3 text-center">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}