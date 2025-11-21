'use client';

import { Bell, User } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Green Leaf Restaurant
        </h2>
        <p className="text-sm text-gray-500">Mumbai, Maharashtra</p>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">Owner Name</p>
            <p className="text-xs text-gray-500">Restaurant Owner</p>
          </div>
        </button>
      </div>
    </header>
  );
}
