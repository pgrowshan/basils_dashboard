import { useGetOrders } from '../hooks/order/useGetOrders.js';
import { useUpdateOrderStatus } from '../hooks/order/useUpdateOrderStatus.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import { Badge, Card, EmptyState, PageHeader, Select, StatusNote } from './ui.jsx';

const STATUSES = ['Awaiting eTransfer', 'Awaiting Payment', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

function money(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

function statusTone(status) {
  if (status === 'Shipped' || status === 'Delivered' || status === 'Paid') return 'gold';
  if (status === 'Cancelled') return 'red';
  return 'blue';
}

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError, error } = useGetOrders();
  const updateStatus = useUpdateOrderStatus();

  return (
    <section className="grid gap-5">
      <PageHeader
        eyebrow="Sales"
        title="Orders"
        description="Every checkout, including shipping and payment status."
      />

      {isLoading && <StatusNote>Loading orders...</StatusNote>}
      {isError && <StatusNote tone="danger">{getApiErrorMessage(error)}</StatusNote>}

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order._id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-['Circe'] text-lg font-semibold">{order.orderNumber}</p>
                  <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                </div>
                <p className="mt-1 break-words font-['Circe'] text-sm text-[#5C6B82]">
                  {order.shipping?.firstName} {order.shipping?.lastName} · {order.customerEmail}
                </p>
              </div>
              <Select
                value={order.status}
                onChange={(event) => updateStatus.mutate({ id: order._id, status: event.target.value })}
                className="sm:max-w-[220px]"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
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
              <p className="mt-2">{order.shippingMethod === 'express' ? 'Express' : 'Standard'} shipping · {order.paymentMethod}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-[#F7F4EE] p-3 font-['Circe'] text-sm sm:grid-cols-3 lg:grid-cols-5">
              <p>Subtotal {money(order.subtotal)}</p>
              <p>Discount {money(order.discount)}{order.promoCode ? ` (${order.promoCode})` : ''}</p>
              <p>Shipping {money(order.shippingCost)}</p>
              <p>Tax {money(order.tax)}</p>
              <p className="font-semibold">Total {money(order.grandTotal)}</p>
            </div>
          </Card>
        ))}
      </div>
      {!isLoading && orders.length === 0 && <EmptyState>No orders yet.</EmptyState>}
    </section>
  );
}
