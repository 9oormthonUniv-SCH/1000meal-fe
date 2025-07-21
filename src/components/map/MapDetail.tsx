'use client';

import { useState } from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { mockStores } from '@/constants/mockStores';
import { Store } from '@/types/store';
import MapStoreCard from './MapStoreCard';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '../common/Header';

export default function MapDetail() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);
  const router = useRouter();

  const handleMarkerClick = (storeId: string, position: { lat: number; lng: number }) => {
    const store = mockStores.find((s) => s.id === storeId);
    if (!mapInstance || !store) return;
    setSelectedStore(store);

    const latLng = new kakao.maps.LatLng(position.lat - 0.003, position.lng);
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

  return (
    <div className="relative w-full h-full rounded-xl shadow-sm">
      <Header title="지도로 보기"/>

      {/* 지도 */}
      <Map
        center={{ lat: 36.7720, lng: 126.9324 }}
        style={{ width: '100%', height: '100%' }}
        level={4}
        onCreate={(map) => setMapInstance(map)}
      >
        {mockStores.map((store) => (
          <CustomOverlayMap
            key={store.id}
            position={store.position}
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

      {/* 슬라이드 카드 */}
      <AnimatePresence>
        {selectedStore && (
          <motion.div
            className="absolute bottom-0 w-full z-10 bg-white rounded-t-xl shadow-lg"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(event, info) => {
              if (info.offset.y > 100) {
                setSelectedStore(null); // 아래로 충분히 끌었으면 닫기
              }
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            <MapStoreCard store={selectedStore} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}