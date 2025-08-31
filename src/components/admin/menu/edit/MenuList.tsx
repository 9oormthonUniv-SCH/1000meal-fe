'use client';

export default function MenuList({
  stack,
  removeMenu,
  loading,
}: {
  stack: string[];
  removeMenu: (idx: number) => void;
  loading: boolean;
}) {
  if (loading) {
    return <p className="text-gray-400 text-sm text-center mt-[150px]">불러오는 중...</p>;
  }

  if (stack.length === 0) {
    return <p className="text-gray-400 text-sm text-center mt-[150px]">현재 작성된 메뉴가 없습니다</p>;
  }

  return (
    <ul className="space-y-3">
      {stack.map((m, i) => (
        <li key={i} className="flex items-center gap-3">
          <span className="w-4 text-right text-sm text-gray-500">{i + 1}</span>
          <span className="w-px h-5 bg-gray-300"></span>
          <div className="flex items-center bg-orange-50 rounded-full px-3 py-1.5">
            <span className="text-sm text-gray-800">{m}</span>
            <button
              onClick={() => removeMenu(i)}
              className="ml-2 text-gray-500 text-xs"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}