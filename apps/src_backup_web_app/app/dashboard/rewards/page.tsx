'use client';

import { useAuthStore } from '@/store/authStore';
import { useRewards, useBadges, useLeaderboard } from '@/hooks/api/useRewards';
import { Award, Trophy, TrendingUp, Users } from 'lucide-react';

export default function RewardsPage() {
  const { user } = useAuthStore();
  const userId = user?.userId || '';

  const { data: rewards, isLoading: rewardsLoading } = useRewards(userId);
  const { data: badges, isLoading: badgesLoading } = useBadges(userId);
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard({
    scope: 'national',
    limit: 10,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Rewards & Achievements</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your progress and compete with others
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Points Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="h-8 w-8" />
              <span className="text-sm font-medium">Total Points</span>
            </div>
            <p className="text-4xl font-bold">
              {rewardsLoading ? '...' : rewards?.points?.toLocaleString() || '0'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-8 w-8" />
              <span className="text-sm font-medium">Level</span>
            </div>
            <p className="text-4xl font-bold">
              {rewardsLoading ? '...' : rewards?.level || '1'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <p className="text-4xl font-bold">
              {rewardsLoading ? '...' : `${rewards?.streak || 0} days`}
            </p>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Badges</h2>
          {badgesLoading ? (
            <p className="text-gray-500">Loading badges...</p>
          ) : !badges || badges.length === 0 ? (
            <p className="text-gray-500">No badges earned yet. Keep tracking to unlock badges!</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {badges.map((badge: any) => (
                <div
                  key={badge.id}
                  className={`text-center p-4 rounded-lg border-2 ${
                    badge.unlocked
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50 opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="text-xs font-medium text-gray-900">{badge.name}</p>
                  {badge.unlocked && (
                    <p className="text-xs text-green-600 mt-1">✓ Unlocked</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">National Leaderboard</h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>

          {leaderboardLoading ? (
            <p className="text-gray-500">Loading leaderboard...</p>
          ) : !leaderboard || leaderboard.length === 0 ? (
            <p className="text-gray-500">No leaderboard data available.</p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry: any, index: number) => (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    entry.userId === userId
                      ? 'bg-green-50 border-2 border-green-500'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0
                          ? 'bg-yellow-400 text-yellow-900'
                          : index === 1
                          ? 'bg-gray-300 text-gray-700'
                          : index === 2
                          ? 'bg-orange-300 text-orange-900'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {entry.name}
                        {entry.userId === userId && (
                          <span className="ml-2 text-xs text-green-600">(You)</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">Level {entry.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {entry.points.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
