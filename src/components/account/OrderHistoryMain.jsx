import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import stayBg from '../../assets/stay_bg.svg';
import { HISTORY_ORDERS, formatPaid, placedTime } from '../../data/orders';

const FILTERS = ['All Orders', 'Shipped', 'Delivered', 'Cancelled'];
const PAGE_SIZE = 6;

function statusClass(status) {
  if (status === 'Shipped') return 'bg-[#F6E7A8] text-[#3E5A30]';
  if (status === 'Cancelled') return 'border border-[#C5CDD8] text-[#8A97A8]';
  return 'border border-[#4372B8] text-[#4372B8]';
}

export default function OrderHistoryMain() {
  const [filter, setFilter] = useState('All Orders');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const visible = useMemo(() => {
    const rows = HISTORY_ORDERS.filter((order) => filter === 'All Orders' || order.status === filter);
    return [...rows].sort((a, b) => (sort === 'newest' ? placedTime(b.placed) - placedTime(a.placed) : placedTime(a.placed) - placedTime(b.placed)));
  }, [filter, sort]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const slice = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const chooseFilter = (next) => {
    setFilter(next);
    setPage(1);
  };

  return (
    <div
      className="bg-[#4372B8] pt-24 text-white md:pt-28"
      style={{ backgroundImage: `url(${stayBg})`, backgroundSize: '320px 240px', backgroundRepeat: 'repeat' }}
    >
      <div className="mx-auto w-full max-w-[920px] px-4 pt-6 pb-16 md:px-8 md:pt-8">
        <p className="mb-6 font-sans text-xs text-white/80">
          <Link to="/account" className="hover:text-white">My Account</Link>
          <span className="mx-1.5">&gt;</span>
          <span>Order History</span>
        </p>

        <h1 className="text-center font-gelica text-[36px] leading-none font-normal md:text-[44px]">Order History</h1>
        <p className="mt-3 text-center font-sans text-sm text-white/85">Every order you have placed with us, newest first.</p>

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => chooseFilter(name)}
                className={`cursor-pointer rounded-full px-2.5 py-1.5 font-sans text-xs md:px-3.5 md:text-sm ${filter === name ? 'bg-white text-[#1A2744]' : 'border border-white/80 text-white'}`}
              >
                {name}
              </button>
            ))}
          </div>
          <label className="relative block w-full md:w-auto">
            <span className="sr-only">Sort orders</span>
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(1);
              }}
              className="w-full cursor-pointer appearance-none rounded-[4px] bg-white px-3 py-2 pr-8 font-sans text-sm text-[#1A2744] outline-none md:w-[180px]"
            >
              <option value="newest">Sort: Newest first</option>
              <option value="oldest">Sort: Oldest first</option>
            </select>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-[#1A2744]">▾</span>
          </label>
        </div>

        <div className="mt-5 rounded-[10px] bg-[#FFFAF4] px-4 text-[#1A2744] md:px-6">
          {slice.length === 0 && (
            <p className="py-12 text-center font-sans text-sm text-[#5C6B82]">No orders in this view.</p>
          )}
          {slice.map((order, index) => (
            <article key={order.id} className={`flex gap-3 py-4 md:items-center md:gap-4 ${index < slice.length - 1 ? 'border-b border-[#E7E2D6]' : ''}`}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#E7E7E7] text-[#8A8A8A]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4">
                  <rect x="4" y="5" width="16" height="14" rx="1.5" />
                  <path d="M8 5.5V4.5h8v1" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-sm font-semibold">Order #{order.id}</p>
                    <p className="font-sans text-xs text-[#7A8BA3]">Placed {order.placed} · {order.items} {order.items === 1 ? 'item' : 'items'}</p>
                  </div>
                  <p className="font-sans text-sm font-semibold md:hidden">{formatPaid(order.total)}</p>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 md:hidden">
                  <span className={`rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold tracking-[0.08em] uppercase ${statusClass(order.status)}`}>{order.status}</span>
                  <Link to={`/account/orders/${order.id}`} className="font-sans text-xs text-[#4372B8]">View Details</Link>
                </div>
              </div>
              <span className={`hidden rounded-full px-3 py-1 font-sans text-[10px] font-semibold tracking-[0.08em] uppercase md:inline-block ${statusClass(order.status)}`}>{order.status}</span>
              <p className="hidden w-16 text-right font-sans text-sm font-semibold md:block">{formatPaid(order.total)}</p>
              <Link to={`/account/orders/${order.id}`} className="hidden w-24 text-right font-sans text-sm text-[#4372B8] md:block">View Details</Link>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => setPage(number)}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center font-sans text-sm ${current === number ? 'bg-white font-semibold text-[#1A2744]' : 'bg-white text-[#4372B8]'}`}
            >
              {number}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            disabled={current === pageCount}
            className="flex h-8 w-8 cursor-pointer items-center justify-center bg-white font-sans text-sm text-[#4372B8] disabled:cursor-default disabled:opacity-40"
            aria-label="Next page"
          >
            &gt;
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link to="/account" className="inline-block border border-white px-6 py-2.5 font-sans text-sm text-white">
            Back to My Account
          </Link>
        </div>
      </div>
    </div>
  );
}
