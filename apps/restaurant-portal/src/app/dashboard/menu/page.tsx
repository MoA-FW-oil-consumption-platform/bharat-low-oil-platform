import { MenuList } from '@/components/menu/MenuList';
import { AddDishButton } from '@/components/menu/AddDishButton';
import { MenuStats } from '@/components/menu/MenuStats';

export default function MenuPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-1">
            Add and manage your low-oil dishes
          </p>
        </div>
        <AddDishButton />
      </div>

      <MenuStats />
      <MenuList />
    </div>
  );
}
