export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
};

export type ListarProductosQuery = {
  page?: number;
  limit?: number;
};