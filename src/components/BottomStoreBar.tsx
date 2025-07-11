// components/BottomStoreBar.tsx
'use client';

import { Store } from '@/types/store';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { isStoreOpen } from '@/utils/isStoreOpen';

interface Props {
  store: Store;
  onClose?: () => void;
}

export default function BottomStoreBar({ store, onClose }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/store/${store.id}`); // 상세 페이지로 이동
  };
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 px-4"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      onClick={handleClick}
    >
      <div
        className="bg-white border-t shadow-xl rounded-t-2xl overflow-hidden"
        onClick={() => router.push(`/store/${store.id}`)}
      >
      {/* X 닫기 버튼 (부모 바깥에 살짝 띄워서 위치) */}
      {onClose && (
        <button
          className="absolute top-2 right-6 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation(); // 상세페이지로 이동 안 하도록
            onClose();
          }}
        >
          ✕
        </button>
      )}

      {/* 상단 흰 배경 */}
      <div className="bg-blue-200 px-4 pt-4 pb-3">
        <div className="text-lg font-semibold mb-1">{store.name}</div>
        <div className="text-sm text-gray-600">{store.address}</div>
        <div className="text-sm text-gray-600">{store.phone}</div>
        <div className="text-sm text-gray-600 mt-1">
          {isStoreOpen(store.hours, store.remain) ? '영업중' : '영업종료'}
        </div>
        <div className="text-sm text-gray-600">
          천원의 아침밥 운영 시간: {store.hours}
        </div>
      </div>

      {/* 하단 회색 바 */}
      <div className="bg-blue-100 px-4 py-3 flex justify-between items-center text-sm">
        <div>
          <div className="text-lg font-semibold">메뉴</div>
          <div>{store.menu.join(', ')}</div>
        </div>
        <div className="text-right">
          <div className="text-base font-semibold">남은 수량</div>
          <div>{store.remain}개</div>
        </div>
      </div>
      </div>
    </motion.div>
  );
}