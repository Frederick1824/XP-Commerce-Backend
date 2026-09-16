import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';

let estadoRespuesta = 0;
let cuerpoRespuesta: unknown = null;

Given('que existe un usuario registrado con id {int}', function () {
  // El modulo de usuarios no se modela en este alcance.
  // El paso expresa el contexto del negocio.
});

Given(
  'existe un producto con id {int}, nombre {string}, precio {int} y stock {int}',
  function () {
    // El producto se cargara cuando exista el repositorio en memoria.
  }
);

Given(
  'el usuario {int} ya tiene el producto {int} con cantidad {int} en su carrito',
  function () {
    // El carrito se preparara cuando exista el servicio de carrito.
  }
);

Given(
  'el usuario {int} elimino el producto {int} de su carrito',
  function () {
    // Paso auxiliar para preparar el estado del carrito antes del When.
    // Se implementara cuando exista el servicio de carrito.
  }
);

When(
  'el usuario {int} elimina el producto {int} de su carrito',
  async function () {
    throw new Error('FASE RED: HU5 no tiene implementacion de produccion');
  }
);

Then(
  'la respuesta debe tener codigo {int}',
  function (statusEsperado: number) {
    assert.equal(estadoRespuesta, statusEsperado);
  }
);

Then(
  'el carrito del usuario {int} no debe contener el producto {int}',
  function () {
    assert.ok(cuerpoRespuesta && typeof cuerpoRespuesta === 'object');
  }
);

Then(
  'el carrito del usuario {int} debe estar vacio',
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