"use client"

import Link from 'next/link';
import { Book, Tv, Film } from 'lucide-react';

export default function LibraryPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Library</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/library/books">
          <div className="group relative w-full rounded-3xl p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900 border-[0.5px] border-zinc-200 dark:border-zinc-800 shadow-lg dark:shadow-zinc-950/30 hover:border-primary transition-colors">
            <Book className="h-12 w-12 text-zinc-400 dark:text-zinc-600 mb-4" />
            <h2 className="text-2xl font-bold">Books</h2>
            <p className="text-muted-foreground">Your collection of books.</p>
          </div>
        </Link>
        
        {/* Placeholder for future media types */}
        <div className="group relative w-full rounded-3xl p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900 border-[0.5px] border-zinc-200 dark:border-zinc-800 shadow-lg dark:shadow-zinc-950/30 cursor-not-allowed opacity-50">
          <Film className="h-12 w-12 text-zinc-400 dark:text-zinc-600 mb-4" />
          <h2 className="text-2xl font-bold">Movies</h2>
          <p className="text-muted-foreground">Coming soon.</p>
        </div>

        <div className="group relative w-full rounded-3xl p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900 border-[0.5px] border-zinc-200 dark:border-zinc-800 shadow-lg dark:shadow-zinc-950/30 cursor-not-allowed opacity-50">
          <Tv className="h-12 w-12 text-zinc-400 dark:text-zinc-600 mb-4" />
          <h2 className="text-2xl font-bold">TV Shows</h2>
          <p className="text-muted-foreground">Coming soon.</p>
        </div>
      </div>
    </div>
  );
}
