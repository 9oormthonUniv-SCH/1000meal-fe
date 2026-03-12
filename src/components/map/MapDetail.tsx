'use client';

import { getStoreDisplayStock } from '@/lib/utils/store';
import type { StoreListItem } from '@/types/store';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk';
import Header from '../common/Header';
import MapStoreCard from './MapStoreCard';

interface MapDetailProps {
  stores?: StoreListItem[];
  onRefresh?: () => void;
}

export default function MapDetail({ stores = [], onRefresh }: MapDetailProps) {
  const [selectedStore, setSelectedStore] = useState<StoreListItem | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);
  const [modalHeight, setModalHeight] = useState(0);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // 모달 높이에 맞춰 새로고침 버튼 위치 계산
  const refreshBottom = selectedStore ? modalHeight + 20 : 68;

  // kakao sdk 준비
  useEffect(() => {
    if (!window.kakao?.maps) return;
    window.kakao.maps.load(() => setLoaded(true));
  }, []);

  // 하단 모달 높이 관측 → 새로고침 버튼이 모달 위에 오도록
  const setModalRef = useCallback((node: HTMLDivElement | null) => {
    modalRef.current = node;
  }, []);

  useEffect(() => {
    const el = modalRef.current;
    if (!el || !selectedStore) {
      setModalHeight(0);
      return;
    }
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setModalHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [selectedStore]);

  // 마커 데이터 (재고 = 당일 메뉴 그룹별 재고 합계)
  const markers = stores.map(s => ({
    id: s.id,
    name: s.name,
    remain: getStoreDisplayStock(s),
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
      {/* 줌 버튼 */}
      {!selectedStore && (
        <div className="absolute right-3 bottom-28 z-50 flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
          <button
            className="w-10 h-10 flex items-center justify-center border-b border-gray-200 hover:bg-gray-100"
            onClick={() => mapInstance && mapInstance.setLevel(mapInstance.getLevel() - 1)}
          >
            <span className="text-xl">＋</span>
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
            onClick={() => mapInstance && mapInstance.setLevel(mapInstance.getLevel() + 1)}
          >
            <span className="text-xl">－</span>
          </button>
        </div>
      )}

      {/* 새로고침 버튼: 하단 중앙, 모달이 올라오면 그 위에 고정 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20 flex justify-center pointer-events-none"
        style={{ bottom: `${refreshBottom}px` }}
      >
        <button
          type="button"
          onClick={onRefresh}
          aria-label="새로고침"
          className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 bg-white/95 border border-gray-200 rounded-full shadow-md hover:bg-gray-50 active:bg-gray-100 transition"
        >
          <RefreshCcw className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">새로고침</span>
        </button>
      </div>

      {/* 슬라이드 카드 */}
      <AnimatePresence>
        {selectedStore && (
          <motion.div
            ref={setModalRef}
            className="absolute bottom-0 w-full z-10 bg-white rounded-t-xl shadow-lg"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => { if (info.offset.y > 100) setSelectedStore(null); }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            <MapStoreCard
              store={selectedStore}
              onReload={onRefresh}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}