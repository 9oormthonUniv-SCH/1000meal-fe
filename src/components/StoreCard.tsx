'use client';

import { Store } from "@/types/store";
import { useRouter } from 'next/navigation';
interface Props {
  store: Store;
}

export default function StoreCard({ store }: Props) {
  const router = useRouter();
  return (
    <div className="border rounded-lg p-4 shadow-sm mb-4 bg-white" onClick={() => router.push(`/store/${store.id}`)}>
      <h2 className="text-lg font-semibold">{store.name}</h2>
      <p className="text-sm text-gray-600">메뉴: {store.menu.join(", ")}</p>
      <p className="mt-2 font-bold">
        남은 수량:{" "}
        <span className={store.remain === 0 ? "text-red-500" : "text-green-600"}>
          {store.remain}개
        </span>
      </p>
    </div>
  );
}