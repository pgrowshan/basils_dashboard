import { Card } from '../ui.jsx';

const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const SHORT_STATUS = {
  'Awaiting eTransfer': 'eTransfer',
  'Awaiting Payment': 'Payment',
  Paid: 'Paid',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
};

export function StatusDonut({ slices }) {
  const total = slices.reduce((sum, slice) => sum + slice.count, 0);
  const ringTotal = total || 1;
  const rings = slices
    .filter((slice) => slice.count > 0)
    .reduce((items, slice) => {
      const previous = items[items.length - 1];
      const offset = previous ? previous.offset + previous.length : 0;
      return [...items, { ...slice, length: (slice.count / ringTotal) * CIRCUMFERENCE, offset }];
    }, []);

  return (
    <Card className="flex h-full flex-col">
      <p className="font-circe text-[11px] font-semibold tracking-[0.16em] text-[#8A97A8] uppercase">
        Fulfillment
      </p>
      <h3 className="mt-1 font-gelica text-[22px] text-[#1A2744]">Order status</h3>

      <div className="mt-5 flex flex-1 flex-col items-center gap-6">
        <div className="relative h-[148px] w-[148px]">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
            <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#F1ECE3" strokeWidth="18" />
            {rings.map((ring) => (
              <circle
                key={ring.status}
                cx="80"
                cy="80"
                r={RADIUS}
                fill="none"
                stroke={ring.color}
                strokeWidth="18"
                strokeDasharray={`${ring.length} ${CIRCUMFERENCE - ring.length}`}
                strokeDashoffset={-ring.offset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-gelica text-[28px] leading-none tabular-nums text-[#1A2744]">{total}</p>
            <p className="mt-1 font-circe text-[11px] tracking-[0.08em] text-[#8A97A8] uppercase">Total</p>
          </div>
        </div>

        <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-2.5">
          {slices.map((slice) => {
            const share = total ? Math.round((slice.count / total) * 100) : 0;
            const muted = slice.count === 0;
            return (
              <li key={slice.status} className="flex items-center justify-between gap-2">
                <span className="inline-flex min-w-0 items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: slice.color, opacity: muted ? 0.35 : 1 }}
                  />
                  <span className={`truncate font-circe text-[12px] ${muted ? 'text-[#B3BCC8]' : 'text-[#3E4C63]'}`}>
                    {SHORT_STATUS[slice.status] || slice.status}
                  </span>
                </span>
                <span className={`shrink-0 font-circe text-[12px] tabular-nums ${muted ? 'text-[#B3BCC8]' : 'text-[#1A2744]'}`}>
                  <span className="font-semibold">{slice.count}</span>
                  <span className="ml-1 text-[#8A97A8]">{share}%</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
