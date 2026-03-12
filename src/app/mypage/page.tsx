'use client';

import { userRoleAtom } from '@/atoms/user';
import { useLogout } from '@/components/auth/LogoutButton';
import Header from '@/components/common/Header';
import Modal from '@/components/common/Modal';
import { deleteAccount } from '@/lib/api/auth/endpoints';
import { ApiError } from '@/lib/api/errors';
import { getMe } from '@/lib/api/users/endpoints';
import { getCookie } from '@/lib/auth/cookies';
import { MeResponse } from '@/types/user';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MyPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [role] = useAtom(userRoleAtom);
  const [loading, setLoading] = useState(true);
  const logout = useLogout();

  const [openModal, setOpenModal] = useState(false);
  const [, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        logout();
        return;
      }
      try {
        const user = await getMe(accessToken);
        setMe(user);

        // role(atom)이 아직 계산 전/null일 수 있으니, 값이 있을 때만 비교
        if (role && user.role !== role) {
          logout();
        }
      } catch (e: unknown) {
        if (e instanceof ApiError && e.status === 401) {
          logout();
        } else {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [role, logout]);

  const handleDelete = async () => {
    const token = getCookie("accessToken");
    if (!token) return logout();

    try {
      setDeleting(true);
      await deleteAccount(
        { currentPassword: "", agree: true }, // TODO: 비번 입력 UI 필요하면 여기에 반영
        token
      );
      logout(); // 탈퇴 성공 → 세션 초기화 & 로그인 화면으로
    } catch (err) {
      console.error(err);
      alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setDeleting(false);
      setOpenModal(false);
    }
  };

  if (loading) return <div className="p-6">불러오는 중...</div>;
  if (!me) return null;

  return (
    <div className="flex flex-col pt-[56px] bg-gray-100 min-h-dvh">
      <Header title="마이페이지" />

      <div className="flex flex-col">
        {/* 프로필 카드 */}
        <div className="bg-white pb-6">
          <div className="bg-white rounded-xl shadow-even mt-2 mx-4 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">
                👤
              </div>
              <div className="flex flex-col">
                <p className="text-md font-bold">{me.username}</p>
                <p className="text-sm text-gray-500">{me.email}</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600">
              {me.role === 'STUDENT' ? '학생' : '관리자'}
            </span>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="bg-white mt-6 divide-y">
          <button 
            className="w-full text-left px-5 py-4 text-gray-700 hover:bg-gray-5"
            onClick={() => router.push('/change-email')}
          >회원정보 수정</button>
          <button
            className="w-full text-left px-5 py-4 text-gray-700 hover:bg-gray-50"
            onClick={() => router.push('/find-account?tab=pw')}
          >
            비밀번호 변경
          </button>
          <button className="w-full text-left px-5 py-4 text-gray-700 hover:bg-gray-50" onClick={logout}>
            로그아웃
          </button>
          <button
            className="w-full text-left px-5 py-4 text-red-500 hover:bg-gray-50"
            onClick={() => setOpenModal(true)}
          >
            회원탈퇴
          </button>
        </div>
      </div>

      {/* 🔹 탈퇴 확인 모달 */}
      <DeleteAccountModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function DeleteAccountModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center px-4 py-6">
        <p className="text-gray-600 text-base font-medium leading-relaxed">
          탈퇴하면 모든 기록이 사라집니다
          <br />
          정말 탈퇴하시겠습니까?
        </p>

        <div className="flex gap-3 mt-8 w-full">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-red-50 text-red-500 font-semibold shadow-md hover:bg-red-100"
          >
            탈퇴하기
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-neutral-500 text-white font-semibold shadow-md hover:bg-neutral-600"
          >
            취소
          </button>
        </div>
      </div>
    </Modal>
  );
}