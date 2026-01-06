"use client"

import * as React from 'react';
import Link from 'next/link';
import { useBooks } from '@/hooks/use-books';
import { BookOpen, Film, Tv, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const MediaCard = React.forwardRef<
  HTMLDivElement,
  { 
    className?: string; 
    children: React.ReactNode;
    icon: React.ReactNode;
    title: string;
  }
>(({ className, children, icon, title }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={cn(
      "relative w-full rounded-3xl p-6 md:p-8",
      "bg-zinc-50 dark:bg-zinc-900",
      "border-[0.5px] border-zinc-200 dark:border-zinc-800",
      "shadow-lg dark:shadow-zinc-950/30",
      "flex flex-col",
      className
    )}
  >
    <div className="flex items-center gap-4 mb-4">
      {icon}
      <h2 className="text-lg font-semibold text-muted-foreground">{title}</h2>
    </div>
    <div className="flex-grow flex items-center">
      {children}
    </div>
  </motion.div>
));
MediaCard.displayName = "MediaCard";

export default function DashboardPage() {
  const { allBooks } = useBooks();

  const nowReadingBook = allBooks.find(
    (book) => book.metadata.some(meta => meta.key === 'Status' && meta.value === 'Now Reading')
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Books Card */}
        <MediaCard
          icon={<BookOpen className="h-6 w-6" />}
          title="Now Reading"
        >
          {nowReadingBook ? (
            <Link
              href={`/library/books?search=${encodeURIComponent(nowReadingBook.title)}`}
              className="group inline-flex items-center gap-2 font-serif text-3xl font-bold hover:text-primary transition-colors"
            >
              {nowReadingBook.title}
              <ArrowRight className="h-7 w-7 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <p className="font-serif text-2xl text-zinc-400 dark:text-zinc-600">
              No book selected to read.
            </p>
          )}
        </MediaCard>

        {/* Movies Card Placeholder */}
        <MediaCard
          icon={<Film className="h-6 w-6" />}
          title="Currently Watching"
        >
          <p className="font-serif text-2xl text-zinc-400 dark:text-zinc-600">
            Movie tracking coming soon.
          </p>
        </MediaCard>

        {/* TV Shows Card Placeholder */}
        <MediaCard
          icon={<Tv className="h-6 w-6" />}
          title="Currently Watching"
        >
          <p className="font-serif text-2xl text-zinc-400 dark:text-zinc-600">
            TV show tracking coming soon.
          </p>
        </MediaCard>
      </div>
    </div>
  );
}