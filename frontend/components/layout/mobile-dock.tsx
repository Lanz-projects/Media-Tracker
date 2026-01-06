"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Library, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import { ThemeToggle } from './theme-toggle'

const navItems = [
  { href: '/', label: 'Overview', icon: Home },
  { href: '/library', label: 'Library', icon: Library },
]

export function MobileDock() {
  const pathname = usePathname()

  return (
    <footer className="md:hidden fixed bottom-4 left-4 right-4 h-16 z-50">
      <div className="relative flex items-center justify-evenly h-full w-full rounded-2xl border-[0.5px] bg-zinc-50/40 dark:bg-zinc-900/40 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 shadow-lg">
        {navItems.map((item) => {
           const isActive = item.href === '/' ? pathname === item.href : pathname.startsWith(item.href)
           return(
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 w-16 text-muted-foreground transition-all hover:text-primary",
                isActive && "text-primary"
                )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
           )
        })}
        <div className="flex flex-col items-center gap-1 w-16">
          <ThemeToggle />
          <span className="text-xs text-muted-foreground">Theme</span>
        </div>
      </div>
    </footer>
  )
}
