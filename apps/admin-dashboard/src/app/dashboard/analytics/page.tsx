import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { ConsumptionByRegion } from '@/components/analytics/ConsumptionByRegion';
import { DemographicBreakdown } from '@/components/analytics/DemographicBreakdown';
import { TimeSeriesAnalysis } from '@/components/analytics/TimeSeriesAnalysis';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Advanced Analytics
        </h1>
        <p className="text-gray-600 mt-1">
          Deep dive into consumption patterns and trends
        </p>
      </div>

      <AnalyticsOverview />
      <TimeSeriesAnalysis />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConsumptionByRegion />
        <DemographicBreakdown />
      </div>
    </div>
  );
}
