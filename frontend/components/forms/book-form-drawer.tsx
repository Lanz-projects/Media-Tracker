"use client"

import * as React from 'react'
import { Book, FrontendMetadata } from '@/lib/types'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { MetadataRow } from './metadata-row'
import { Plus, Loader2, ChevronsLeftRight } from 'lucide-react'
import { Reorder } from 'framer-motion'

interface BookFormDrawerProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (book: Book) => void
  onDelete?: (book: Book) => void
  bookToEdit?: Book | null
  existingKeys: string[]
  addMetadataKey: (newKey: string) => void;
  isSubmitting?: boolean;
}

const emptyBook: Book = {
  id: '',
  title: '',
  metadata: [
  ],
  createdAt: '',
};

export function BookFormDrawer({
  isOpen,
  onOpenChange,
  onSave,
  onDelete,
  bookToEdit,
  existingKeys,
  addMetadataKey,
  isSubmitting,
}: BookFormDrawerProps) {
  const [book, setBook] = React.useState<Book>(bookToEdit || emptyBook)
  const [isWide, setIsWide] = React.useState(false); // State for wide mode

  React.useEffect(() => {
    // Reset form state when drawer opens or book changes
    setBook(bookToEdit || emptyBook);
    if (!bookToEdit) {
      setIsWide(false); // Reset width for new books
    }
  }, [bookToEdit, isOpen]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBook({ ...book, title: e.target.value })
  }

  const handleMetadataUpdate = (id: string, updatedMetadata: FrontendMetadata) => {
    const index = book.metadata.findIndex(meta => meta.id === id)
    if (index === -1) return

    const newMetadata = [...book.metadata]
    newMetadata[index] = updatedMetadata

    // Optimistically update the keys in the UI
    if (updatedMetadata.key && !existingKeys.includes(updatedMetadata.key)) {
      addMetadataKey(updatedMetadata.key);
    }
    setBook({ ...book, metadata: newMetadata })
  }

  const handleMetadataRemove = (id: string) => {
    const newMetadata = book.metadata.filter((meta) => meta.id !== id)
    setBook({ ...book, metadata: newMetadata })
  }

  const addMetadataRow = () => {
    const newMetadata: FrontendMetadata = {
      id: `new-${Date.now()}`,
      key: '',
      value: '',
    }
    setBook({ ...book, metadata: [...book.metadata, newMetadata] })
  }

  const handleSave = () => {
    onSave(book)
    // The parent now controls when the drawer is closed
  }
  
  const handleDelete = () => {
    if (onDelete && bookToEdit) {
      onDelete(bookToEdit);
    }
  }

  const isDesktop = useMediaQuery('(min-width: 768px)')
  const drawerSide = isDesktop ? 'right' : 'bottom'

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={drawerSide}
        className={cn(
          "flex flex-col bg-zinc-50 dark:bg-zinc-950/95 backdrop-blur-xl border-zinc-200 dark:border-zinc-800",
          "md:transition-[width,max-width] md:duration-300 md:ease-in-out", // Smooth transition
          isWide ? "md:w-1/2 md:max-w-4xl" : "md:max-w-xl"
        )}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSave();
          }
        }}
      >
        <SheetHeader>
          <SheetTitle className="sr-only">
            {bookToEdit ? 'Edit Book' : 'Add New Book'}
          </SheetTitle>
          {isDesktop && (
            <div className="absolute top-3 right-14 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsWide(!isWide)}
                className="text-muted-foreground h-8 w-8"
                aria-label={isWide ? "Make form smaller" : "Make form wider"}
              >
                <ChevronsLeftRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </SheetHeader>

        <div className="flex-grow overflow-y-auto p-1 -mx-1">
          <Input
            placeholder="Book Title"
            value={book.title}
            onChange={handleTitleChange}
            className="font-serif text-4xl h-auto bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 !rounded-none !border-b-[0.5px] focus-visible:!border-primary pb-2"
          />

          <div className="my-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Metadata
            </h4>
            <Reorder.Group
              axis="y"
              values={book.metadata}
              onReorder={(newOrder) => setBook({ ...book, metadata: newOrder })}
              className="flex flex-col gap-3"
            >
              {book.metadata.map((meta) => (
                <Reorder.Item key={meta.id} value={meta}>
                  <MetadataRow
                    metadata={meta}
                    existingKeys={existingKeys}
                    onUpdate={(updated) => handleMetadataUpdate(meta.id, updated)}
                    onRemove={() => handleMetadataRemove(meta.id)}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

          <Button variant="outline" onClick={addMetadataRow} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        </div>

        <SheetFooter className="mt-auto pt-4 border-t-[0.5px] flex justify-end gap-2">
          <Button onClick={() => onOpenChange(false)} variant="ghost" disabled={isSubmitting}>
            Cancel
          </Button>
          {bookToEdit && onDelete && (
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              Delete
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Book'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

