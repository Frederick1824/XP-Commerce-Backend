import { AppError } from '../shared/errors/app-error.js';
import type { ProductosRepository } from '../productos/productos.repository.js';
import type { CarritoRepository } from './carrito.repository.js';
import type {
  AgregarItemDto,
  AgregarItemResult,
  Carrito,
  ItemCarrito
} from './carrito.types.js';

export class CarritoService {
  constructor(
    private readonly carritoRepository: CarritoRepository,
    private readonly productosRepository: ProductosRepository
  ) {}

  obtenerCarrito(clienteId: number): Carrito {
    const existente = this.carritoRepository.buscarPorCliente(clienteId);
    return existente ?? this.carritoRepository.crear(clienteId);
  }

  agregarItem(clienteId: number, dto: AgregarItemDto): AgregarItemResult {
    this.validarCantidad(dto.cantidad);

    const producto = this.productosRepository.buscarPorId(dto.productoId);
    if (!producto) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', 'El producto no existe');
    }

    const carrito = this.obtenerCarrito(clienteId);
    const itemExistente = carrito.items.find(
      (i) => i.productoId === dto.productoId
    );
    const cantidadActual = itemExistente?.cantidad ?? 0;
    const cantidadFinal = cantidadActual + dto.cantidad;

    if (cantidadFinal > producto.stock) {
      throw new AppError(
        422,
        'INSUFFICIENT_STOCK',
        `Stock insuficiente. Disponible: ${producto.stock}`
      );
    }

    let itemCreado = false;

    if (itemExistente) {
      itemExistente.cantidad = cantidadFinal;
      itemExistente.subtotal =
        itemExistente.cantidad * itemExistente.precioUnitario;
    } else {
      const nuevoItem: ItemCarrito = {
        productoId: producto.id,
        nombre: producto.nombre,
        precioUnitario: producto.precio,
        cantidad: dto.cantidad,
        subtotal: producto.precio * dto.cantidad
      };
      carrito.items.push(nuevoItem);
      itemCreado = true;
    }

    this.recalcularTotal(carrito);
    this.carritoRepository.guardar(carrito);

    return { carrito, itemCreado };
  }

  modificarCantidad(
    clienteId: number,
    productoId: number,
    cantidad: number
  ): Carrito {
    this.validarCantidad(cantidad);
    
    const carrito = this.carritoRepository.buscarPorCliente(clienteId);
    if (!carrito) {
      throw new AppError(404, 'CART_NOT_FOUND', 'El carrito no existe');
    }
  
    const item = carrito.items.find((i) => i.productoId === productoId);
    if (!item) {
      throw new AppError(
        404,
        'ITEM_NOT_FOUND',
        'El producto no esta en el carrito'
      );
    }
  
    const producto = this.productosRepository.buscarPorId(productoId);
    if (!producto) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', 'El producto no existe');
    }
  
    if (cantidad > producto.stock) {
      throw new AppError(
        422,
        'INSUFFICIENT_STOCK',
        `Stock insuficiente. Disponible: ${producto.stock}`
      );
    }
  
    item.cantidad = cantidad;
    item.subtotal = item.cantidad * item.precioUnitario;
    this.recalcularTotal(carrito);
  
    return this.carritoRepository.guardar(carrito);
  }

  eliminarItem(clienteId: number, productoId: number): void {
    const carrito = this.carritoRepository.buscarPorCliente(clienteId);
    if (!carrito) {
      throw new AppError(404, 'CART_NOT_FOUND', 'El carrito no existe');
    }
  
    const index = carrito.items.findIndex((i) => i.productoId === productoId);
    if (index === -1) {
      throw new AppError(
        404,
        'ITEM_NOT_FOUND',
        'El producto no esta en el carrito'
      );
    }
  
    carrito.items.splice(index, 1);
    this.recalcularTotal(carrito);
    this.carritoRepository.guardar(carrito);
  }

  private validarCantidad(cantidad: number): void {
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new AppError(
        422,
        'INVALID_QUANTITY',
        'La cantidad debe ser un entero positivo'
      );
    }
  }

  private recalcularTotal(carrito: Carrito): void {
    carrito.total = carrito.items.reduce((acc, i) => acc + i.subtotal, 0);
  }
}