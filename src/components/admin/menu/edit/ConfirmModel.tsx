'use client';

export default function ConfirmModal({
  des,
  msg,
  onCancel,
  onConfirm,
}: {
  des: string;
  msg: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl px-2 pt-10 w-[300px] h-[160px]">
        {/* 설명 */}
        <p className="text-center text-sm text-gray-400 mb-1 whitespace-pre-line">
          {des}
        </p>
        {/* 본문 */}
        <p className="text-center text-sm text-gray-900 mb-4 whitespace-pre-line font-medium">
          {msg}
        </p>

        <div className="flex gap-3 pt-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-200 rounded-lg text-gray-800"
          >
            아니오
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-gray-700 rounded-lg text-white"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}