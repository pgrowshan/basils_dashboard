import { formatMetric } from './format.js';

const ICONS = {
  totalUsers: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm13 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  ),
  newSignups: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm10-5v6m3-3h-6" />
  ),
  activeUsers: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
  ),
  totalOrders: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6a2 2 0 012 2v12l-5-2-5 2V7a2 2 0 012-2zm0 4h6M9 13h4" />
  ),
  totalRevenue: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  ),
  pendingOrders: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  completedOrders: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
};

const TONES = {
  totalRevenue: 'bg-[#1A2744] text-white',
  totalOrders: 'bg-[#E8F0FA] text-[#4372B8]',
  pendingOrders: 'bg-[#FFF3D6] text-[#8A6D1B]',
  completedOrders: 'bg-[#E8F4E6] text-[#3E5A30]',
  totalUsers: 'bg-[#EEF1F5] text-[#1A2744]',
  newSignups: 'bg-[#E8F0FA] text-[#4372B8]',
  activeUsers: 'bg-[#E8F4E6] text-[#3E5A30]',
};

function Change({ change }) {
  const tone =
    change.direction === 'up'
      ? 'text-[#3E5A30]'
      : change.direction === 'down'
        ? 'text-red-600'
        : 'text-[#7A8BA3]';
  const arrow = change.direction === 'down' ? '↓' : change.direction === 'up' ? '↑' : '→';

  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-1.5 font-circe text-[12px] leading-none">
      <span className={`font-semibold tabular-nums ${tone}`}>
        {arrow} {change.percent.toFixed(1)}%
      </span>
      <span className="text-[#8A97A8]">vs prior period</span>
    </p>
  );
}

function MetricCardView({ card, featured = false }) {
  return (
    <article
      className={[
        'rounded-2xl border border-[#E7E2D6] bg-white p-5 shadow-[0_10px_30px_rgba(26,39,68,0.035)] transition hover:border-[#D9D3C6]',
        featured ? 'sm:col-span-2' : '',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TONES[card.id]}`}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            {ICONS[card.id]}
          </svg>
        </span>
        <p className="font-circe text-[13px] font-medium text-[#5C6B82]">{card.label}</p>
      </div>
      <p
        className={[
          'mt-4 font-gelica leading-none tracking-tight text-[#1A2744] tabular-nums',
          featured ? 'text-[36px] sm:text-[40px]' : 'text-[30px]',
        ].join(' ')}
      >
        {formatMetric(card.value, card.format)}
      </p>
      <Change change={card.change} />
    </article>
  );
}

export function MetricGrid({ metrics }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCardView card={metrics.totalRevenue} featured />
      <MetricCardView card={metrics.totalOrders} />
      <MetricCardView card={metrics.pendingOrders} />
      <MetricCardView card={metrics.completedOrders} />
      <MetricCardView card={metrics.totalUsers} />
      <MetricCardView card={metrics.newSignups} />
      <MetricCardView card={metrics.activeUsers} />
    </div>
  );
}
