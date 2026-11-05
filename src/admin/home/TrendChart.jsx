import { useMemo, useState } from 'react';
import { Card } from '../ui.jsx';
import { formatMoney } from './format.js';

const WIDTH = 640;
const HEIGHT = 260;
const PAD = { top: 18, right: 16, bottom: 40, left: 44 };

function buildPath(points, getY) {
  return points
    .map((point, index) => {
      const x = PAD.left + (index / Math.max(points.length - 1, 1)) * (WIDTH - PAD.left - PAD.right);
      const prefix = index === 0 ? 'M' : 'L';
      return `${prefix}${x} ${getY(point)}`;
    })
    .join(' ');
}

export function TrendChart({ trends }) {
  const [range, setRange] = useState('daily');
  const [active, setActive] = useState(null);
  const points = trends[range];

  const chart = useMemo(() => {
    const maxRevenue = Math.max(...points.map((point) => point.revenue), 1);
    const maxOrders = Math.max(...points.map((point) => point.orders), 1);
    const innerH = HEIGHT - PAD.top - PAD.bottom;
    const innerW = WIDTH - PAD.left - PAD.right;
    const yRevenue = (value) => PAD.top + innerH * (1 - value / maxRevenue);
    const yOrders = (value) => PAD.top + innerH * (1 - value / maxOrders);
    const xAt = (index) => PAD.left + (index / Math.max(points.length - 1, 1)) * innerW;

    return {
      maxRevenue,
      revenuePath: buildPath(points, (point) => yRevenue(point.revenue)),
      areaPath: `${buildPath(points, (point) => yRevenue(point.revenue))} L${xAt(points.length - 1)} ${PAD.top + innerH} L${xAt(0)} ${PAD.top + innerH} Z`,
      orderPath: buildPath(points, (point) => yOrders(point.orders)),
      xAt,
      yRevenue,
      ticks: [0, 0.5, 1].map((ratio) => Math.round(maxRevenue * ratio)),
    };
  }, [points]);

  const onMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / bounds.width;
    const index = Math.min(points.length - 1, Math.max(0, Math.round(ratio * (points.length - 1))));
    setActive(index);
  };

  return (
    <Card className="h-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-['Circe'] text-[11px] font-semibold tracking-[0.16em] text-[#7A8BA3] uppercase">
            Revenue & orders
          </p>
          <h3 className="mt-1 font-gelica text-xl text-[#1A2744]">Trend</h3>
        </div>
        <div className="flex rounded-xl bg-[#F4F1EA] p-1">
          {['daily', 'weekly'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setRange(value);
                setActive(null);
              }}
              className={`cursor-pointer rounded-lg px-3 py-1.5 font-['Circe'] text-xs font-semibold capitalize ${
                range === value ? 'bg-white text-[#1A2744] shadow-sm' : 'text-[#5C6B82]'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 font-['Circe'] text-[11px] text-[#5C6B82]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-full bg-[#4372B8]" /> Revenue
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-[3px] w-4 rounded-full bg-[#1A2744]" /> Orders
        </span>
      </div>

      <div className="relative mt-2">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-[220px] w-full sm:h-[248px]"
          onMouseMove={onMove}
          onMouseLeave={() => setActive(null)}
          role="img"
          aria-label="Orders and revenue trend"
        >
          {chart.ticks.map((tick) => {
            const y = PAD.top + (HEIGHT - PAD.top - PAD.bottom) * (1 - tick / chart.maxRevenue);
            return (
              <g key={tick}>
                <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} stroke="#E6E1D6" strokeWidth="1" />
                <text x={PAD.left - 8} y={y + 3} textAnchor="end" className="fill-[#7A8BA3]" fontSize="10">
                  {tick >= 1000 ? `$${Math.round(tick / 1000)}k` : `$${tick}`}
                </text>
              </g>
            );
          })}

          <path d={chart.areaPath} fill="#4372B8" opacity="0.12" />
          <path d={chart.revenuePath} fill="none" stroke="#4372B8" strokeWidth="2.4" strokeLinecap="round" />
          <path d={chart.orderPath} fill="none" stroke="#1A2744" strokeWidth="2.2" strokeLinecap="round" />

          {points.map((point, index) => (
            <text
              key={point.date}
              x={chart.xAt(index)}
              y={HEIGHT - 10}
              textAnchor="middle"
              className="fill-[#7A8BA3]"
              fontSize="10"
            >
              {range === 'daily' && index % 2 === 1 ? '' : point.label}
            </text>
          ))}

          {active != null && (
            <g>
              <line
                x1={chart.xAt(active)}
                x2={chart.xAt(active)}
                y1={PAD.top}
                y2={HEIGHT - PAD.bottom}
                stroke="#1A2744"
                strokeOpacity="0.25"
              />
              <circle cx={chart.xAt(active)} cy={chart.yRevenue(points[active].revenue)} r="4.5" fill="#4372B8" />
            </g>
          )}
        </svg>

        {active != null && (
          <div className="pointer-events-none absolute top-2 right-2 rounded-xl border border-[#E6E1D6] bg-white px-3 py-2 shadow-sm">
            <p className="font-['Circe'] text-[11px] text-[#7A8BA3]">{points[active].label}</p>
            <p className="font-['Circe'] text-sm font-semibold text-[#1A2744]">{formatMoney(points[active].revenue)}</p>
            <p className="font-['Circe'] text-xs text-[#5C6B82]">{points[active].orders} orders</p>
          </div>
        )}
      </div>
    </Card>
  );
}
