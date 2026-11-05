import type { DashboardOverview, MetricCard, RecentOrder, StatusSlice, TrendPoint } from './types.ts';

function metric(
  card: Omit<MetricCard, 'change'> & { change: number; changeLabel?: string },
): MetricCard {
  const direction = card.change > 0 ? 'up' : card.change < 0 ? 'down' : 'flat';
  return {
    ...card,
    change: {
      percent: Math.abs(card.change),
      direction,
      label: card.changeLabel || 'vs last 30 days',
    },
  };
}

const daily: TrendPoint[] = [
  { label: 'Oct 23', date: '2026-10-23', orders: 11, revenue: 1680 },
  { label: 'Oct 24', date: '2026-10-24', orders: 14, revenue: 2140 },
  { label: 'Oct 25', date: '2026-10-25', orders: 9, revenue: 1290 },
  { label: 'Oct 26', date: '2026-10-26', orders: 18, revenue: 2760 },
  { label: 'Oct 27', date: '2026-10-27', orders: 21, revenue: 3180 },
  { label: 'Oct 28', date: '2026-10-28', orders: 16, revenue: 2410 },
  { label: 'Oct 29', date: '2026-10-29', orders: 13, revenue: 1980 },
  { label: 'Oct 30', date: '2026-10-30', orders: 19, revenue: 2890 },
  { label: 'Oct 31', date: '2026-10-31', orders: 24, revenue: 3640 },
  { label: 'Nov 1', date: '2026-11-01', orders: 17, revenue: 2520 },
  { label: 'Nov 2', date: '2026-11-02', orders: 22, revenue: 3310 },
  { label: 'Nov 3', date: '2026-11-03', orders: 15, revenue: 2240 },
  { label: 'Nov 4', date: '2026-11-04', orders: 20, revenue: 3070 },
  { label: 'Nov 5', date: '2026-11-05', orders: 18, revenue: 2680 },
];

const weekly: TrendPoint[] = [
  { label: 'Sep 14', date: '2026-09-14', orders: 72, revenue: 10840 },
  { label: 'Sep 21', date: '2026-09-21', orders: 81, revenue: 12160 },
  { label: 'Sep 28', date: '2026-09-28', orders: 69, revenue: 9960 },
  { label: 'Oct 5', date: '2026-10-05', orders: 88, revenue: 13220 },
  { label: 'Oct 12', date: '2026-10-12', orders: 94, revenue: 14180 },
  { label: 'Oct 19', date: '2026-10-19', orders: 86, revenue: 12890 },
  { label: 'Oct 26', date: '2026-10-26', orders: 107, revenue: 16140 },
  { label: 'Nov 2', date: '2026-11-02', orders: 92, revenue: 13820 },
];

const statusDistribution: StatusSlice[] = [
  { status: 'Delivered', count: 618, color: '#3E5A30' },
  { status: 'Shipped', count: 94, color: '#4372B8' },
  { status: 'Paid', count: 112, color: '#1A2744' },
  { status: 'Awaiting Payment', count: 18, color: '#C9A227' },
  { status: 'Awaiting eTransfer', count: 9, color: '#D97706' },
  { status: 'Cancelled', count: 42, color: '#C24141' },
];

const recentOrders: RecentOrder[] = [
  { id: 'o1', orderNumber: 'BB79379586', customerName: 'Rowshan Sheik', date: '2026-11-05T09:14:00.000Z', status: 'Paid', total: 142.6 },
  { id: 'o2', orderNumber: 'BB79326375', customerName: 'Maya Chen', date: '2026-11-04T18:42:00.000Z', status: 'Shipped', total: 86.4 },
  { id: 'o3', orderNumber: 'BB79291004', customerName: 'Jordan Hale', date: '2026-11-04T11:08:00.000Z', status: 'Delivered', total: 65.0 },
  { id: 'o4', orderNumber: 'BB79277411', customerName: 'Priya Nair', date: '2026-11-03T21:30:00.000Z', status: 'Awaiting eTransfer', total: 198.2 },
  { id: 'o5', orderNumber: 'BB79255190', customerName: 'Liam Ortega', date: '2026-11-03T16:05:00.000Z', status: 'Awaiting Payment', total: 48.0 },
  { id: 'o6', orderNumber: 'BB79233087', customerName: 'Sofia Alvarez', date: '2026-11-02T13:51:00.000Z', status: 'Delivered', total: 173.5 },
  { id: 'o7', orderNumber: 'BB79211842', customerName: 'Noah Patel', date: '2026-11-01T19:22:00.000Z', status: 'Cancelled', total: 65.0 },
  { id: 'o8', orderNumber: 'BB79190455', customerName: 'Elena Rossi', date: '2026-11-01T08:17:00.000Z', status: 'Shipped', total: 113.75 },
];

export const mockDashboardOverview: DashboardOverview = {
  generatedAt: '2026-11-05T06:00:00.000Z',
  periodLabel: 'Last 30 days',
  metrics: {
    totalUsers: metric({
      id: 'totalUsers',
      label: 'Total users',
      value: 1284,
      format: 'number',
      group: 'users',
      change: 8.2,
    }),
    newSignups: metric({
      id: 'newSignups',
      label: 'New signups',
      value: 146,
      format: 'number',
      group: 'users',
      change: 14.6,
    }),
    activeUsers: metric({
      id: 'activeUsers',
      label: 'Active users',
      value: 412,
      format: 'number',
      group: 'users',
      change: -2.1,
    }),
    totalOrders: metric({
      id: 'totalOrders',
      label: 'Total orders',
      value: 893,
      format: 'number',
      group: 'orders',
      change: 11.3,
    }),
    totalRevenue: metric({
      id: 'totalRevenue',
      label: 'Total revenue',
      value: 52480,
      format: 'currency',
      group: 'orders',
      change: 9.8,
    }),
    pendingOrders: metric({
      id: 'pendingOrders',
      label: 'Pending orders',
      value: 27,
      format: 'number',
      group: 'orders',
      change: 4.0,
    }),
    completedOrders: metric({
      id: 'completedOrders',
      label: 'Completed orders',
      value: 618,
      format: 'number',
      group: 'orders',
      change: 16.2,
    }),
  },
  trends: { daily, weekly },
  statusDistribution,
  recentOrders,
};

export function getMockDashboardOverview(): DashboardOverview {
  return structuredClone(mockDashboardOverview);
}
