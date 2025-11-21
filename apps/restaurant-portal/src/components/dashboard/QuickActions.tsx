'use client';

import Link from 'next/link';
import { Plus, FileCheck, UtensilsCrossed, Award } from 'lucide-react';

const actions = [
  {
    name: 'Add New Dish',
    icon: Plus,
    href: '/dashboard/menu?action=add',
    color: 'bg-blue-500',
  },
  {
    name: 'Apply for Certification',
    icon: FileCheck,
    href: '/dashboard/certification',
    color: 'bg-green-500',
  },
  {
    name: 'View Menu',
    icon: UtensilsCrossed,
    href: '/dashboard/menu',
    color: 'bg-purple-500',
  },
  {
    name: 'View Certificate',
    icon: Award,
    href: '/dashboard/certificate',
    color: 'bg-orange-500',
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link
          key={action.name}
          href={action.href}
          className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className={`${action.color} p-3 rounded-lg mr-4`}>
            <action.icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-900">
            {action.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
