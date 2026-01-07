"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Library, BookHeart } from 'lucide-react'
import { cn } from '@/lib/utils'

import { ThemeToggle } from './theme-toggle'

const navItems = [
  { href: '/', label: 'Overview', icon: Home },
  { href: '/library', label: 'Library', icon: Library },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col justify-between w-60 p-4 border-r-[0.5px] border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div>
        <div className="flex items-center gap-2 mb-8">
          <BookHeart className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold">Media Tracker</h1>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive && "bg-primary/10 text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
