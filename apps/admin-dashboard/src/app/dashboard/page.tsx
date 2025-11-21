import { StatsCards } from '@/components/dashboard/StatsCards';
import { ConsumptionTrends } from '@/components/dashboard/ConsumptionTrends';
import { NationalHeatmap } from '@/components/dashboard/NationalHeatmap';
import { TopRegions } from '@/components/dashboard/TopRegions';
import { RecentActivities } from '@/components/dashboard/RecentActivities';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          National Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Real-time monitoring of edible oil consumption across India
        </p>
      </div>

      {/* Stats Overview */}
      <StatsCards />

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConsumptionTrends />
        <TopRegions />
      </div>

      {/* Heatmap */}
      <NationalHeatmap />

      {/* Recent Activities */}
      <RecentActivities />
    </div>
  );
}
