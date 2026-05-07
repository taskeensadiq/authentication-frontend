export interface Product {
  id: string;
  description: string;
  name: string;
  createdAt: string;
  isArchived: boolean;
  updatedAt: string;
  archivedAt: string;
  justRestored?: boolean;
}
