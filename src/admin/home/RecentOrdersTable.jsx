import { Link } from 'react-router-dom';
import { Badge, Card } from '../ui.jsx';
import { formatDate, formatMoney } from './format.js';

function statusTone(status) {
  if (status === 'Delivered') return 'green';
  if (status === 'Shipped' || status === 'Paid') return 'blue';
  if (status === 'Cancelled') return 'red';
  return 'yellow';
}

export function RecentOrdersTable({ orders }) {
  return (
    <Card className="overflow-hidden p-0 sm:p-0">
      <div className="flex items-end justify-between gap-3 px-4 py-4 sm:px-6">
        <div>
          <p className="font-['Circe'] text-[11px] font-semibold tracking-[0.16em] text-[#7A8BA3] uppercase">
            Recent activity
          </p>
          <h3 className="mt-1 font-gelica text-xl text-[#1A2744]">Latest orders</h3>
        </div>
        <Link
          to="/orders"
          className="font-['Circe'] text-sm font-semibold text-[#4372B8] hover:text-[#355f98]"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full border-t border-[#F0EBE0] text-left">
          <thead className="bg-[#FBF9F4] font-['Circe'] text-[11px] tracking-[0.12em] text-[#7A8BA3] uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold sm:px-6">Order ID</th>
              <th className="px-4 py-3 font-semibold sm:px-6">Customer</th>
              <th className="px-4 py-3 font-semibold sm:px-6">Date</th>
              <th className="px-4 py-3 font-semibold sm:px-6">Status</th>
              <th className="px-4 py-3 text-right font-semibold sm:px-6">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EBE0] font-['Circe'] text-sm">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#5C6B82] sm:px-6">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="bg-white hover:bg-[#FBF9F4]">
                  <td className="px-4 py-3.5 font-semibold text-[#1A2744] sm:px-6">{order.orderNumber}</td>
                  <td className="px-4 py-3.5 text-[#3E4C63] sm:px-6">{order.customerName}</td>
                  <td className="px-4 py-3.5 text-[#5C6B82] sm:px-6">{formatDate(order.date)}</td>
                  <td className="px-4 py-3.5 sm:px-6">
                    <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-[#1A2744] sm:px-6">
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
