"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Book,
  FrontendMetadata,
  BackendBookResponse,
  BookRequest,
  BackendMetadata,
} from "@/lib/types";

// Helper to convert backend metadata (Map) to frontend metadata (Array)
const convertBackendMetadataToFrontend = (
  backendMetadata: BackendMetadata
): FrontendMetadata[] => {
  return Object.entries(backendMetadata).map(([key, value], index) => ({
    id: `${key}-${index}`, // Simple unique ID for frontend
    key,
    value: String(value), // Ensure value is string for frontend display
  }));
};

// Helper to convert frontend metadata (Array) to backend metadata (Map)
const convertFrontendMetadataToBackend = (
  frontendMetadata: FrontendMetadata[]
): BackendMetadata => {
  return frontendMetadata.reduce((acc, meta) => {
    acc[meta.key] = meta.value;
    return acc;
  }, {} as BackendMetadata);
};

export const useBooks = (searchQuery: string = "") => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [metadataKeys, setMetadataKeys] = useState<string[]>([]);

  // Removed initialBooks mock data
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("FETCHING");
      const response = await fetch(`/api/books`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const backendBooks: BackendBookResponse[] = await response.json();
      const frontendBooks: Book[] = backendBooks.map((b) => ({
        id: b.id,
        title: b.title,
        metadata: convertBackendMetadataToFrontend(b.metadata),
        createdAt: new Date().toISOString(), // Placeholder, backend does not return createdAt
      }));
      setBooks(frontendBooks);
    } catch (err: any) {
      setError(err.message || "Failed to fetch books");
      console.error("Failed to fetch books:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMetadataKeys = useCallback(async () => {
    try {
      const response = await fetch("/api/books/metadata-keys");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const keys: string[] = await response.json();
      setMetadataKeys(keys);
    } catch (err: any) {
      console.error("Failed to fetch metadata keys:", err);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
    fetchMetadataKeys();
  }, [fetchBooks, fetchMetadataKeys]);

  const addBook = useCallback(
    async (book: Omit<Book, "id" | "createdAt">) => {
      setError(null);
      console.log("ADDING BOOK");
      try {
        const backendMetadata = convertFrontendMetadataToBackend(book.metadata);
        const bookRequest: BookRequest = {
          title: book.title,
          metadata: backendMetadata,
        };

        console.log(bookRequest);
        const response = await fetch("/api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookRequest),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Re-fetch all books to get the newly added book with its ID and updated list
        fetchBooks();
        fetchMetadataKeys(); // Also re-fetch keys in case new ones were added
      } catch (err: any) {
        setError(err.message || "Failed to add book");
        console.error("Failed to add book:", err);
      }
    },
    [fetchBooks, fetchMetadataKeys]
  );

  const updateBook = useCallback(async (updatedBook: Book) => {
    // This functionality is not yet implemented in the backend.
    // For now, it will only update the local state.
    // In a real scenario, this would involve a PUT request to /api/books/{id}
    setBooks((prevBooks) =>
      prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
    console.warn(
      "Update Book functionality is not fully implemented for backend persistence."
    );
  }, []);

  const deleteBook = useCallback(
    async (bookId: string) => {
      setError(null);
      try {
        const response = await fetch(`/api/books/${bookId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Re-fetch all books to update the list
        fetchBooks();
        fetchMetadataKeys(); // Re-fetch keys in case some were removed (less likely but good practice)
      } catch (err: any) {
        setError(err.message || "Failed to delete book");
        console.error("Failed to delete book:", err);
      }
    },
    [fetchBooks, fetchMetadataKeys]
  );

  const filteredBooks = useMemo(() => {
    if (!searchQuery) {
      return books;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowercasedQuery) ||
        book.metadata.some((meta) =>
          meta.value.toLowerCase().includes(lowercasedQuery)
        )
    );
  }, [books, searchQuery]);

  return {
    books: filteredBooks,
    allBooks: books, // Keeping allBooks for consistency, though filteredBooks might be sufficient
    addBook,
    updateBook,
    deleteBook,
    metadataKeys,
    loading,
    error,
  };
};
