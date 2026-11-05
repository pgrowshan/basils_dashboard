import { Card } from '../ui.jsx';

const RADIUS = 62;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function StatusDonut({ slices }) {
  const total = slices.reduce((sum, slice) => sum + slice.count, 0);
  const ringTotal = total || 1;
  let offset = 0;
  const rings = slices.map((slice) => {
    const length = (slice.count / ringTotal) * CIRCUMFERENCE;
    const item = { ...slice, length, offset };
    offset += length;
    return item;
  });

  return (
    <Card className="h-full">
      <p className="font-['Circe'] text-[11px] font-semibold tracking-[0.16em] text-[#7A8BA3] uppercase">
        Order status
      </p>
      <h3 className="mt-1 font-gelica text-xl text-[#1A2744]">Distribution</h3>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-44 w-44 shrink-0">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
            <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#F0EBE0" strokeWidth="16" />
            {rings.map((ring) => (
              <circle
                key={ring.status}
                cx="80"
                cy="80"
                r={RADIUS}
                fill="none"
                stroke={ring.color}
                strokeWidth="16"
                strokeDasharray={`${ring.length} ${CIRCUMFERENCE - ring.length}`}
                strokeDashoffset={-ring.offset}
                strokeLinecap="butt"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-gelica text-2xl text-[#1A2744]">{total}</p>
            <p className="font-['Circe'] text-[11px] text-[#7A8BA3]">orders</p>
          </div>
        </div>

        <ul className="grid w-full gap-2">
          {slices.map((slice) => (
            <li key={slice.status} className="flex items-center justify-between gap-3 font-['Circe'] text-sm">
              <span className="inline-flex min-w-0 items-center gap-2 text-[#3E4C63]">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
                <span className="truncate">{slice.status}</span>
              </span>
              <span className="shrink-0 font-semibold text-[#1A2744]">{slice.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
