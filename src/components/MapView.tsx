// components/MapView.tsx
'use client';

import { useEffect, useState } from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { mockStores } from '@/constants/mockStores';
import { Store } from "@/types/store";
import BottomStoreBar from './BottomStoreBar';
import { AnimatePresence } from 'framer-motion';

export default function MapView({ onSelectStore }: { onSelectStore: (store: Store | null) => void }) {
  const [loaded, setLoaded] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);

  useEffect(() => {
    if (!window.kakao?.maps) return;
    window.kakao.maps.load(() => {
      setLoaded(true);
    });
  }, []);

  const selectedStore = mockStores.find((store) => store.id === selectedStoreId);

  const handleMarkerClick = (storeId: string, position: { lat: number; lng: number }) => {
    setSelectedStoreId(storeId);
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

  if (!loaded) return <div className="h-[400px] bg-gray-200">지도를 불러오는 중...</div>;

  return (
    <div className="relative w-full max-w-[430px] mx-auto bg-white transition-all">
      <Map
        center={{ lat: 36.7720, lng: 126.9324 }}
        style={{ width: '100%', height: '400px' }}
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
              className={`relative w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${store.remain === 0 ? 'bg-red-500' : 'bg-green-500'} shadow-md cursor-pointer`}
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