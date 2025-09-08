type Props = { tab: "id" | "pw"; setTab: (v: "id" | "pw") => void };

export default function FindAccountTabs({ tab, setTab }: Props) {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        className={`flex-1 py-2 text-center ${
          tab === "id" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-400"
        }`}
        onClick={() => setTab("id")}
      >
        아이디 찾기
      </button>
      <button
        className={`flex-1 py-2 text-center ${
          tab === "pw" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-400"
        }`}
        onClick={() => setTab("pw")}
      >
        비밀번호 찾기
      </button>
    </div>
  );
}