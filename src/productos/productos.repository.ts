import type { Producto } from './productos.types.js';

const productosIniciales: Producto[] = [
  { id: 1, nombre: 'Yerba tradicional', precio: 4200, stock: 12 },
  { id: 2, nombre: 'Mate de acero', precio: 18500, stock: 7 },
  { id: 3, nombre: 'Bombilla premium', precio: 6900, stock: 15 }
];

export class ProductosRepository {
  constructor(private readonly productos: Producto[] = [...productosIniciales]) {}

  listar(): Producto[] {
    return [...this.productos];
  }

  buscarPorId(id: number): Producto | undefined {
    return this.productos.find((producto) => producto.id === id);
  }

  guardar(producto: Producto): Producto {
    const index = this.productos.findIndex((p) => p.id === producto.id);
    if (index >= 0) {
      this.productos[index] = producto;
    } else {
      this.productos.push(producto);
    }
    return producto;
  }
}