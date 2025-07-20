'use client';

import { useEffect, useState } from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { mockStores } from '@/constants/mockStores';
import { Store } from "@/types/store";
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react'; // 아이콘 라이브러리 사용

export default function MapView({ onSelectStore }: { onSelectStore: (store: Store | null) => void }) {
  const [loaded, setLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!window.kakao?.maps) return;
    window.kakao.maps.load(() => {
      setLoaded(true);
    });
  }, []);

  const handleMarkerClick = (storeId: string, position: { lat: number; lng: number }) => {
    const store = mockStores.find((s) => s.id === storeId);
    if (store) onSelectStore(store);
    if (!mapInstance) return;

    const latLng = new kakao.maps.LatLng(position.lat, position.lng);
    const currentCenter = mapInstance.getCenter();

    const isSameCenter =
      Math.abs(currentCenter.getLat() - position.lat) < 0.0001 &&
      Math.abs(currentCenter.getLng() - position.lng) < 0.0001;

    if (isSameCenter) {
      mapInstance.setLevel(2);
    } else {
      mapInstance.panTo(latLng);
    }
  };

  if (!loaded) return <div className="h-[300px] bg-gray-200 rounded-xl">지도를 불러오는 중...</div>;

  return (
    <div className="relative w-full max-w-[430px] h-[300px] mx-auto rounded-xl overflow-hidden shadow-sm">
      {/* 우측 상단 + 버튼 */}
      <button
        onClick={() => router.push('/map')}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
      >
        <Plus className="w-5 h-5 text-orange-500" />
      </button>

      <Map
        center={{ lat: 36.7720, lng: 126.9324 }}
        style={{ width: '100%', height: '400px', borderRadius: '12px' }}
        level={4}
        onCreate={(map) => setMapInstance(map)}
        onClick={(_target, mouseEvent) => {
          const lat = mouseEvent.latLng.getLat();
          const lng = mouseEvent.latLng.getLng();
          console.log('📍 클릭한 위치:', { lat, lng });
        }}
      >
        {mockStores.map((store) => (
          <CustomOverlayMap
            key={store.id}
            position={store.position}
            clickable={true}
            yAnchor={1}
            xAnchor={0.5}
          >
            <div
              onClick={() => handleMarkerClick(store.id, store.position)}
              className={`relative w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${
                store.remain === 0 ? 'bg-red-500' : 'bg-green-500'
              } shadow-md cursor-pointer`}
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