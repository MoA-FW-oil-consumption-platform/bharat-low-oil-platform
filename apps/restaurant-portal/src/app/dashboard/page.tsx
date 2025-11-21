import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { CertificationStatus } from '@/components/dashboard/CertificationStatus';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Restaurant Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your low-oil certified menu and certification
        </p>
      </div>

      <QuickActions />
      <StatsOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CertificationStatus />
        <RecentOrders />
      </div>
    </div>
  );
}
