'use client';

import { motion } from "framer-motion";
import StoreCard from "./StoreCard";

interface Store {
  id: number;
  name: string;
  imageUrl?: string;
  open: boolean;
}

interface OtherStoresViewerProps {
  stores: Store[]; // 여러 매장 데이터 받기
}

export default function OtherStoresViewer({ stores }: OtherStoresViewerProps) {
  return (
    <div className="px-4 pt-4">
      <h2 className="text-2xl font-semibold mb-3">다른 매장 보기</h2>

      <motion.div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-x-5 w-max px-1">
          {stores.map((s) => (
            <div key={s.id} className="flex-shrink-0">
              <StoreCard
                id={s.id}
                imageUrl={s.imageUrl ?? ""}
                storeName={s.name}
                isOpen={s.open}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}