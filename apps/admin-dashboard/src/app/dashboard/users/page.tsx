import { UserTable } from '@/components/users/UserTable';
import { UserFilters } from '@/components/users/UserFilters';
import { UserStats } from '@/components/users/UserStats';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">
          Manage and monitor user registrations and activity
        </p>
      </div>

      <UserStats />
      <UserFilters />
      <UserTable />
    </div>
  );
}
