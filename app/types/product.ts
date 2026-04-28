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

// export interface ProductDTO {
//   name: string;
//   description: string;
//   editingId: string;
// }