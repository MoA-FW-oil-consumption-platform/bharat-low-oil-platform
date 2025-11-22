'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useConsumptionStats } from '@/hooks/api/useTracking';
import { useRewards } from '@/hooks/api/useRewards';
import { Activity, Award, Droplets, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.userId || '';

  // Fetch real data from APIs
  const { data: stats, isLoading: statsLoading } = useConsumptionStats(userId);
  const { data: rewards, isLoading: rewardsLoading } = useRewards(userId);

  if (!isAuthenticated) {
    return null; // Protected route will handle redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track your oil consumption and earn rewards
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/tracking"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Log Oil
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Consumption */}
          <StatCard
            title="Today's Consumption"
            value={statsLoading ? '...' : `${stats?.todayConsumption || 0}ml`}
            icon={<Droplets className="h-6 w-6 text-blue-600" />}
            trend={stats?.todayConsumption ? (stats.todayConsumption > stats.dailyLimit ? 'up' : 'down') : null}
            loading={statsLoading}
          />

          {/* Monthly Average */}
          <StatCard
            title="Monthly Average"
            value={statsLoading ? '...' : `${stats?.monthlyAverage || 0}ml`}
            icon={<TrendingDown className="h-6 w-6 text-green-600" />}
            subtitle={`Goal: ${stats?.dailyLimit || 30}ml/day`}
            loading={statsLoading}
          />

          {/* Total Points */}
          <StatCard
            title="Total Points"
            value={rewardsLoading ? '...' : rewards?.points?.toLocaleString() || '0'}
            icon={<Award className="h-6 w-6 text-yellow-600" />}
            subtitle={`Level ${rewards?.level || 1}`}
            loading={rewardsLoading}
          />

          {/* Current Streak */}
          <StatCard
            title="Current Streak"
            value={statsLoading ? '...' : `${stats?.streak || 0} days`}
            icon={<Activity className="h-6 w-6 text-purple-600" />}
            subtitle="Keep it going!"
            loading={statsLoading}
          />
        </div>

        {/* Progress Bar */}
        {!statsLoading && stats && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Daily Progress</h3>
              <span className="text-sm text-gray-600">
                {stats.todayConsumption}ml / {stats.dailyLimit}ml
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  stats.todayConsumption > stats.dailyLimit ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.min((stats.todayConsumption / stats.dailyLimit) * 100, 100)}%`,
                }}
              />
            </div>
            {stats.todayConsumption > stats.dailyLimit && (
              <p className="mt-2 text-sm text-red-600">
                ⚠️ You've exceeded your daily limit! Try to reduce oil consumption.
              </p>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <QuickActionCard
            title="Track Oil"
            description="Log your daily oil consumption"
            href="/dashboard/tracking"
            icon="📊"
          />
          <QuickActionCard
            title="Browse Recipes"
            description="Discover low-oil recipes"
            href="/dashboard/recipes"
            icon="🍽️"
          />
          <QuickActionCard
            title="View Rewards"
            description="Check your badges and points"
            href="/dashboard/rewards"
            icon="🏆"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {statsLoading ? (
              <p className="text-gray-500">Loading activity...</p>
            ) : (
              <>
                <ActivityItem
                  title="Oil logged for breakfast"
                  time="2 hours ago"
                  icon="🥣"
                />
                <ActivityItem
                  title="Completed healthy cooking module"
                  time="Yesterday"
                  icon="🎓"
                />
                <ActivityItem
                  title="New badge unlocked: Week Warrior"
                  time="2 days ago"
                  icon="🏅"
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// StatCard Component
function StatCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  loading,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: 'up' | 'down' | null;
  loading?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon}
      </div>
      <div className="flex items-baseline space-x-2">
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span
                className={`text-sm font-medium ${
                  trend === 'up' ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {trend === 'up' ? '↑' : '↓'}
              </span>
            )}
          </>
        )}
      </div>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

// QuickActionCard Component
function QuickActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}

// ActivityItem Component
function ActivityItem({
  title,
  time,
  icon,
}: {
  title: string;
  time: string;
  icon: string;
}) {
  return (
    <div className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-0">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}
