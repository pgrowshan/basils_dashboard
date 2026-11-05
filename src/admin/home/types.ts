export type OrderStatus =
  | 'Awaiting eTransfer'
  | 'Awaiting Payment'
  | 'Paid'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type MetricFormat = 'number' | 'currency';
export type MetricGroup = 'users' | 'orders';
export type ChangeDirection = 'up' | 'down' | 'flat';
export type TrendRange = 'daily' | 'weekly';

export interface MetricChange {
  percent: number;
  direction: ChangeDirection;
  label: string;
}

export interface MetricCard {
  id: string;
  label: string;
  value: number;
  format: MetricFormat;
  change: MetricChange;
  group: MetricGroup;
}

export interface TrendPoint {
  label: string;
  date: string;
  orders: number;
  revenue: number;
}

export interface StatusSlice {
  status: OrderStatus;
  count: number;
  color: string;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  status: OrderStatus;
  total: number;
}

export interface DashboardOverview {
  generatedAt: string;
  periodLabel: string;
  metrics: {
    totalUsers: MetricCard;
    newSignups: MetricCard;
    activeUsers: MetricCard;
    totalOrders: MetricCard;
    totalRevenue: MetricCard;
    pendingOrders: MetricCard;
    completedOrders: MetricCard;
  };
  trends: Record<TrendRange, TrendPoint[]>;
  statusDistribution: StatusSlice[];
  recentOrders: RecentOrder[];
}
