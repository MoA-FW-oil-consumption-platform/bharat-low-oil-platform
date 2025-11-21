'use client';

import { Clock } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'user_joined',
    message: '245 new users registered',
    time: '5 minutes ago',
    icon: '👤',
  },
  {
    id: 2,
    type: 'certification',
    message: 'Green Leaf Restaurant received certification',
    time: '12 minutes ago',
    icon: '🏆',
  },
  {
    id: 3,
    type: 'campaign',
    message: 'Low Oil Week campaign started in Maharashtra',
    time: '1 hour ago',
    icon: '📢',
  },
  {
    id: 4,
    type: 'achievement',
    message: '10,000 users reached their monthly goal',
    time: '2 hours ago',
    icon: '🎯',
  },
  {
    id: 5,
    type: 'milestone',
    message: 'National consumption reduced by 15% YoY',
    time: '3 hours ago',
    icon: '📊',
  },
];

export function RecentActivities() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Activities
        </h2>
        <p className="text-sm text-gray-600">
          Latest updates from across the platform
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span>{activity.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-green-600 hover:text-green-700 font-medium">
        View all activities
      </button>
    </div>
  );
}
