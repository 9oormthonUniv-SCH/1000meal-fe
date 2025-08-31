import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  agreeTos: boolean;
  setAgreeTos: (v: boolean) => void;
  agreePrivacy: boolean;
  setAgreePrivacy: (v: boolean) => void;
}

export default function Agreements({ agreeTos, setAgreeTos, agreePrivacy, setAgreePrivacy }: Props) {
  const router = useRouter();
  const agreeAll = agreeTos && agreePrivacy;

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={agreeAll}
          onChange={(e) => {
            const v = e.target.checked;
            setAgreeTos(v);
            setAgreePrivacy(v);
          }}
          className="w-5 h-5 accent-orange-500"
        />
        <span className="font-medium">모두 동의합니다</span>
      </label>

      <div className="pl-4 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={agreeTos}
              onChange={(e) => setAgreeTos(e.target.checked)}
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-gray-700">[필수] 이용약관 동의</span>
          </label>
          <button
            type="button"
            onClick={() => router.push('/signup/terms?doc=tos')}
            className="text-xs text-gray-500 inline-flex items-center gap-1 hover:underline"
          >
            내용 보기 <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-gray-700">[필수] 개인 정보 수집 및 이용 동의</span>
          </label>
          <button
            type="button"
            onClick={() => router.push('/signup/terms?doc=privacy')}
            className="text-xs text-gray-500 inline-flex items-center gap-1 hover:underline"
          >
            내용 보기 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}