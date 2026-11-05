import { useMemo, useState } from 'react';
import { useGetOrders } from '../hooks/order/useGetOrders.js';
import { useUpdateOrderStatus } from '../hooks/order/useUpdateOrderStatus.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import { Badge, Button, Card, EmptyState, Input, PageHeader, StatusNote } from './ui.jsx';

const NEXT_STATUSES = {
  'Awaiting eTransfer': ['Paid', 'Cancelled'],
  'Awaiting Payment': ['Paid', 'Cancelled'],
  Paid: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

const FILTERS = [
  { id: 'open', label: 'Needs action', statuses: ['Awaiting eTransfer', 'Awaiting Payment', 'Paid', 'Shipped'] },
  { id: 'all', label: 'All' },
  { id: 'unpaid', label: 'Unpaid', statuses: ['Awaiting eTransfer', 'Awaiting Payment'] },
  { id: 'paid', label: 'To ship', statuses: ['Paid'] },
  { id: 'shipped', label: 'Shipped', statuses: ['Shipped'] },
  { id: 'delivered', label: 'Delivered', statuses: ['Delivered'] },
  { id: 'cancelled', label: 'Cancelled', statuses: ['Cancelled'] },
];

const ACTION = {
  Paid: { label: 'Mark as paid', variant: 'primary' },
  Shipped: { label: 'Mark as shipped', variant: 'primary' },
  Delivered: { label: 'Mark as delivered', variant: 'primary' },
  Cancelled: { label: 'Cancel order', variant: 'danger' },
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

function confirmCopy(order, status) {
  if (status === 'Paid' && order.paymentMethod === 'Interac eTransfer') {
    return `Mark ${order.orderNumber} as paid only after the Interac e-Transfer has arrived. The customer will get a payment email.`;
  }
  if (status === 'Paid') {
    return `Mark ${order.orderNumber} as paid? Use this if Stripe charged the card but the order is still waiting.`;
  }
  if (status === 'Shipped') {
    return `Mark ${order.orderNumber} as shipped? The customer will be emailed that it is on the way.`;
  }
  if (status === 'Delivered') {
    return `Mark ${order.orderNumber} as delivered? This completes the order.`;
  }
  return `Cancel ${order.orderNumber}? This cannot be undone. Card payments are not refunded automatically.`;
}

function ConfirmDialog({ order, status, busy, onClose, onConfirm }) {
  const action = ACTION[status];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <p className="font-['Circe'] text-[11px] font-semibold tracking-[0.16em] text-[#8A97A8] uppercase">Confirm</p>
        <h3 className="mt-1 font-gelica text-xl text-[#1A2744]">{action.label}</h3>
        <p className="mt-3 font-['Circe'] text-sm leading-relaxed text-[#5C6B82]">{confirmCopy(order, status)}</p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
            Back
          </Button>
          <Button type="button" variant={action.variant} onClick={onConfirm} disabled={busy}>
            {busy ? 'Updating…' : action.label}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError, error } = useGetOrders();
  const updateStatus = useUpdateOrderStatus();
  const [filter, setFilter] = useState('open');
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState(null);

  const counts = useMemo(() => {
    const tally = { open: 0, all: orders.length, unpaid: 0, paid: 0, shipped: 0, delivered: 0, cancelled: 0 };
    orders.forEach((order) => {
      if (['Awaiting eTransfer', 'Awaiting Payment', 'Paid', 'Shipped'].includes(order.status)) tally.open += 1;
      if (order.status === 'Awaiting eTransfer' || order.status === 'Awaiting Payment') tally.unpaid += 1;
      if (order.status === 'Paid') tally.paid += 1;
      if (order.status === 'Shipped') tally.shipped += 1;
      if (order.status === 'Delivered') tally.delivered += 1;
      if (order.status === 'Cancelled') tally.cancelled += 1;
    });
    return tally;
  }, [orders]);

  const visible = useMemo(() => {
    const selected = FILTERS.find((item) => item.id === filter);
    const needle = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesFilter = !selected?.statuses || selected.statuses.includes(order.status);
      if (!matchesFilter) return false;
      if (!needle) return true;
      const haystack = [
        order.orderNumber,
        order.customerEmail,
        order.shipping?.firstName,
        order.shipping?.lastName,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [filter, orders, query]);

  const busy = updateStatus.isPending;

  return (
    <section className="grid gap-5">
      <PageHeader
        eyebrow="Fulfillment"
        title="Orders"
        description="Interac orders are marked paid when the transfer arrives. Card orders usually move to Paid through Stripe. Then ship, then mark delivered."
      />

      {isLoading && <StatusNote>Loading orders...</StatusNote>}
      {isError && <StatusNote tone="danger">{getApiErrorMessage(error)}</StatusNote>}
      {updateStatus.isError && <StatusNote tone="danger">{getApiErrorMessage(updateStatus.error)}</StatusNote>}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`cursor-pointer rounded-full px-3 py-1.5 font-['Circe'] text-xs font-semibold transition ${
                filter === item.id
                  ? 'bg-[#1A2744] text-white'
                  : 'border border-[#E7E2D6] bg-white text-[#5C6B82] hover:text-[#1A2744]'
              }`}
            >
              {item.label}
              <span className="ml-1.5 tabular-nums opacity-70">{counts[item.id] || 0}</span>
            </button>
          ))}
        </div>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search order, name, or email"
          className="lg:max-w-xs"
        />
      </div>

      <div className="grid gap-4">
        {visible.map((order) => {
          const actions = nextFor(order);
          return (
            <Card key={order._id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-['Circe'] text-lg font-semibold tracking-wide">{order.orderNumber}</p>
                    <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                    <span className="font-['Circe'] text-[11px] font-medium tracking-[0.08em] text-[#8A97A8] uppercase">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <p className="mt-1 break-words font-['Circe'] text-sm text-[#5C6B82]">
                    {order.shipping?.firstName} {order.shipping?.lastName} · {order.customerEmail}
                  </p>
                  {order.status === 'Awaiting eTransfer' && (
                    <p className="mt-2 font-['Circe'] text-sm text-[#8A6D1B]">Mark paid after the Interac e-Transfer arrives.</p>
                  )}
                  {order.status === 'Awaiting Payment' && (
                    <p className="mt-2 font-['Circe'] text-sm text-[#8A6D1B]">Stripe usually marks this paid. Use the button only if checkout completed and status did not move.</p>
                  )}
                  {order.status === 'Paid' && (
                    <p className="mt-2 font-['Circe'] text-sm text-[#4372B8]">Pack the order, then mark it shipped. The customer is emailed.</p>
                  )}
                  {order.status === 'Shipped' && (
                    <p className="mt-2 font-['Circe'] text-sm text-[#3E5A30]">Mark delivered when it has arrived. This completes the order.</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {actions.length === 0 && (
                    <p className="font-['Circe'] text-sm text-[#8A97A8]">
                      {order.status === 'Delivered' ? 'Order complete.' : 'No further actions.'}
                    </p>
                  )}
                  {actions.map((status) => (
                    <Button
                      key={status}
                      type="button"
                      variant={ACTION[status].variant}
                      disabled={busy}
                      onClick={() => setPending({ order, status })}
                    >
                      {ACTION[status].label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-2 border-t border-[#F0EBE0] pt-4">
                {order.items?.map((item) => (
                  <p key={`${order._id}-${item.productId}-${item.name}`} className="font-['Circe'] text-sm">
                    {item.name} × {item.quantity} · {money(item.price * item.quantity)}
                  </p>
                ))}
              </div>

              <div className="mt-4 font-['Circe'] text-sm leading-relaxed text-[#3E4C63]">
                <p>{order.shipping?.address}{order.shipping?.apt ? `, ${order.shipping.apt}` : ''}</p>
                <p>{order.shipping?.city}, {order.shipping?.province} {order.shipping?.postalCode}</p>
                <p>{order.shipping?.country}{order.shipping?.phone ? ` · ${order.shipping.phone}` : ''}</p>
                <p className="mt-2">{order.shippingMethod === 'express' ? 'Express' : 'Standard'} shipping</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-[#F7F4EE] p-3 font-['Circe'] text-sm sm:grid-cols-3 lg:grid-cols-5">
                <p>Subtotal {money(order.subtotal)}</p>
                <p>Discount {money(order.discount)}{order.promoCode ? ` (${order.promoCode})` : ''}</p>
                <p>Shipping {money(order.shippingCost)}</p>
                <p>Tax {money(order.tax)}</p>
                <p className="font-semibold">Total {money(order.grandTotal)}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {!isLoading && visible.length === 0 && (
        <EmptyState>{orders.length === 0 ? 'No orders yet.' : 'No orders match this filter.'}</EmptyState>
      )}

      {pending && (
        <ConfirmDialog
          order={pending.order}
          status={pending.status}
          busy={busy}
          onClose={() => !busy && setPending(null)}
          onConfirm={() => {
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
