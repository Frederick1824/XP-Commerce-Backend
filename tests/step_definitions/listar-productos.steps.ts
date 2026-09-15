import { Given, When, Then } from "@cucumber/cucumber";
import assert from "node:assert/strict";

let estadoRespuesta = 0;
let cuerpoRespuesta: unknown = null;

Given("que existen productos disponibles en el catálogo", function () {
  // El catálogo se preparará cuando exista el repositorio en memoria.
});

When("consulto el catálogo de productos", async function () {
  throw new Error("FASE RED: HU1 todavía no tiene implementación de producción");
});

When("consulto el catálogo con page igual a 0", async function () {
  throw new Error("FASE RED: falta implementar la validación de paginación de HU1");
});

Then("la respuesta debe tener estado {int}", function (estadoEsperado: number) {
  assert.equal(estadoRespuesta, estadoEsperado);
});

Then("debe devolver una lista de productos con id, nombre, precio y stock", function () {
  assert.ok(Array.isArray(cuerpoRespuesta));
});

Then("debe devolver el código de error {string}", function (codigoEsperado: string) {
  assert.ok(cuerpoRespuesta && typeof cuerpoRespuesta === "object");
  const respuesta = cuerpoRespuesta as { error?: { code?: string } };
  assert.equal(respuesta.error?.code, codigoEsperado);
});
