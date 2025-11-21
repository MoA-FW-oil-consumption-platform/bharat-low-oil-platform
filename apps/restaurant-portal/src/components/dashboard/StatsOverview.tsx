'use client';

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-sm text-gray-600">Total Dishes</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">45</p>
        <p className="text-sm text-green-600 mt-1">+3 this week</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-sm text-gray-600">Low-Oil Dishes</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">32</p>
        <p className="text-sm text-gray-500 mt-1">71% of menu</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-sm text-gray-600">Customer Views</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">1.2K</p>
        <p className="text-sm text-green-600 mt-1">+18% this month</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-sm text-gray-600">Certificate Status</p>
        <p className="text-xl font-bold text-green-700 mt-2">Active</p>
        <p className="text-sm text-gray-500 mt-1">Valid until Dec 2025</p>
      </div>
    </div>
  );
}
