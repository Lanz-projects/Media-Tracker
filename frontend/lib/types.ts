export interface FrontendMetadata {
  id: string;
  key: string;
  value: string;
}

export type BackendMetadata = Record<string, any>;

export interface Book {
  id: string;
  title: string;
  metadata: FrontendMetadata[];
  createdAt: string; // This is a frontend specific field for now
}

export interface BackendBookResponse {
  id: string;
  title: string;
  metadata: BackendMetadata;
}

export interface BookRequest {
  title: string;
  metadata: BackendMetadata;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Current page number (0-indexed)
  first: boolean;
  last: boolean;
  numberOfElements: number;
}
