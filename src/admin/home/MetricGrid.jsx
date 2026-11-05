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

function Change({ change }) {
  const tone =
    change.direction === 'up'
      ? 'bg-[#E8F4E6] text-[#3E5A30]'
      : change.direction === 'down'
        ? 'bg-red-50 text-red-600'
        : 'bg-[#EEF1F5] text-[#5C6B82]';
  const arrow = change.direction === 'down' ? '↓' : change.direction === 'up' ? '↑' : '→';

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <p className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-['Circe'] text-[11px] font-semibold ${tone}`}>
        {arrow} {change.percent.toFixed(1)}%
      </p>
      <p className="font-['Circe'] text-[11px] text-[#7A8BA3]">{change.label}</p>
    </div>
  );
}

function MetricCardView({ card }) {
  return (
    <article className="rounded-2xl border border-[#E6E1D6] bg-white p-4 shadow-[0_8px_30px_rgba(26,39,68,0.04)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-['Circe'] text-[11px] font-semibold tracking-[0.12em] text-[#7A8BA3] uppercase">
          {card.label}
        </p>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F0FA] text-[#4372B8]">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            {ICONS[card.id]}
          </svg>
        </span>
      </div>
      <p className="mt-3 font-gelica text-[28px] leading-none text-[#1A2744]">
        {formatMetric(card.value, card.format)}
      </p>
      <Change change={card.change} />
    </article>
  );
}

export function MetricGrid({ metrics }) {
  const orderCards = [metrics.totalOrders, metrics.totalRevenue, metrics.pendingOrders, metrics.completedOrders];
  const userCards = [metrics.totalUsers, metrics.newSignups, metrics.activeUsers];

  return (
    <div className="grid gap-5">
      <section>
        <p className="mb-3 font-['Circe'] text-[11px] font-semibold tracking-[0.16em] text-[#7A8BA3] uppercase">
          Order statistics
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {orderCards.map((card) => (
            <MetricCardView key={card.id} card={card} />
          ))}
        </div>
      </section>
      <section>
        <p className="mb-3 font-['Circe'] text-[11px] font-semibold tracking-[0.16em] text-[#7A8BA3] uppercase">
          User statistics
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {userCards.map((card) => (
            <MetricCardView key={card.id} card={card} />
          ))}
        </div>
      </section>
    </div>
  );
}
