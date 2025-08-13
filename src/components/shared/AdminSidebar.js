"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/categories", label: "Categories", icon: "📁" },
    { href: "/admin/products", label: "Products", icon: "📦" },
    { href: "/admin/orders", label: "Orders", icon: "🛒" },
    { href: "/admin/users", label: "Users", icon: "👥" },
  ]

  return (
    <div
      className={`${isCollapsed ? "w-16" : "w-64"} transition-all duration-300 h-screen sticky top-0 flex flex-col`}
      style={{ backgroundColor: "#5A0117" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white border-opacity-20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Sugar, serif" }}>
              Kanvei Admin
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:opacity-80 transition-opacity"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  pathname === item.href ? "text-white opacity-100" : "text-white opacity-70 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: pathname === item.href ? "#8C6141" : "transparent",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white border-opacity-20">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-white opacity-70 hover:opacity-100 transition-opacity"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          <span className="text-lg">🏠</span>
          {!isCollapsed && <span>Back to Store</span>}
        </Link>
      </div>
    </div>
  )
}
