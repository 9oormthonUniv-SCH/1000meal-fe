'use client';

import { useEffect, useState } from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { mockStores } from '@/constants/mockStores';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MapView() {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!window.kakao?.maps) return;
    window.kakao.maps.load(() => {
      setLoaded(true);
    });
  }, []);

  if (!loaded) return <div className="h-[300px] bg-gray-200 rounded-xl">지도를 불러오는 중...</div>;

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
        {mockStores.map((store) => (
          <CustomOverlayMap
            key={store.id}
            position={{ lat: store.position.lat, lng: store.position.lng }}
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