import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import { useDashboardOverview } from '../hooks/dashboard/useDashboardOverview.js';
import { MetricGrid } from './home/MetricGrid.jsx';
import { RecentOrdersTable } from './home/RecentOrdersTable.jsx';
import { StatusDonut } from './home/StatusDonut.jsx';
import { TrendChart } from './home/TrendChart.jsx';
import { Card, PageHeader, StatusNote } from './ui.jsx';

function HomeSkeleton() {
  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={`order-skel-${index}`} className="h-[132px] animate-pulse bg-[#F7F4EE]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={`user-skel-${index}`} className="h-[132px] animate-pulse bg-[#F7F4EE]" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="h-[340px] animate-pulse bg-[#F7F4EE] lg:col-span-3" />
        <Card className="h-[340px] animate-pulse bg-[#F7F4EE] lg:col-span-2" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data, isLoading, isError, error } = useDashboardOverview();

  return (
    <section className="grid gap-6">
      <PageHeader
        eyebrow="Overview"
        title="Home"
        description="Customer activity and sales for the last 30 days."
      />

      {isLoading && <HomeSkeleton />}
      {isError && <StatusNote tone="danger">{getApiErrorMessage(error)}</StatusNote>}

      {data && (
        <>
          <MetricGrid metrics={data.metrics} />

          <div className="grid gap-5 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <TrendChart trends={data.trends} />
            </div>
            <div className="lg:col-span-2">
              <StatusDonut slices={data.statusDistribution} />
            </div>
          </div>

          <RecentOrdersTable orders={data.recentOrders} />
        </>
      )}
    </section>
  );
}
