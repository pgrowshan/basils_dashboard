import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import { useDashboardOverview } from '../hooks/dashboard/useDashboardOverview.js';
import { MetricGrid } from './home/MetricGrid.jsx';
import { RecentOrdersTable } from './home/RecentOrdersTable.jsx';
import { StatusDonut } from './home/StatusDonut.jsx';
import { TrendChart } from './home/TrendChart.jsx';
import { Card, StatusNote } from './ui.jsx';

function HomeSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="h-[148px] animate-pulse bg-[#F7F4EE] sm:col-span-2" />
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={`skel-${index}`} className="h-[148px] animate-pulse bg-[#F7F4EE]" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="h-[360px] animate-pulse bg-[#F7F4EE] lg:col-span-3" />
        <Card className="h-[360px] animate-pulse bg-[#F7F4EE] lg:col-span-2" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data, isLoading, isError, error } = useDashboardOverview();

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-gelica text-[30px] leading-tight text-[#1A2744] sm:text-[34px]">Overview</h2>
          <p className="mt-1.5 max-w-xl font-['Circe'] text-sm leading-relaxed text-[#6B7A90]">
            Paid revenue, order volume, and customer activity at a glance.
          </p>
        </div>
        {data?.periodLabel && (
          <span className="inline-flex w-fit items-center rounded-full border border-[#E7E2D6] bg-white px-3 py-1.5 font-['Circe'] text-[12px] font-medium text-[#5C6B82]">
            {data.periodLabel}
          </span>
        )}
      </div>

      {isLoading && <HomeSkeleton />}
      {isError && <StatusNote tone="danger">{getApiErrorMessage(error)}</StatusNote>}

      {data && (
        <>
          <MetricGrid metrics={data.metrics} />

          <div className="grid gap-4 lg:grid-cols-5">
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
