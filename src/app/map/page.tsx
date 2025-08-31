'use client';

import MapDetail from '@/components/map/MapDetail';
import { getStoreList } from '@/lib/api/stores';
import { useApi } from '@/lib/hooks/useApi';
import { StoreListItem } from '@/types/store';

export default function MapPage() {
  const { data: storeList = []} =
    useApi<StoreListItem[]>(getStoreList, []);

  console.log(storeList);
  return (
    <div className="w-full h-dvh overflow-hidden">
      
      <MapDetail stores={storeList ?? []}/>
    </div>
  );
}