import { Metadata } from 'next';
import Link from 'next/link';
import { Home, BarChart3, Utensils, Award, MapPin, Target, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard - Bharat Low Oil Platform',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-green-600">
              Bharat Low Oil
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, User</span>
              <Link href="/profile">
                <User className="h-6 w-6 text-gray-600 hover:text-green-600" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4 space-y-2">
            <NavLink href="/dashboard" icon={<Home />} label="Dashboard" />
            <NavLink href="/dashboard/tracking" icon={<BarChart3 />} label="Tracking" />
            <NavLink href="/dashboard/recipes" icon={<Utensils />} label="Recipes" />
            <NavLink href="/dashboard/rewards" icon={<Award />} label="Rewards" />
            <NavLink href="/dashboard/restaurants" icon={<MapPin />} label="Restaurants" />
            <NavLink href="/dashboard/campaigns" icon={<Target />} label="Campaigns" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
    >
      <span className="h-5 w-5">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
