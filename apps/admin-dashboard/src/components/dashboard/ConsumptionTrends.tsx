'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', consumption: 450, target: 400 },
  { month: 'Feb', consumption: 430, target: 390 },
  { month: 'Mar', consumption: 410, target: 380 },
  { month: 'Apr', consumption: 395, target: 370 },
  { month: 'May', consumption: 375, target: 360 },
  { month: 'Jun', consumption: 360, target: 350 },
  { month: 'Jul', consumption: 345, target: 340 },
  { month: 'Aug', consumption: 335, target: 330 },
  { month: 'Sep', consumption: 320, target: 320 },
  { month: 'Oct', consumption: 310, target: 310 },
  { month: 'Nov', consumption: 300, target: 300 },
];

export function ConsumptionTrends() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          National Consumption Trends
        </h2>
        <p className="text-sm text-gray-600">
          Average oil consumption per capita (ml/month)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="consumption"
            stroke="#10b981"
            strokeWidth={2}
            name="Actual"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Target"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
