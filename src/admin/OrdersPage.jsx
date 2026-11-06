import { useEffect, useMemo, useState } from 'react';
import { useGetOrders } from '../hooks/order/useGetOrders.js';
import { useBulkUpdateOrderStatus, useUpdateOrderStatus } from '../hooks/order/useUpdateOrderStatus.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import { Badge, Button, Card, Input, PageHeader, StatusNote } from './ui.jsx';

const NEXT_STATUSES = {
  'Awaiting eTransfer': ['Paid', 'Cancelled'],
  'Awaiting Payment': ['Paid', 'Cancelled'],
  Paid: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

const FILTERS = [
  { id: 'open', label: 'Needs action' },
  { id: 'unpaid', label: 'Unpaid' },
  { id: 'paid', label: 'To ship' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'all', label: 'All' },
];

const RANGES = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: 'all', label: 'All time' },
];

const ACTION = {
  Paid: { label: 'Mark paid', variant: 'primary' },
  Shipped: { label: 'Ship', variant: 'primary' },
  Delivered: { label: 'Delivered', variant: 'primary' },
  Cancelled: { label: 'Cancel', variant: 'danger' },
};

function money(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

function statusTone(status) {
  if (status === 'Delivered') return 'green';
  if (status === 'Paid' || status === 'Shipped') return 'blue';
  if (status === 'Cancelled') return 'red';
  return 'yellow';
}

function nextFor(order) {
  return order.nextStatuses || NEXT_STATUSES[order.status] || [];
}

function primaryAction(order) {
  return nextFor(order).find((status) => status !== 'Cancelled');
}

function formatWhen(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function customerName(order) {
  return `${order.shipping?.firstName || ''} ${order.shipping?.lastName || ''}`.trim() || 'Customer';
}

function itemCount(order) {
  return order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;
}

function ConfirmDialog({ title, body, confirmLabel, variant = 'primary', busy, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <p className="font-circe text-[11px] font-semibold tracking-[0.16em] text-[#8A97A8] uppercase">Confirm</p>
        <h3 className="mt-1 font-gelica text-xl text-[#1A2744]">{title}</h3>
        <p className="mt-3 font-circe text-sm leading-relaxed text-[#5C6B82]">{body}</p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>Back</Button>
          <Button type="button" variant={variant} onClick={onConfirm} disabled={busy}>
            {busy ? 'Updating…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [filter, setFilter] = useState('open');
  const [range, setRange] = useState('all');
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState({});
  const [selected, setSelected] = useState([]);
  const [pending, setPending] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setQ(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
    setSelected([]);
  }, [filter, range, q]);

  const params = { page, limit: 25, filter, q, range };
  const { data, isLoading, isError, error, isFetching } = useGetOrders(params);
  const updateStatus = useUpdateOrderStatus();
  const bulkUpdate = useBulkUpdateOrderStatus();

  const orders = data?.orders || [];
  const counts = data?.counts || {};
  const meta = data?.meta || { page: 1, limit: 25, total: 0, pages: 1 };
  const busy = updateStatus.isPending || bulkUpdate.isPending;
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const selectedOrders = orders.filter((order) => selectedSet.has(order._id));
  const bulkStatus = selectedOrders.length && selectedOrders.every((order) => order.status === 'Paid')
    ? 'Shipped'
    : selectedOrders.length && selectedOrders.every((order) => order.status === 'Shipped')
      ? 'Delivered'
      : null;

  const toggleOne = (id) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const togglePage = () => {
    const ids = orders.map((order) => order._id);
    const allOn = ids.every((id) => selectedSet.has(id));
    setSelected(allOn ? selected.filter((id) => !ids.includes(id)) : [...new Set([...selected, ...ids])]);
  };

  const confirmCopy = () => {
    if (!pending) return '';
    if (pending.type === 'bulk') {
      return pending.status === 'Shipped'
        ? `Ship ${pending.ids.length} paid orders? Each customer is emailed that their order is on the way.`
        : `Mark ${pending.ids.length} shipped orders as delivered? This completes them.`;
    }
    const order = pending.order;
    if (pending.status === 'Paid' && order.paymentMethod === 'Interac eTransfer') {
      return `Mark ${order.orderNumber} as paid only after the Interac e-Transfer has arrived.`;
    }
    if (pending.status === 'Paid') return `Mark ${order.orderNumber} as paid?`;
    if (pending.status === 'Shipped') return `Ship ${order.orderNumber}? The customer will be emailed.`;
    if (pending.status === 'Delivered') return `Mark ${order.orderNumber} as delivered? This completes the order.`;
    return `Cancel ${order.orderNumber}? This cannot be undone and does not refund a card payment.`;
  };

  return (
    <section className="grid gap-5">
      <PageHeader
        eyebrow="Fulfillment"
        title="Orders"
        description="Work the queue from unpaid → paid → shipped → delivered. Search, filter, and update 25 at a time. Select paid or shipped rows to move them in bulk."
      />

      {isError && <StatusNote tone="danger">{getApiErrorMessage(error)}</StatusNote>}
      {updateStatus.isError && <StatusNote tone="danger">{getApiErrorMessage(updateStatus.error)}</StatusNote>}
      {bulkUpdate.isError && <StatusNote tone="danger">{getApiErrorMessage(bulkUpdate.error)}</StatusNote>}
      {bulkUpdate.isSuccess && bulkUpdate.data?.data?.failed?.length > 0 && (
        <StatusNote tone="danger">{bulkUpdate.data.message}</StatusNote>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`cursor-pointer rounded-full px-3 py-1.5 font-circe text-xs font-semibold transition ${
                filter === item.id
                  ? 'bg-[#1A2744] text-white'
                  : 'border border-[#E7E2D6] bg-white text-[#5C6B82] hover:text-[#1A2744]'
              }`}
            >
              {item.label}
              <span className="ml-1.5 tabular-nums opacity-70">{counts[item.id] ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {RANGES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRange(item.id)}
                className={`cursor-pointer rounded-lg px-2.5 py-1 font-circe text-xs font-medium ${
                  range === item.id ? 'bg-[#E8F0FA] text-[#1A2744]' : 'text-[#6B7A90] hover:text-[#1A2744]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order, customer, or email"
            className="sm:max-w-sm"
          />
        </div>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-col gap-2 rounded-2xl border border-[#1A2744] bg-[#1A2744] px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
          <p className="font-circe text-sm font-medium">{selected.length} selected</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={() => setSelected([])} disabled={busy}>
              Clear
            </Button>
            {bulkStatus && (
              <Button
                type="button"
                size="sm"
                onClick={() => setPending({ type: 'bulk', ids: selected, status: bulkStatus })}
                disabled={busy}
              >
                {bulkStatus === 'Shipped' ? `Ship ${selected.length}` : `Mark ${selected.length} delivered`}
              </Button>
            )}
            {!bulkStatus && (
              <p className="font-circe text-xs text-white/70">Select only Paid or only Shipped orders to bulk update.</p>
            )}
          </div>
        </div>
      )}

      <Card className="overflow-hidden p-0 sm:p-0">
        <div className="flex items-center justify-between border-b border-[#F0EBE0] px-4 py-3 sm:px-5">
          <p className="font-circe text-sm text-[#6B7A90]">
            {isLoading ? 'Loading…' : `${meta.total} order${meta.total === 1 ? '' : 's'}`}
            {isFetching && !isLoading ? ' · updating' : ''}
          </p>
          <p className="font-circe text-xs text-[#8A97A8]">Page {meta.page} of {meta.pages || 1}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full text-left">
            <thead className="bg-[#FBF9F4] font-circe text-[11px] tracking-[0.12em] text-[#8A97A8] uppercase">
              <tr>
                <th className="w-10 px-4 py-3 sm:px-5">
                  <input
                    type="checkbox"
                    checked={orders.length > 0 && orders.every((order) => selectedSet.has(order._id))}
                    onChange={togglePage}
                    aria-label="Select page"
                  />
                </th>
                <th className="px-3 py-3 font-semibold">Order</th>
                <th className="px-3 py-3 font-semibold">Customer</th>
                <th className="px-3 py-3 font-semibold">Placed</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 text-right font-semibold">Total</th>
                <th className="px-3 py-3 pr-5 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE0] font-circe text-sm">
              {orders.map((order) => {
                const open = Boolean(expanded[order._id]);
                const next = primaryAction(order);
                const canCancel = nextFor(order).includes('Cancelled');
                return (
                  <tr key={order._id} className="align-top hover:bg-[#FBF9F4]">
                    <td className="px-4 py-3 sm:px-5">
                      <input
                        type="checkbox"
                        checked={selectedSet.has(order._id)}
                        onChange={() => toggleOne(order._id)}
                        aria-label={`Select ${order.orderNumber}`}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        className="cursor-pointer text-left"
                        onClick={() => setExpanded((current) => ({ ...current, [order._id]: !open }))}
                      >
                        <p className="font-semibold tracking-wide text-[#1A2744]">{order.orderNumber}</p>
                        <p className="mt-0.5 text-[12px] text-[#8A97A8]">
                          {`${itemCount(order)} ${itemCount(order) === 1 ? 'item' : 'items'} · ${open ? 'Hide' : 'Details'}`}
                          {order.promoCode ? ` · ${order.promoCode}` : ''}
                          {Number(order.rewardsSpent) > 0 ? ` · ${order.rewardsSpent} pts` : ''}
                        </p>
                      </button>
                      {open && (
                        <div className="mt-3 max-w-md space-y-1 text-[13px] text-[#3E4C63]">
                          {order.items?.map((item) => (
                            <p key={`${order._id}-${item.productId}-${item.name}`}>
                              {item.name} × {item.quantity} · {money(item.price * item.quantity)}
                            </p>
                          ))}
                          <div className="mt-2 space-y-1 rounded-xl bg-[#F7F4EE] px-3 py-2.5 text-[12px]">
                            <p className="flex justify-between gap-4"><span>Subtotal</span><span className="tabular-nums">{money(order.subtotal)}</span></p>
                            {order.promoCode || Number(order.discount) - Number(order.rewardsDiscount || 0) > 0 ? (
                              <p className="flex justify-between gap-4 text-[#3E5A30]">
                                <span>Promo {order.promoCode || ''}</span>
                                <span className="tabular-nums">−{money(Number(order.discount || 0) - Number(order.rewardsDiscount || 0))}</span>
                              </p>
                            ) : (
                              <p className="flex justify-between gap-4 text-[#8A97A8]"><span>Promo</span><span>None</span></p>
                            )}
                            {Number(order.rewardsDiscount) > 0 ? (
                              <p className="flex justify-between gap-4 text-[#3E5A30]">
                                <span>Rewards {order.rewardsSpent} pts</span>
                                <span className="tabular-nums">−{money(order.rewardsDiscount)}</span>
                              </p>
                            ) : (
                              <p className="flex justify-between gap-4 text-[#8A97A8]"><span>Rewards</span><span>None</span></p>
                            )}
                            <p className="flex justify-between gap-4"><span>Shipping</span><span className="tabular-nums">{money(order.shippingCost)}</span></p>
                            <p className="flex justify-between gap-4"><span>Tax</span><span className="tabular-nums">{money(order.tax)}</span></p>
                            <p className="flex justify-between gap-4 font-semibold text-[#1A2744]"><span>Total</span><span className="tabular-nums">{money(order.grandTotal)}</span></p>
                          </div>
                          <p className="pt-2">
                            {order.shipping?.address}{order.shipping?.apt ? `, ${order.shipping.apt}` : ''}
                          </p>
                          <p>{order.shipping?.city}, {order.shipping?.province} {order.shipping?.postalCode}</p>
                          <p>{order.shipping?.phone || order.customerEmail}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-[#1A2744]">{customerName(order)}</p>
                      <p className="mt-0.5 text-[12px] text-[#8A97A8]">{order.paymentMethod}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[#6B7A90]">{formatWhen(order.createdAt)}</td>
                    <td className="px-3 py-3"><Badge tone={statusTone(order.status)}>{order.status}</Badge></td>
                    <td className="px-3 py-3 text-right font-semibold tabular-nums text-[#1A2744]">{money(order.grandTotal)}</td>
                    <td className="px-3 py-3 pr-5">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {next && (
                          <Button
                            type="button"
                            size="sm"
                            disabled={busy}
                            onClick={() => setPending({ type: 'single', order, status: next })}
                          >
                            {ACTION[next].label}
                          </Button>
                        )}
                        {canCancel && (
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            disabled={busy}
                            onClick={() => setPending({ type: 'single', order, status: 'Cancelled' })}
                          >
                            Cancel
                          </Button>
                        )}
                        {!next && !canCancel && (
                          <span className="text-xs text-[#8A97A8]">{order.status === 'Delivered' ? 'Done' : '—'}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!isLoading && orders.length === 0 && (
          <p className="px-4 py-10 text-center font-circe text-sm text-[#6B7A90]">No orders in this view.</p>
        )}

        {meta.pages > 1 && (
          <div className="flex items-center justify-between gap-3 border-t border-[#F0EBE0] px-4 py-3 sm:px-5">
            <Button type="button" size="sm" variant="secondary" disabled={page <= 1 || busy} onClick={() => setPage((value) => value - 1)}>
              Previous
            </Button>
            <p className="font-circe text-xs text-[#8A97A8]">
              {((meta.page - 1) * meta.limit) + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
            </p>
            <Button type="button" size="sm" variant="secondary" disabled={page >= meta.pages || busy} onClick={() => setPage((value) => value + 1)}>
              Next
            </Button>
          </div>
        )}
      </Card>

      {pending && (
        <ConfirmDialog
          title={pending.type === 'bulk' ? ACTION[pending.status].label : `${ACTION[pending.status].label} ${pending.order.orderNumber}`}
          body={confirmCopy()}
          confirmLabel={pending.type === 'bulk'
            ? (pending.status === 'Shipped' ? `Ship ${pending.ids.length}` : `Deliver ${pending.ids.length}`)
            : ACTION[pending.status].label}
          variant={ACTION[pending.status].variant}
          busy={busy}
          onClose={() => !busy && setPending(null)}
          onConfirm={() => {
            if (pending.type === 'bulk') {
              bulkUpdate.mutate(
                { ids: pending.ids, status: pending.status },
                { onSuccess: () => { setPending(null); setSelected([]); } },
              );
              return;
            }
            updateStatus.mutate(
              { id: pending.order._id, status: pending.status },
              { onSuccess: () => setPending(null) },
            );
          }}
        />
      )}
    </section>
  );
}
