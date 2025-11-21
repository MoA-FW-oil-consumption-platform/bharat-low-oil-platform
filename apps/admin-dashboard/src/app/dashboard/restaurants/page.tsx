import { RestaurantTable } from '@/components/restaurants/RestaurantTable';
import { RestaurantFilters } from '@/components/restaurants/RestaurantFilters';
import { CertificationStats } from '@/components/restaurants/CertificationStats';

export default function RestaurantsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Restaurant Certifications
        </h1>
        <p className="text-gray-600 mt-1">
          Review and approve low-oil certification requests
        </p>
      </div>

      <CertificationStats />
      <RestaurantFilters />
      <RestaurantTable />
    </div>
  );
}
