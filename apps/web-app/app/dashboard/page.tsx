'use client';

import { TrendingDown, Droplet, Award, Target } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Consumption"
          value="42ml"
          subtitle="Below ICMR limit"
          icon={<Droplet className="h-6 w-6" />}
          variant="success"
        />
        <StatCard
          title="Monthly Average"
          value="890ml"
          subtitle="10% below target"
          icon={<TrendingDown className="h-6 w-6" />}
          variant="success"
        />
        <StatCard
          title="Total Points"
          value="1,250"
          subtitle="Level 5"
          icon={<Award className="h-6 w-6" />}
          variant="default"
        />
        <StatCard
          title="Current Streak"
          value="7 days"
          subtitle="Keep going!"
          icon={<Target className="h-6 w-6" />}
          variant="warning"
        />
      </div>

      {/* Health Status */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Status</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Daily Progress</span>
              <span className="text-sm font-semibold text-green-600">42ml / 33ml</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '127%' }}></div>
            </div>
            <p className="text-xs text-yellow-600 mt-2">Slightly above ICMR recommendation</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <QuickAction title="Log Consumption" description="Track today's oil usage" />
        <QuickAction title="View Recipes" description="Browse low-oil meals" />
        <QuickAction title="Check Rewards" description="See your achievements" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem
            action="Logged 15ml of Sunflower Oil"
            time="2 hours ago"
            type="log"
          />
          <ActivityItem
            action="Earned 'Week Warrior' Badge"
            time="Yesterday"
            type="badge"
          />
          <ActivityItem
            action="Joined 'February Challenge' Campaign"
            time="2 days ago"
            type="campaign"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  variant: 'success' | 'warning' | 'default';
}) {
  const borderColors = {
    success: 'border-green-500',
    warning: 'border-yellow-500',
    default: 'border-blue-500',
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${borderColors[variant]}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm text-gray-600">{title}</span>
        <span className="text-gray-400">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{subtitle}</div>
    </div>
  );
}

function QuickAction({ title, description }: { title: string; description: string }) {
  return (
    <button className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}

function ActivityItem({ action, time, type }: { action: string; time: string; type: string }) {
  return (
    <div className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-green-500"></div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{action}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}
