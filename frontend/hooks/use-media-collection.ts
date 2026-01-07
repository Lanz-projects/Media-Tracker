"use client";

import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/api";

interface MediaItem {
  id: string;
}

export function useMediaCollection<T extends MediaItem, U, V>(
  endpoint: string,
  transformBackendItem: (item: V) => T
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [metadataKeys, setMetadataKeys] = useState<string[]>([]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const backendItems = await api.getAll<V>(endpoint);
      const frontendItems = backendItems.map(transformBackendItem);
      setItems(frontendItems);
    } catch (err: any) {
      setError(err.message || `Failed to fetch ${endpoint}`);
      console.error(`Failed to fetch ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, transformBackendItem]);

  const fetchMetadataKeys = useCallback(async () => {
    try {
      const keys = await api.getMetadataKeys(endpoint);
      setMetadataKeys(keys);
    } catch (err: any) {
      console.error(`Failed to fetch metadata keys for ${endpoint}:`, err);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchItems();
    fetchMetadataKeys();
  }, [fetchItems, fetchMetadataKeys]);

  const addItem = useCallback(
    async (itemRequest: U) => {
      setError(null);
      setIsSubmitting(true);
      try {
        await api.createItem(endpoint, itemRequest);
        await fetchItems(); // Refetch to get the new item with its ID
        await fetchMetadataKeys(); // Refetch keys in case new ones were added
      } catch (err: any) {
        setError(err.message || `Failed to add item to ${endpoint}`);
        console.error(`Failed to add item to ${endpoint}:`, err);
        throw err; // Re-throw to be caught by the caller
      } finally {
        setIsSubmitting(false);
      }
    },
    [endpoint, fetchItems, fetchMetadataKeys]
  );

  const updateItem = useCallback(
    async (item: T, itemRequest: U) => {
      setError(null);
      setIsSubmitting(true);
      try {
        await api.updateItem(endpoint, item.id, itemRequest);
        await fetchItems(); // Refetch to get updated list
        await fetchMetadataKeys(); // Refetch keys
      } catch (err: any) {
        setError(err.message || `Failed to update item in ${endpoint}`);
        console.error(`Failed to update item in ${endpoint}:`, err);
        throw err; // Re-throw to be caught by the caller
      } finally {
        setIsSubmitting(false);
      }
    },
    [endpoint, fetchItems, fetchMetadataKeys]
  );

  const deleteItemById = useCallback(
    async (itemId: string) => {
      setError(null);
      setIsSubmitting(true);
      try {
        await api.deleteItem(endpoint, itemId);
        await fetchItems(); // Refetch to update the list
        await fetchMetadataKeys();
      } catch (err: any) {
        setError(err.message || `Failed to delete item from ${endpoint}`);
        console.error(`Failed to delete item from ${endpoint}:`, err);
        throw err; // Re-throw to be caught by the caller
      } finally {
        setIsSubmitting(false);
      }
    },
    [endpoint, fetchItems, fetchMetadataKeys]
  );
  
  const addMetadataKey = useCallback((newKey: string) => {
    if (newKey && !metadataKeys.includes(newKey)) {
      setMetadataKeys((prevKeys) => [...prevKeys, newKey].sort());
    }
  }, [metadataKeys]);

  return {
    items,
    loading,
    isSubmitting,
    error,
    metadataKeys,
    addItem,
    updateItem,
    deleteItemById,
    addMetadataKey,
  };
}
