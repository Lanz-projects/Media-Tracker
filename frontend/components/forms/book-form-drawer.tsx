"use client"

import * as React from 'react'
import { Book, FrontendMetadata } from '@/lib/types'
import { useMediaQuery } from '@/hooks/use-media-query'
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
import { Plus } from 'lucide-react'

interface BookFormDrawerProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (book: Book) => void
  onDelete?: (bookId: string) => void;
  bookToEdit?: Book | null
  existingKeys: string[]
}

const emptyBook: Book = {
  id: '',
  title: '',
  metadata: [
    { id: 'new-1', key: 'Author', value: '' },
    { id: 'new-2', key: 'Status', value: 'To Read' },
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
}: BookFormDrawerProps) {
  const [book, setBook] = React.useState<Book>(bookToEdit || emptyBook)

  React.useEffect(() => {
    // Reset form state when drawer opens or book changes
    setBook(bookToEdit || emptyBook);
  }, [bookToEdit, isOpen]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBook({ ...book, title: e.target.value })
  }

  const handleMetadataUpdate = (index: number, updatedMetadata: FrontendMetadata) => {
    const newMetadata = [...book.metadata]
    newMetadata[index] = updatedMetadata
    setBook({ ...book, metadata: newMetadata })
  }

  const handleMetadataRemove = (index: number) => {
    const newMetadata = book.metadata.filter((_, i) => i !== index)
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
    onOpenChange(false)
  }
  
  const handleDelete = () => {
    if (onDelete && bookToEdit) {
      onDelete(bookToEdit.id);
      onOpenChange(false);
    }
  }

  const isDesktop = useMediaQuery('(min-width: 768px)')
  const drawerSide = isDesktop ? 'right' : 'bottom'

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={drawerSide}
        className="flex flex-col bg-zinc-50 dark:bg-zinc-950/95 backdrop-blur-xl border-zinc-200 dark:border-zinc-800"
      >
        <SheetHeader>
          <SheetTitle className="sr-only">
            {bookToEdit ? 'Edit Book' : 'Add New Book'}
          </SheetTitle>
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
            <div className="flex flex-col gap-3">
              {book.metadata.map((meta, index) => (
                <MetadataRow
                  key={meta.id}
                  metadata={meta}
                  existingKeys={existingKeys}
                  onUpdate={(updated) => handleMetadataUpdate(index, updated)}
                  onRemove={() => handleMetadataRemove(index)}
                />
              ))}
            </div>
          </div>

          <Button variant="outline" onClick={addMetadataRow} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        </div>

        <SheetFooter className="mt-auto pt-4 border-t-[0.5px] flex justify-between">
          <div>
            {bookToEdit && onDelete && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onOpenChange(false)} variant="ghost">
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Book</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
