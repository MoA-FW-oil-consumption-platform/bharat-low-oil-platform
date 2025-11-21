export function UserStats() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <p className="text-sm text-gray-600">Total Users</p>
        <p className="text-2xl font-bold">2.4M</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <p className="text-sm text-gray-600">Active Today</p>
        <p className="text-2xl font-bold">87.3K</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <p className="text-sm text-gray-600">New This Week</p>
        <p className="text-2xl font-bold">12.5K</p>
      </div>
    </div>
  );
}
