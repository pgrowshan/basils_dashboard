import { useMemo, useState } from 'react';
import { Card } from '../ui.jsx';
import { formatMoney } from './format.js';

const WIDTH = 720;
const HEIGHT = 268;
const PAD = { top: 22, right: 12, bottom: 36, left: 48 };

function moneyTick(value) {
  if (value >= 1000) return `$${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return `$${Math.round(value)}`;
}

function axisLabel(point, index, points, range) {
  if (range === 'weekly') return point.label;
  if (index % 2 === 1) return '';
  const prev = points[index - 2] || points[0];
  const month = point.label.replace(/ \d+$/, '');
  const prevMonth = prev.label.replace(/ \d+$/, '');
  if (index === 0 || month !== prevMonth) return point.label;
  return point.label.replace(/^[A-Za-z]+ /, '');
}

export function TrendChart({ trends }) {
  const [range, setRange] = useState('daily');
  const [active, setActive] = useState(null);
  const points = trends[range];

  const chart = useMemo(() => {
    const maxRevenue = Math.max(...points.map((point) => point.revenue), 1);
    const innerH = HEIGHT - PAD.top - PAD.bottom;
    const innerW = WIDTH - PAD.left - PAD.right;
    const band = innerW / Math.max(points.length, 1);
    const barW = Math.min(28, Math.max(8, band * 0.55));
    const xAt = (index) => PAD.left + band * index + band / 2;
    const yRevenue = (value) => PAD.top + innerH * (1 - value / maxRevenue);
    const ticks = [0, 0.5, 1].map((ratio) => Math.round(maxRevenue * ratio));

    return { maxRevenue, innerH, barW, xAt, yRevenue, ticks };
  }, [points]);

  const onMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / bounds.width;
    const index = Math.min(points.length - 1, Math.max(0, Math.floor(ratio * points.length)));
    setActive(index);
  };

  return (
    <Card className="flex h-full flex-col">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-circe text-[11px] font-semibold tracking-[0.16em] text-[#8A97A8] uppercase">
            Performance
          </p>
          <h3 className="mt-1 font-gelica text-[22px] text-[#1A2744]">Revenue trend</h3>
        </div>
        <div className="flex rounded-full bg-[#F4F1EA] p-1">
          {['daily', 'weekly'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setRange(value);
                setActive(null);
              }}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 font-circe text-xs font-semibold capitalize transition ${
                range === value ? 'bg-white text-[#1A2744] shadow-sm' : 'text-[#6B7A90] hover:text-[#1A2744]'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 font-circe text-[11px] text-[#8A97A8]">Paid orders only · hover a bar for volume</p>

      <div className="relative mt-1 flex-1">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-[230px] w-full sm:h-[248px]"
          onMouseMove={onMove}
          onMouseLeave={() => setActive(null)}
          role="img"
          aria-label="Paid revenue by day"
        >
          {chart.ticks.map((tick) => {
            const y = chart.yRevenue(tick);
            return (
              <g key={tick}>
                <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} stroke="#EEE9DE" strokeWidth="1" />
                <text x={PAD.left - 10} y={y + 3} textAnchor="end" fill="#8A97A8" fontSize="10" fontFamily="Circe, sans-serif">
                  {moneyTick(tick)}
                </text>
              </g>
            );
          })}

          {points.map((point, index) => {
            const x = chart.xAt(index);
            const barH = point.revenue > 0 ? Math.max(6, (point.revenue / chart.maxRevenue) * chart.innerH) : 0;
            const y = PAD.top + chart.innerH - barH;
            const highlighted = active === index;
            return (
              <g key={point.date}>
                <rect
                  x={x - chart.barW / 2}
                  y={y}
                  width={chart.barW}
                  height={barH}
                  rx="5"
                  fill={highlighted ? '#1A2744' : '#4372B8'}
                  opacity={active == null || highlighted ? 1 : 0.28}
                />
                {point.orders > 0 && (
                  <text
                    x={x}
                    y={y - 6}
                    textAnchor="middle"
                    fill="#1A2744"
                    fontSize="10"
                    fontFamily="Circe, sans-serif"
                  >
                    {point.orders}
                  </text>
                )}
              </g>
            );
          })}

          {points.map((point, index) => (
            <text
              key={`label-${point.date}`}
              x={chart.xAt(index)}
              y={HEIGHT - 12}
              textAnchor="middle"
              fill="#8A97A8"
              fontSize="10"
              fontFamily="Circe, sans-serif"
            >
              {axisLabel(point, index, points, range)}
            </text>
          ))}
        </svg>

        {active != null && (
          <div className="pointer-events-none absolute top-3 right-3 min-w-[138px] rounded-xl border border-[#E7E2D6] bg-white/95 px-3 py-2.5 shadow-[0_12px_30px_rgba(26,39,68,0.08)] backdrop-blur">
            <p className="font-circe text-[11px] font-medium text-[#8A97A8]">{points[active].label}</p>
            <p className="mt-1 font-circe text-sm font-semibold tabular-nums text-[#1A2744]">
              {formatMoney(points[active].revenue)}
            </p>
            <p className="font-circe text-[12px] text-[#5C6B82]">{points[active].orders} orders</p>
          </div>
        )}
      </div>
    </Card>
  );
}
