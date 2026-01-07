"use client";

import { useMemo } from "react";
import { useMediaCollection } from "./use-media-collection";
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

const transformBackendBook = (book: BackendBookResponse): Book => ({
  id: book.id,
  title: book.title,
  metadata: convertBackendMetadataToFrontend(book.metadata),
  createdAt: new Date().toISOString(), // Placeholder
});

export const useBooks = (searchQuery: string = "") => {
  const {
    items: books,
    loading,
    isSubmitting,
    error,
    metadataKeys,
    addItem,
    updateItem,
    deleteItemById,
    addMetadataKey,
  } = useMediaCollection<Book, BookRequest, BackendBookResponse>(
    "books",
    transformBackendBook
  );

  const addBook = async (book: Omit<Book, "id" | "createdAt">) => {
    const bookRequest: BookRequest = {
      title: book.title,
      metadata: convertFrontendMetadataToBackend(book.metadata),
    };
    await addItem(bookRequest);
  };

  const updateBook = async (book: Book) => {
    const bookRequest: BookRequest = {
      title: book.title,
      metadata: convertFrontendMetadataToBackend(book.metadata),
    };
    await updateItem(book, bookRequest);
  };
  
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
    allBooks: books,
    addBook,
    updateBook,
    deleteBook: deleteItemById,
    metadataKeys,
    addMetadataKey,
    loading,
    isSubmitting,
    error,
  };
};