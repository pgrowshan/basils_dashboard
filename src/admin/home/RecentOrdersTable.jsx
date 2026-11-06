import { Link } from 'react-router-dom';
import { Badge, Card } from '../ui.jsx';
import { formatDate, formatMoney } from './format.js';

function statusTone(status) {
  if (status === 'Delivered') return 'green';
  if (status === 'Shipped' || status === 'Paid') return 'blue';
  if (status === 'Cancelled') return 'red';
  return 'yellow';
}

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function RecentOrdersTable({ orders }) {
  return (
    <Card className="overflow-hidden p-0 sm:p-0">
      <div className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6">
        <div>
          <p className="font-circe text-[11px] font-semibold tracking-[0.16em] text-[#8A97A8] uppercase">
            Activity
          </p>
          <h3 className="mt-1 font-gelica text-[22px] text-[#1A2744]">Recent orders</h3>
        </div>
        <Link
          to="/orders"
          className="inline-flex items-center gap-1 font-circe text-sm font-semibold text-[#4372B8] hover:text-[#2F5A99]"
        >
          View all
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[680px] w-full border-t border-[#F0EBE0] text-left">
          <thead className="bg-[#FBF9F4] font-circe text-[11px] tracking-[0.12em] text-[#8A97A8] uppercase">
            <tr>
              <th className="px-5 py-3 font-semibold sm:px-6">Order</th>
              <th className="px-5 py-3 font-semibold sm:px-6">Customer</th>
              <th className="px-5 py-3 font-semibold sm:px-6">Date</th>
              <th className="px-5 py-3 font-semibold sm:px-6">Status</th>
              <th className="px-5 py-3 text-right font-semibold sm:px-6">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EBE0] font-circe text-sm">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-[#7A8BA3] sm:px-6">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="bg-white transition hover:bg-[#FBF9F4]">
                  <td className="px-5 py-3.5 font-semibold tabular-nums tracking-wide text-[#1A2744] sm:px-6">
                    {order.orderNumber}
                  </td>
                  <td className="px-5 py-3.5 sm:px-6">
                    <span className="inline-flex items-center gap-2.5">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F0FA] font-circe text-[11px] font-semibold text-[#4372B8]">
                        {initials(order.customerName)}
                      </span>
                      <span className="text-[#3E4C63]">{order.customerName}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-[#6B7A90] sm:px-6">{formatDate(order.date)}</td>
                  <td className="px-5 py-3.5 sm:px-6">
                    <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-[#1A2744] sm:px-6">
                    {formatMoney(order.total)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
