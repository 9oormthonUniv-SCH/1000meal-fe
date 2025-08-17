'use client';

import { useEffect, useState } from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '../common/Header';
import MapStoreCard from './MapStoreCard';
import type { StoreListItem } from '@/types/store';

interface MapViewProps {
  stores?: StoreListItem[]; // optional: 로딩 전 안전
}

export default function MapDetail({ stores = [] }: MapViewProps) {
  const [selectedStore, setSelectedStore] = useState<StoreListItem | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);

  // kakao sdk 준비
  useEffect(() => {
    if (!window.kakao?.maps) return;
    window.kakao.maps.load(() => setLoaded(true));
  }, []);

  // 마커 데이터
  const markers = stores.map(s => ({
    id: s.id,
    name: s.name,
    remain: s.remain,
    lat: Number(s.lat),
    lng: Number(s.lng),
  }));

  const handleMarkerClick = (storeId: number, position: { lat: number; lng: number }) => {
    const store = stores.find(s => s.id === storeId);
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

  if (!loaded) {
    return (
      <div className="relative w-full h-full">
        <Header title="지도로 보기" />
        <div className="p-4">지도를 불러오는 중…</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl shadow-sm">
      <Header title="지도로 보기" />

      <Map
        center={{ lat: 36.7720, lng: 126.9324 }}
        style={{ width: '100%', height: '100%' }}
        level={4}
        onCreate={setMapInstance}
      >
        {markers.map((m) => (
          <CustomOverlayMap
            key={m.id}
            position={{ lat: m.lat, lng: m.lng }}
            yAnchor={1}
            xAnchor={0.5}
          >
            <div
              onClick={() => handleMarkerClick(m.id, { lat: m.lat, lng: m.lng })}
              className={`relative w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${
                m.remain === 0 ? 'bg-red-500' : 'bg-green-500'
              } shadow-md cursor-pointer`}
            >
              {m.remain}
              <div
                className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                style={{
                  backgroundColor: m.remain === 0 ? '#ef4444' : '#16a34a',
                  zIndex: -1,
                }}
              />
            </div>
          </CustomOverlayMap>
        ))}
      </Map>

      {/* 줌 버튼 (선택) */}
      {!selectedStore && (
        <div className="absolute right-3 bottom-28 z-50 flex flex-col bg-white rounded-lg shadow">
          <button
            className="p-2 border-b hover:bg-gray-100"
            onClick={() => mapInstance && mapInstance.setLevel(mapInstance.getLevel() - 1)}
          >
            +
          </button>
          <button
            className="p-2 hover:bg-gray-100"
            onClick={() => mapInstance && mapInstance.setLevel(mapInstance.getLevel() + 1)}
          >
            −
          </button>
        </div>
      )}

      {/* 슬라이드 카드 */}
      <AnimatePresence>
        {selectedStore && (
          <motion.div
            className="absolute bottom-0 w-full z-10 bg-white rounded-t-xl shadow-lg"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => { if (info.offset.y > 100) setSelectedStore(null); }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            {/* MapStoreCard가 StoreListItem을 받도록 수정하거나, prop 이름을 맞춰주세요 */}
            <MapStoreCard store={selectedStore} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}