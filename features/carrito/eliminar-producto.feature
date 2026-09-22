Feature: Eliminar producto del carrito
  Como cliente
  Quiero eliminar un producto de mi carrito
  Para quitar lo que ya no deseo comprar

  Background:
    Given que existe un cliente con id 1
    And existe un producto con id 10, nombre "Teclado Mecanico", precio 50000 y stock 5
    And existe un producto con id 11, nombre "Mouse Gamer", precio 30000 y stock 3
    And el cliente 1 ya tiene el producto 10 con cantidad 2 en su carrito
    And el cliente 1 ya tiene el producto 11 con cantidad 1 en su carrito

  Scenario: Eliminar un producto existente del carrito
    When el cliente 1 elimina el producto 10 de su carrito
    Then la respuesta debe tener codigo 204
    And el carrito del cliente 1 no debe contener el producto 10
    And el carrito del cliente 1 debe contener el producto 11 con cantidad 1

  Scenario: Eliminar el ultimo producto deja el carrito vacio
    Given el cliente 1 elimino el producto 10 de su carrito
    When el cliente 1 elimina el producto 11 de su carrito
    Then la respuesta debe tener codigo 204
    And el carrito del cliente 1 debe estar vacio
    And el total del carrito del cliente 1 debe ser 0

  Scenario: No se puede eliminar un producto que no esta en el carrito
    When el cliente 1 elimina el producto 999 de su carrito
    Then la respuesta debe tener codigo 404
    And el cuerpo del error debe tener el codigo "ITEM_NOT_FOUND"