"use client"

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { Book } from '@/lib/types'
import { useBooks } from '@/hooks/use-books'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BookCard } from '@/components/library/books/book-card'
import { BookFormDrawer } from '@/components/forms/book-form-drawer'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { Plus, Search } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

function LibraryPage() {
  const searchParams = useSearchParams()
  const highlightedTitle = searchParams.get('search')
  const { toast } = useToast()
  
  const [searchQuery, setSearchQuery] = React.useState('')
  const { 
    books, 
    addBook, 
    updateBook, 
    deleteBook, 
    metadataKeys, 
    addMetadataKey, 
    loading, 
    isSubmitting, 
    error,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useBooks(searchQuery)

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [bookToEdit, setBookToEdit] = React.useState<Book | null>(null)
  
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false)
  const [itemToDelete, setItemToDelete] = React.useState<Book | null>(null)

  const handleAddNew = () => {
    setBookToEdit(null)
    setIsDrawerOpen(true)
  }

  const handleEdit = (book: Book) => {
    setBookToEdit(book)
    setIsDrawerOpen(true)
  }

  const handleDeleteRequest = (book: Book) => {
    setItemToDelete(book)
    setIsConfirmDialogOpen(true)
    setIsDrawerOpen(false) 
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteBook(itemToDelete.id)
        toast({
          title: "Book Deleted",
          description: `"${itemToDelete.title}" has been permanently deleted.`,
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error Deleting Book",
          description: "There was a problem deleting the book. Please try again.",
        })
      } finally {
        setItemToDelete(null)
        setIsConfirmDialogOpen(false)
      }
    }
  }

  const handleSave = async (book: Book) => {
    try {
      if (bookToEdit) {
        await updateBook(book)
        toast({
          title: "Book Updated",
          description: `"${book.title}" has been successfully updated.`,
        })
      } else {
        await addBook(book)
        toast({
          title: "Book Added",
          description: `"${book.title}" has been successfully added to your library.`,
        })
      }
      setIsDrawerOpen(false); 
    } catch (error) {
      console.error("Error with saving...")
    }
  }
  
  const [pageInput, setPageInput] = React.useState((currentPage + 1).toString());

  React.useEffect(() => {
    setPageInput((currentPage + 1).toString());
  }, [currentPage]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const pageNum = parseInt(pageInput, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        setCurrentPage(pageNum - 1);
      } else {
        setPageInput((currentPage + 1).toString());
      }
    }
  };
  
  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Library</h1>
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search library..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Book
          </Button>
        </div>
      </div>

      {loading && (
        <div className="col-span-full text-center py-16">
          <h3 className="text-xl font-semibold">Loading books...</h3>
        </div>
      )}

      {error && !isSubmitting && ( 
        <div className="col-span-full text-center py-16 text-red-500">
          <h3 className="text-xl font-semibold">Error: {error}</h3>
          <p className="text-muted-foreground mt-2">
            Failed to load books. Please try again.
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isHighlighted={highlightedTitle ? book.title === highlightedTitle : false}
                onClick={() => handleEdit(book)}
              />
            ))}
          </div>
          
          {books.length === 0 && (
            <div className="col-span-full text-center py-16">
                <h3 className="text-xl font-semibold">No books found</h3>
                <p className="text-muted-foreground mt-2">
                    {searchQuery ? `Try adjusting your search.` : `Click "Add Book" to get started.`}
                </p>
            </div>
          )}
        </>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 space-x-2">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            variant="outline"
            className="w-24"
          >
            Previous
          </Button>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={pageInput}
              onChange={handlePageInputChange}
              onKeyDown={handlePageInputKeyDown}
              className="w-12 text-center"
              min="1"
              max={totalPages}
            />
            <span className="text-sm text-muted-foreground">of {totalPages}</span>
          </div>
          <Button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            variant="outline"
            className="w-24"
          >
            Next
          </Button>
        </div>
      )}

      <BookFormDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onSave={handleSave}
        onDelete={handleDeleteRequest}
        bookToEdit={bookToEdit}
        existingKeys={metadataKeys}
        addMetadataKey={addMetadataKey}
        isSubmitting={isSubmitting}
      />

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={confirmDelete}
        title="Are you sure?"
        description={`This will permanently delete "${itemToDelete?.title}". This action cannot be undone.`}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default function LibraryPageWrapper() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LibraryPage />
    </React.Suspense>
  )
}
