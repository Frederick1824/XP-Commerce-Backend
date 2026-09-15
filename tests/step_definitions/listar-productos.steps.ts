import { Given, When, Then } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../../src/app.js";

type Respuesta = {
  status: number;
  body: unknown;
};

let respuesta: Respuesta = { status: 0, body: null };

Given("que existen productos disponibles en el catálogo", function () {
  // El repositorio en memoria ya incluye productos de prueba.
});

When("consulto el catálogo de productos", async function () {
  const res = await request(app).get("/api/v1/productos");
  respuesta = { status: res.status, body: res.body };
});

When("consulto el catálogo con page igual a {int}", async function (page: number) {
  const res = await request(app).get(`/api/v1/productos?page=${page}`);
  respuesta = { status: res.status, body: res.body };
});

Then("la respuesta debe tener estado {int}", function (estadoEsperado: number) {
  assert.equal(respuesta.status, estadoEsperado);
});

Then("debe devolver una lista de productos con id, nombre, precio y stock", function () {
  const cuerpo = respuesta.body as { data?: unknown[] };
  assert.ok(Array.isArray(cuerpo.data));
  assert.ok(cuerpo.data.length > 0);

  const producto = cuerpo.data[0] as Record<string, unknown>;
  assert.ok("id" in producto);
  assert.ok("nombre" in producto);
  assert.ok("precio" in producto);
  assert.ok("stock" in producto);
});

Then("debe devolver el código de error {string}", function (codigoEsperado: string) {
  const cuerpo = respuesta.body as { error?: { code?: string } };
  assert.equal(cuerpo.error?.code, codigoEsperado);
});
