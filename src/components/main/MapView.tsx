'use client';

import { StoreListItem } from '@/types/store';
import { Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk';

interface MapViewProps {
  stores?: StoreListItem[]; // ← optional로 받고
}

export default function MapView({stores} : MapViewProps) {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  console.log(stores);

  useEffect(() => {
    if (!window.kakao?.maps) return;
    window.kakao.maps.load(() => {
      setLoaded(true);
    });
  }, []);

  const markers = useMemo(
    () =>
      (stores ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        remain: s.remain,
        lat: Number(s.lat),
        lng: Number(s.lng),
      })),
    [stores]
  );

  if (!loaded) return (
    <div className="relative w-full max-w-[430px] h-[400px] mx-auto rounded-xl overflow-hidden shadow-sm">
      {/* 부드러운 그라데이션 배경 */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7f7f7,rgba(255,255,255,0))]" />

      {/* Shimmer */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-[shimmer_1.8s_infinite] pointer-events-none absolute -inset-y-1 -left-1/2 right-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent rotate-6" />
      </div>

      {/* 중앙 스피너 + 텍스트 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 shadow">
          <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
          <span className="text-sm text-gray-700">지도를 불러오는 중…</span>
        </div>
      </div>

      {/* shimmer keyframes (Tailwind 없으면 globals.css에 추가해도 됨) */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(150%); }
        }
      `}</style>
    </div>
  );

  return (
    <div className="relative w-full max-w-[430px] h-[400px] mx-auto rounded-xl overflow-hidden shadow-sm">
      {/* 우측 상단 + 버튼 */}
      <button
        onClick={() => router.push('/map')}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
      >
        <Plus className="w-5 h-5 text-orange-500" />
      </button>

      <Map
        center={{ lat: 36.7710, lng: 126.9324 }}
        style={{ width: '100%', height: '500px', borderRadius: '12px' }}
        level={4}
        draggable={false}
        zoomable={false}
        scrollwheel={false}
        disableDoubleClickZoom={true}
      >
        {markers.map((store) => (
          <CustomOverlayMap
            key={store.id}
            position={{ lat: store.lat, lng: store.lng }}
            clickable={false}
            yAnchor={1}
            xAnchor={0.5}
          >
            <div
              className={`relative w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${
                store.remain === 0 ? 'bg-red-500' : 'bg-green-500'
              } shadow-md`}
            >
              {store.remain}
              <div
                className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45"
                style={{
                  backgroundColor: store.remain === 0 ? '#ef4444' : '#16a34a',
                  zIndex: -1,
                }}
              />
            </div>
          </CustomOverlayMap>
        ))}
      </Map>
    </div>
  );
}