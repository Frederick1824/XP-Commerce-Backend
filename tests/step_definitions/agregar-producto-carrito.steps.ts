import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';

let estadoRespuesta = 0;
let cuerpoRespuesta: unknown = null;

Given('que existe un usuario registrado con id {int}', function () {
});

Given(
  'existe un producto con id {int}, nombre {string}, precio {int} y stock {int}',
  function () {
  }
);

Given(
  'el usuario {int} ya tiene el producto {int} con cantidad {int} en su carrito',
  function () {
  }
);

When(
  'el usuario {int} agrega el producto {int} con cantidad {int} a su carrito',
  async function () {
    throw new Error('FASE RED: HU3 no tiene implementacion de produccion');
  }
);

Then(
  'la respuesta debe tener codigo {int}',
  function (statusEsperado: number) {
    assert.equal(estadoRespuesta, statusEsperado);
  }
);

Then(
  'el carrito del usuario {int} debe contener el producto {int} con cantidad {int}',
  function () {
    assert.ok(cuerpoRespuesta && typeof cuerpoRespuesta === 'object');
  }
);

Then(
  'el total del carrito del usuario {int} debe ser {int}',
  function (totalEsperado: number) {
    assert.ok(cuerpoRespuesta && typeof cuerpoRespuesta === 'object');
    const respuesta = cuerpoRespuesta as { data?: { total?: number } };
    assert.equal(respuesta.data?.total, totalEsperado);
  }
);

Then(
  'el cuerpo del error debe tener el codigo {string}',
  function (codigoEsperado: string) {
    assert.ok(cuerpoRespuesta && typeof cuerpoRespuesta === 'object');
    const respuesta = cuerpoRespuesta as { error?: { code?: string } };
    assert.equal(respuesta.error?.code, codigoEsperado);
  }
);