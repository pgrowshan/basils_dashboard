import { useGetOrders } from '../hooks/order/useGetOrders.js';
import { useUpdateOrderStatus } from '../hooks/order/useUpdateOrderStatus.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';

const STATUSES = ['Awaiting eTransfer', 'Awaiting Payment', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

function money(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError, error } = useGetOrders();
  const updateStatus = useUpdateOrderStatus();

  return (
    <section>
      <h2 className="font-gelica text-3xl">Orders</h2>
      <p className="mt-2 font-['Circe'] text-sm text-[#5C6B82]">Every checkout, including shipping and Interac eTransfer status.</p>

      {isLoading && <p className="mt-6 font-['Circe'] text-sm">Loading orders...</p>}
      {isError && <p className="mt-6 font-['Circe'] text-sm text-red-600">{getApiErrorMessage(error)}</p>}

      <div className="mt-6 grid gap-4">
        {orders.map((order) => (
          <article key={order._id} className="bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-['Circe'] text-lg font-semibold">{order.orderNumber}</p>
                <p className="font-['Circe'] text-sm text-[#5C6B82]">
                  {order.shipping?.firstName} {order.shipping?.lastName} · {order.customerEmail}
                </p>
              </div>
              <select
                value={order.status}
                onChange={(event) => updateStatus.mutate({ id: order._id, status: event.target.value })}
                className="border border-[#D7DEE8] px-3 py-2 font-['Circe'] text-sm"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="mt-4 grid gap-2">
              {order.items?.map((item) => (
                <p key={`${order._id}-${item.productId}-${item.name}`} className="font-['Circe'] text-sm">
                  {item.name} × {item.quantity} · {money(item.price * item.quantity)}
                </p>
              ))}
            </div>

            <div className="mt-4 font-['Circe'] text-sm text-[#3E4C63]">
              <p>{order.shipping?.address}{order.shipping?.apt ? `, ${order.shipping.apt}` : ''}</p>
              <p>{order.shipping?.city}, {order.shipping?.province} {order.shipping?.postalCode}</p>
              <p>{order.shipping?.country}{order.shipping?.phone ? ` · ${order.shipping.phone}` : ''}</p>
              <p className="mt-2">{order.shippingMethod === 'express' ? 'Express' : 'Standard'} shipping · {order.paymentMethod}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 font-['Circe'] text-sm md:grid-cols-4">
              <p>Subtotal {money(order.subtotal)}</p>
              <p>Discount {money(order.discount)}{order.promoCode ? ` (${order.promoCode})` : ''}</p>
              <p>Shipping {money(order.shippingCost)}</p>
              <p>Tax {money(order.tax)}</p>
              <p className="font-semibold">Total {money(order.grandTotal)}</p>
            </div>
          </article>
        ))}
        {!isLoading && orders.length === 0 && <p className="font-['Circe'] text-sm text-[#5C6B82]">No orders yet.</p>}
      </div>
    </section>
  );
}
