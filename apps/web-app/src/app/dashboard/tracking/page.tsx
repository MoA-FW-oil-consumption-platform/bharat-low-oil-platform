'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useConsumptionLogs, useCreateLog } from '@/hooks/api/useTracking';
import { Calendar, Clock, Droplets, Plus, Trash2 } from 'lucide-react';

export default function TrackingPage() {
  const { user } = useAuthStore();
  const userId = user?.userId || '';

  const [showLogForm, setShowLogForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mealType: 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    oilAmount: '',
    notes: '',
  });

  // Fetch logs
  const { data: logs, isLoading } = useConsumptionLogs(userId, {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Create log mutation
  const createLog = useCreateLog();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createLog.mutateAsync({
        userId,
        date: formData.date,
        mealType: formData.mealType,
        oilAmount: parseFloat(formData.oilAmount),
        notes: formData.notes || undefined,
      });

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        mealType: 'breakfast',
        oilAmount: '',
        notes: '',
      });
      setShowLogForm(false);
    } catch (error) {
      console.error('Failed to log consumption:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Oil Tracking</h1>
              <p className="mt-1 text-sm text-gray-500">
                Log and monitor your daily oil consumption
              </p>
            </div>
            <button
              onClick={() => setShowLogForm(!showLogForm)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Log Oil</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Log Form */}
        {showLogForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Log Oil Consumption</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meal Type
                  </label>
                  <select
                    value={formData.mealType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mealType: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Oil Amount (ml)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1000"
                  value={formData.oilAmount}
                  onChange={(e) => setFormData({ ...formData, oilAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 15"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Add any notes about your meal..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={createLog.isPending}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {createLog.isPending ? 'Logging...' : 'Log Consumption'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Logs List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Consumption History</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">Loading logs...</div>
            ) : !logs || logs.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No logs yet. Start tracking your oil consumption!
              </div>
            ) : (
              logs.map((log: any) => (
                <div
                  key={log._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Droplets className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {log.mealType}
                          </span>
                          <span className="text-2xl font-bold text-gray-900">
                            {log.oilAmount}ml
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(log.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        {log.notes && (
                          <p className="mt-1 text-sm text-gray-600">{log.notes}</p>
                        )}
                      </div>
                    </div>
                    <button
                      className="text-red-600 hover:text-red-700"
                      title="Delete log"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
