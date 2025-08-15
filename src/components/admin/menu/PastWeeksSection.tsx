'use client';

import MenuWeekEditor, { DayMenu } from "./MenuWeekEditor";

type Props = {
  pastWeeks: DayMenu[][];
};

export default function PastWeeksSection({ pastWeeks }: Props) {
  if (!pastWeeks.length) return null;
  return (
    <div className="space-y-6">
      {pastWeeks.map((week, idx) => (
        <MenuWeekEditor
          key={`past-${week[0]?.id ?? idx}`}
          title={`지난 주 ${idx + 1}`}
          week={week}
          readOnly
        />
      ))}
    </div>
  );
}