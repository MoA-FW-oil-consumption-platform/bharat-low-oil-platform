'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { state: 'Kerala', consumption: 580, change: -8.2 },
  { state: 'Punjab', consumption: 520, change: -6.5 },
  { state: 'Tamil Nadu', consumption: 485, change: -12.3 },
  { state: 'Karnataka', consumption: 450, change: -15.1 },
  { state: 'Maharashtra', consumption: 420, change: -18.7 },
  { state: 'Gujarat', consumption: 395, change: -21.4 },
  { state: 'Rajasthan', consumption: 380, change: -24.8 },
  { state: 'West Bengal', consumption: 365, change: -27.2 },
];

export function TopRegions() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Top States by Consumption
        </h2>
        <p className="text-sm text-gray-600">
          States with highest per capita consumption (ml/month)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" />
          <YAxis type="category" dataKey="state" stroke="#6b7280" width={100} />
          <Tooltip />
          <Bar dataKey="consumption" fill="#10b981" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-xs text-gray-500 text-center">
        ICMR Recommended: 333ml per person per month
      </div>
    </div>
  );
}
