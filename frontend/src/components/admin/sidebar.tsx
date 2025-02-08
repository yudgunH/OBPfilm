"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Film, MessageSquare, BarChart, Users, ChevronLeft, ChevronRight } from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Film, label: "Manage Movies", href: "/admin/movies" },
  { icon: MessageSquare, label: "Comments", href: "/admin/comments" },
  { icon: BarChart, label: "Advertisements", href: "/admin/ads" },
  { icon: Users, label: "User Accounts", href: "/admin/users" },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn("bg-background border-r transition-all duration-300 ease-in-out", collapsed ? "w-16" : "w-64")}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4">
          {!collapsed && (
            <Link href="/admin" className="text-2xl font-bold text-primary">
              Admin
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="py-4 space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

