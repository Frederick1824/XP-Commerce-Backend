import type { Carrito } from './carrito.types.js';

export class CarritoRepository {
  private readonly carritos: Carrito[] = [];
  private nextId = 1;

  buscarPorCliente(clienteId: number): Carrito | undefined {
    return this.carritos.find((c) => c.clienteId === clienteId);
  }

  crear(clienteId: number): Carrito {
    const ahora = new Date().toISOString();
    const carrito: Carrito = {
      id: this.nextId++,
      clienteId,
      items: [],
      total: 0,
      fechaCreacion: ahora,
      fechaActualizacion: ahora
    };
    this.carritos.push(carrito);
    return carrito;
  }

  guardar(carrito: Carrito): Carrito {
    carrito.fechaActualizacion = new Date().toISOString();
    return carrito;
  }
}