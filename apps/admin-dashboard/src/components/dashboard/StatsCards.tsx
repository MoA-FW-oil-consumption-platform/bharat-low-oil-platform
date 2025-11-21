'use client';

import { Users, Activity, TrendingDown, Award } from 'lucide-react';

const stats = [
  {
    name: 'Total Users',
    value: '2.4M',
    change: '+12.5%',
    changeType: 'positive',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    name: 'Active Today',
    value: '87.3K',
    change: '+5.2%',
    changeType: 'positive',
    icon: Activity,
    color: 'bg-green-500',
  },
  {
    name: 'Avg. Reduction',
    value: '18.7%',
    change: '+3.1%',
    changeType: 'positive',
    icon: TrendingDown,
    color: 'bg-purple-500',
  },
  {
    name: 'Certifications',
    value: '1,245',
    change: '+45',
    changeType: 'positive',
    icon: Award,
    color: 'bg-orange-500',
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
              <p
                className={`text-sm mt-2 ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {stat.change} from last month
              </p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
