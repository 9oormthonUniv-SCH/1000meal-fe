interface Props {
  msg: string | null;
}

export default function ErrorMessage({ msg }: Props) {
  if (!msg) return null;
  return (
    <div className="text-sm text-red-600 border border-red-200 rounded-md p-3 bg-red-50">
      {msg}
    </div>
  );
}