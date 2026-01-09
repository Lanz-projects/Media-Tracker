"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import * as api from "@/lib/api";
import {
  Book,
  FrontendMetadata,
  BackendBookResponse,
  BookRequest,
  BackendMetadata,
  PagedModel,
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

const transformBackendBook = (book: BackendBookResponse): Book => ({
  id: book.id,
  title: book.title,
  metadata: convertBackendMetadataToFrontend(book.metadata),
  createdAt: new Date().toISOString(), // Placeholder
});

export const useBooks = (searchQuery: string = "") => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<PagedModel<BackendBookResponse> | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [metadataKeys, setMetadataKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;

  const fetchBooks = useCallback(async (pageToFetch: number) => {
    setLoading(true);
    setError(null);
    try {
      const pageData = await api.getPageable<BackendBookResponse>(
        "books",
        pageToFetch,
        pageSize
      );
      setPage(pageData);
      // The actual list of items is nested inside the _embedded object.
      // The key can change (e.g., "bookResponseList"), so we robustly get the first array.
      const bookList = pageData._embedded
        ? Object.values(pageData._embedded)[0] || []
        : [];
      const frontendBooks = bookList.map(transformBackendBook);
      setBooks(frontendBooks);
    } catch (err: any) {
      setError(err.message || `Failed to fetch books`);
      console.error(`Failed to fetch books:`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMetadataKeys = useCallback(async () => {
    try {
      const keys = await api.getMetadataKeys("books");
      setMetadataKeys(keys);
    } catch (err: any) {
      console.error(`Failed to fetch metadata keys for books:`, err);
    }
  }, []);

  useEffect(() => {
    fetchBooks(currentPage);
    fetchMetadataKeys();
  }, [currentPage, fetchBooks, fetchMetadataKeys]);

  const addBook = async (book: Omit<Book, "id" | "createdAt">) => {
    const bookRequest: BookRequest = {
      title: book.title,
      metadata: convertFrontendMetadataToBackend(book.metadata),
    };
    setError(null);
    setIsSubmitting(true);
    try {
      await api.createItem("books", bookRequest);
      await fetchBooks(currentPage);
      await fetchMetadataKeys();
    } catch (err: any) {
      setError(err.message || `Failed to add book`);
      console.error(`Failed to add book:`, err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateBook = async (book: Book) => {
    const bookRequest: BookRequest = {
      title: book.title,
      metadata: convertFrontendMetadataToBackend(book.metadata),
    };
    setError(null);
    setIsSubmitting(true);
    try {
      await api.updateItem("books", book.id, bookRequest);
      await fetchBooks(currentPage);
      await fetchMetadataKeys();
    } catch (err: any) {
      setError(err.message || `Failed to update book`);
      console.error(`Failed to update book:`, err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBook = async (bookId: string) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await api.deleteItem("books", bookId);
      await fetchBooks(currentPage);
      await fetchMetadataKeys();
    } catch (err: any) {
      setError(err.message || `Failed to delete book`);
      console.error(`Failed to delete book:`, err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMetadataKey = useCallback((newKey: string) => {
    if (newKey && !metadataKeys.includes(newKey)) {
      setMetadataKeys((prevKeys) => [...prevKeys, newKey].sort());
    }
  }, [metadataKeys]);

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
    allBooks: books, // This is now just the current page of books
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
    totalPages: page?.page?.totalPages ?? 0,
  };
};