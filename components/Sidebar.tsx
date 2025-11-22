"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Operations", href: "/dashboard/operations" },
  { label: "Stock", href: "/dashboard/stock" },
  { label: "Move History", href: "/dashboard/move-history" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-black/10 p-6 flex flex-col min-h-screen bg-white">
      <h1 className="text-xl font-bold mb-10">Stockmaster</h1>

      <nav className="space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block px-3 py-2 rounded-lg text-sm font-medium transition
                ${isActive ? "bg-black text-white" : "text-black hover:bg-black/10"}
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
