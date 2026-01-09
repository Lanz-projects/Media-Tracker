// @/lib/api.ts

import { PagedModel } from "./types";

const API_BASE_URL = "/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getPageable<T>(
  endpoint: string,
  page: number,
  size: number
): Promise<PagedModel<T>> {
  const response = await fetch(
    `${API_BASE_URL}/${endpoint}/pages?page=${page}&size=${size}`
  );
  return handleResponse<PagedModel<T>>(response);
}

export async function getAll<T>(endpoint: string): Promise<T[]> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);
  return handleResponse<T[]>(response);
}

export async function getMetadataKeys(endpoint: string): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/metadata-keys`);
  return handleResponse<string[]>(response);
}

export async function createItem<T>(endpoint: string, data: T): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
}

export async function updateItem<T>(endpoint: string, id: string, data: T): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
}

export async function deleteItem(endpoint: string, id: string): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
}
