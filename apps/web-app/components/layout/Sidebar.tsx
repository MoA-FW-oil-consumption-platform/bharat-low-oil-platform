"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuthStore } from "@/store/useAuthStore"
import { 
  LayoutDashboard, 
  Camera, 
  UtensilsCrossed, 
  Award, 
  Users, 
  School, 
  LogOut,
  Menu,
  X
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuthStore()
  const [isOpen, setIsOpen] = React.useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Track Consumption",
      icon: Camera,
      href: "/track",
      color: "text-violet-500",
    },
    {
      label: "Dining & Retail",
      icon: UtensilsCrossed,
      href: "/dining",
      color: "text-pink-700",
    },
    {
      label: "Rewards",
      icon: Award,
      href: "/rewards",
      color: "text-orange-700",
    },
    {
      label: "Community",
      icon: Users,
      href: "/community",
      color: "text-emerald-500",
    },
    {
      label: "School Monitor",
      icon: School,
      href: "/school-monitor",
      color: "text-green-700",
    },
  ]

  return (
    <>
      {/* Mobile Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "space-y-4 py-4 flex flex-col h-full bg-secondary/30 border-r fixed md:relative z-40 transition-transform duration-300 ease-in-out w-64 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="px-3 py-2 flex-1">
          <Link href="/dashboard" className="flex items-center pl-3 mb-14">
            <div className="relative w-8 h-8 mr-4">
              {/* Logo placeholder */}
              <div className="absolute inset-0 bg-primary rounded-full opacity-20 animate-pulse" />
              <div className="absolute inset-2 bg-primary rounded-full" />
            </div>
            <h1 className="text-2xl font-bold">
              Bharat<span className="text-primary">LowOil</span>
            </h1>
          </Link>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                  pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-4 px-3">
            <span className="text-sm font-medium">Theme</span>
            <ModeToggle />
          </div>
          <Button 
            variant="destructive" 
            className="w-full justify-start" 
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
