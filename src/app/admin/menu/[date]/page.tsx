'use client';

import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/common/Header';
import WeekNavigator from '@/components/admin/menu/WeekNavigator';

dayjs.locale('ko');

function mondayOf(d: Dayjs) {
  const weekday = d.day(); // 0:일 ~ 6:토
  const diff = (weekday + 6) % 7; // 월(1) 기준
  return d.subtract(diff, 'day').startOf('day');
}

export default function AdminMenuEditPage() {
  const router = useRouter();
  const params = useParams<{ date?: string }>();
  const initial = params?.date && dayjs(params.date, 'YYYY-MM-DD', true).isValid()
    ? dayjs(params.date)
    : dayjs();

  // 현재 선택된 날짜/주 상태
  const [selectedId, setSelectedId] = useState<string>(initial.format('YYYY-MM-DD'));
  const [monday, setMonday] = useState<Dayjs>(mondayOf(initial));

  // 간단한 편집 상태(실서비스에선 서버에서 받아온 값 사용)
  // key: YYYY-MM-DD, value: 메뉴 라인업(줄바꿈 구분)
  const [menus, setMenus] = useState<Record<string, string>>({
    [selectedId]: '', // 비워둔 상태
  });

  // 현재 선택 메뉴 value
  const value = menus[selectedId] ?? '';

  const onShiftWeek = (delta: number) => {
    const nextMonday = monday.add(delta, 'week');
    setMonday(nextMonday);

    // 현재 선택 요일 index 유지
    const prev = dayjs(selectedId);
    const idx = prev.day(); // 0~6
    const nextDate = nextMonday.add(idx === 0 ? 6 : idx - 1, 'day'); // 월~일 정렬 보정
    const id = nextDate.format('YYYY-MM-DD');
    setSelectedId(id);
    setMenus((m) => (m[id] ? m : { ...m, [id]: '' }));
  };

  const save = () => {
    // TODO: API 호출
    console.log('SAVE', selectedId, menus[selectedId]);
    router.back();
  };

  // 상단 우측 저장 버튼
  const rightEl = (
    <button
      onClick={save}
      className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-sm font-semibold"
    >
      저장
    </button>
  );

  return (
    <div className="w-full min-h-dvh bg-white">
      <Header title="메뉴 수정" rightElement={rightEl} />

      {/* 주간 네비게이터 (월~일 + 주 이동) */}
      <WeekNavigator
        monday={monday}
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          setMenus((m) => (m[id] ? m : { ...m, [id]: '' }));
        }}
        onShiftWeek={onShiftWeek}
      />

      {/* 본문: 해당 날짜 메뉴 폼 */}
      <div className="p-4">
        <div className="mb-3 text-sm text-gray-500">
          {dayjs(selectedId).format('YYYY.MM.DD (ddd)')}
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            메뉴 (줄바꿈으로 구분)
          </label>
          <textarea
            rows={8}
            value={value}
            onChange={(e) =>
              setMenus((m) => ({ ...m, [selectedId]: e.target.value }))
            }
            placeholder={'예) 현미밥\n제육볶음\n미역국\n샐러드'}
            className="w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-orange-300 focus:outline-none"
          />

          {/* 미리보기 */}
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-1">미리보기</div>
            <ul className="rounded-xl bg-white border p-3 space-y-1">
              {(value ? value.split('\n') : []).filter(Boolean).map((line, i) => (
                <li key={i} className="text-sm text-gray-800">
                  • {line}
                </li>
              ))}
              {!value && (
                <li className="text-sm text-gray-400">아직 입력된 메뉴가 없어요</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}