'use client';

export function NationalHeatmap() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Consumption Heatmap
        </h2>
        <p className="text-sm text-gray-600">
          State-wise oil consumption across India
        </p>
      </div>

      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">
            Interactive map with Leaflet/React-Leaflet
          </p>
          <p className="text-sm text-gray-400">
            Will display state boundaries with color-coded consumption levels
          </p>
          <p className="text-xs text-gray-400 mt-2">
            (Requires GeoJSON data and proper map initialization)
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Low (&lt;350ml)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-200 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Moderate (350-450ml)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-200 rounded mr-2"></div>
          <span className="text-sm text-gray-600">High (450-550ml)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Very High (&gt;550ml)</span>
        </div>
      </div>
    </div>
  );
}
