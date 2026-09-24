export type ItemCarrito = {
  productoId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
};

export type Carrito = {
  id: number;
  clienteId: number;
  items: ItemCarrito[];
  total: number;
  fechaCreacion: string;
  fechaActualizacion: string;
};

export type AgregarItemDto = {
  productoId: number;
  cantidad: number;
};

export type AgregarItemResult = {
  carrito: Carrito;
  itemCreado: boolean;
};