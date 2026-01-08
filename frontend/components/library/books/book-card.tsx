"use client"

import * as React from "react"
import { Book } from "@/lib/types"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface BookCardProps {
  book: Book
  isHighlighted?: boolean
  onClick: () => void
}

export function BookCard({ book, isHighlighted, onClick }: BookCardProps) {
  const displayedMetadata = book.metadata.slice(0, 4)
  const hiddenFieldsCount = book.metadata.length - displayedMetadata.length
  const hasHiddenFields = hiddenFieldsCount > 0

  const metadataItem = (meta: { id: string, key: string, value: string }) => (
    <div key={meta.id} className="text-sm">
      <span className="font-semibold mr-1.5">{meta.key}:</span>
      <span>{meta.value}</span>
    </div>
  )

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4 }}
      className={cn(
        "relative w-full rounded-3xl p-6 transition-shadow duration-300 cursor-pointer",
        "bg-zinc-50 dark:bg-zinc-900",
        "shadow-lg dark:shadow-zinc-950/30",
        isHighlighted
          ? "ring-2 ring-primary/50 border-primary"
          : "border-[0.5px] border-zinc-200 dark:border-zinc-800"
      )}
    >
      <div className="flex flex-col">
        <h3 className="font-serif text-3xl font-semibold text-foreground mb-4">
          {book.title}
        </h3>

        <div className="flex flex-col items-start gap-2">
          {displayedMetadata.map(metadataItem)}
          {hasHiddenFields && (
            <div className="text-sm text-muted-foreground mt-1">
              +{hiddenFieldsCount} more fields
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
