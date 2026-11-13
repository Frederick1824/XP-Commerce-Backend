import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import request from 'supertest';
import type { CustomWorld } from '../support/world.js';

type Respuesta = {
  status: number;
  body: unknown;
};

let respuesta: Respuesta = {
  status: 0,
  body: null
};

Given('que existen productos disponibles en el catálogo', function () {});

When(
  'consulto el catálogo de productos',
  async function (this: CustomWorld) {
    const res = await request(this.app).get('/api/v1/productos');
    respuesta = { status: res.status, body: res.body };
  }
);

When(
  'consulto el catálogo con page igual a {int}',
  async function (this: CustomWorld, page: number) {
    const res = await request(this.app).get(`/api/v1/productos?page=${page}`);
    respuesta = { status: res.status, body: res.body };
  }
);

Then('la respuesta debe tener estado {int}', function (estadoEsperado: number) {
  assert.equal(respuesta.status, estadoEsperado);
});

Then(
  'debe devolver una lista de productos con id, nombre, precio y stock',
  function () {
    const body = respuesta.body as { data?: unknown[] };
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length > 0);

    const producto = body.data[0] as Record<string, unknown>;
    assert.ok('id' in producto);
    assert.ok('nombre' in producto);
    assert.ok('precio' in producto);
    assert.ok('stock' in producto);
  }
);

Then('debe devolver el código de error {string}', function (codigoEsperado: string) {
  const body = respuesta.body as { error?: { code?: string } };
  assert.equal(body.error?.code, codigoEsperado);
});
