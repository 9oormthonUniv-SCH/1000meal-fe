interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function InputName({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm text-gray-700">
        이름 <span className="text-orange-500">*</span>
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-gray-300 outline-none py-2 focus:border-gray-900"
        placeholder="이름을 입력해주세요"
      />
    </div>
  );
}