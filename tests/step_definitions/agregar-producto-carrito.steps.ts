import { Before, Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import request from 'supertest';
import type { Express } from 'express';
import {
  buildDependencies,
  createApp,
  type AppDependencies
} from '../../src/app.js';

let app: Express;
let deps: AppDependencies;
let lastResponse: request.Response;

Before(() => {
  deps = buildDependencies();
  app = createApp(deps);
});

// ---------- GIVEN ----------

Given('que existe un cliente con id {int}', function (_clienteId: number) {
  // El modulo de clientes no se modela en este alcance.
});

Given(
  'existe un producto con id {int}, nombre {string}, precio {int} y stock {int}',
  function (id: number, nombre: string, precio: number, stock: number) {
    deps.productosRepository.guardar({ id, nombre, precio, stock });
  }
);

Given(
  'el cliente {int} ya tiene el producto {int} con cantidad {int} en su carrito',
  function (clienteId: number, productoId: number, cantidad: number) {
    deps.carritoService.agregarItem(clienteId, { productoId, cantidad });
  }
);

// ---------- WHEN ----------

When(
  'el cliente {int} agrega el producto {int} con cantidad {int} a su carrito',
  async function (clienteId: number, productoId: number, cantidad: number) {
    lastResponse = await request(app)
      .post(`/api/v1/carrito/${clienteId}/items`)
      .send({ productoId, cantidad });
  }
);

// ---------- THEN ----------

Then('la respuesta debe tener codigo {int}', function (status: number) {
  assert.equal(
    lastResponse.status,
    status,
    `Body recibido: ${JSON.stringify(lastResponse.body)}`
  );
});

Then(
  'el carrito del cliente {int} debe contener el producto {int} con cantidad {int}',
  async function (clienteId: number, productoId: number, cantidad: number) {
    const response = await request(app).get(`/api/v1/carrito/${clienteId}`);
    const item = response.body.data.items.find(
      (i: { productoId: number }) => i.productoId === productoId
    );
    assert.ok(item, `El producto ${productoId} no esta en el carrito`);
    assert.equal(item.cantidad, cantidad);
  }
);

Then(
  'el total del carrito del cliente {int} debe ser {int}',
  async function (clienteId: number, total: number) {
    const response = await request(app).get(`/api/v1/carrito/${clienteId}`);
    assert.equal(response.body.data.total, total);
  }
);

Then(
  'el cuerpo del error debe tener el codigo {string}',
  function (code: string) {
    assert.equal(
      lastResponse.body?.error?.code,
      code,
      `Body recibido: ${JSON.stringify(lastResponse.body)}`
    );
  }
);