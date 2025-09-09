// components/main/MapView.tsx
'use client';

import { StoreListItem } from '@/types/store';
import { Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk';

interface MapViewProps {
  stores?: StoreListItem[];
}

export default function MapView({ stores }: MapViewProps) {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

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

  if (!loaded)
    return (
      <div className="relative w-full max-w-[430px] h-[320px] mx-auto rounded-xl overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        <span className="ml-2 text-sm text-gray-600">지도를 불러오는 중…</span>
      </div>
    );

  return (
    <div className="relative w-full max-w-[430px] h-[230px] mx-auto rounded-xl overflow-hidden shadow-sm">
      {/* 우측 상단 + 버튼 */}
      <button
        onClick={() => router.push('/map')}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
      >
        <Plus className="w-5 h-5 text-orange-500" />
      </button>

      {/* 지도 */}
      <Map
        center={{ lat: 36.772, lng: 126.9324 }}
        style={{ width: '100%', height: '100%', borderRadius: '12px' }}
        level={5}
        draggable={false}
        zoomable={false}
      >
        {markers.map((store) => (
          <CustomOverlayMap
            key={store.id}
            position={{ lat: store.lat, lng: store.lng }}
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