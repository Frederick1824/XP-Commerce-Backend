Feature: Modificar cantidad de un producto del carrito
  Como cliente
  Quiero modificar la cantidad de un producto en mi carrito
  Para ajustar mi pedido antes de confirmarlo

  Background:
    Given que existe un cliente con id 1
    And existe un producto con id 10, nombre "Teclado Mecanico", precio 50000 y stock 5
    And el cliente 1 ya tiene el producto 10 con cantidad 2 en su carrito

  Scenario: Modificar la cantidad a un valor valido
    When el cliente 1 modifica la cantidad del producto 10 a 4
    Then la respuesta debe tener codigo 200
    And el carrito del cliente 1 debe contener el producto 10 con cantidad 4
    And el total del carrito del cliente 1 debe ser 200000

  Scenario: No se puede modificar a una cantidad mayor que el stock
    When el cliente 1 modifica la cantidad del producto 10 a 10
    Then la respuesta debe tener codigo 422
    And el cuerpo del error debe tener el codigo "INSUFFICIENT_STOCK"

  Scenario: No se puede modificar a una cantidad cero o negativa
    When el cliente 1 modifica la cantidad del producto 10 a 0
    Then la respuesta debe tener codigo 422
    And el cuerpo del error debe tener el codigo "INVALID_QUANTITY"

  Scenario: No se puede modificar un producto que no esta en el carrito
    When el cliente 1 modifica la cantidad del producto 999 a 2
    Then la respuesta debe tener codigo 404
    And el cuerpo del error debe tener el codigo "ITEM_NOT_FOUND"