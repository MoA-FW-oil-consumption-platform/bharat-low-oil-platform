'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Award,
  FileText,
  Settings,
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Menu', href: '/dashboard/menu', icon: UtensilsCrossed },
  { name: 'Certification', href: '/dashboard/certification', icon: Award },
  { name: 'Certificate', href: '/dashboard/certificate', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">🍽️</span>
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-gray-900">Restaurant</h1>
            <p className="text-xs text-gray-500">Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <item.icon
                className={clsx(
                  'w-5 h-5 mr-3',
                  isActive ? 'text-green-600' : 'text-gray-500'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <Award className="w-8 h-8 text-green-600" />
            <div className="text-right">
              <p className="text-xs text-gray-600">Status</p>
              <p className="text-sm font-semibold text-green-700">Certified</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Valid until: Dec 31, 2025
          </p>
        </div>
      </div>
    </div>
  );
}
