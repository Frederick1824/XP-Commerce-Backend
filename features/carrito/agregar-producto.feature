Feature: Agregar producto al carrito
  Como cliente registrado
  Quiero agregar un producto a mi carrito
  Para comprarlo más tarde

  Background:
    Given que existe un usuario registrado con id 1
    And existe un producto con id 10, nombre "Teclado Mecanico", precio 50000 y stock 5

  Scenario: Agregar un producto disponible al carrito vacio
    When el usuario 1 agrega el producto 10 con cantidad 1 a su carrito
    Then la respuesta debe tener codigo 201
    And el carrito del usuario 1 debe contener el producto 10 con cantidad 1
    And el total del carrito del usuario 1 debe ser 50000

  Scenario: Agregar el mismo producto dos veces incrementa la cantidad
    Given el usuario 1 ya tiene el producto 10 con cantidad 1 en su carrito
    When el usuario 1 agrega el producto 10 con cantidad 2 a su carrito
    Then la respuesta debe tener codigo 200
    And el carrito del usuario 1 debe contener el producto 10 con cantidad 3
    And el total del carrito del usuario 1 debe ser 150000

  Scenario: No se puede agregar un producto inexistente
    When el usuario 1 agrega el producto 999 con cantidad 1 a su carrito
    Then la respuesta debe tener codigo 404
    And el cuerpo del error debe tener el codigo "PRODUCT_NOT_FOUND"

  Scenario: No se puede agregar mas cantidad que el stock disponible
    When el usuario 1 agrega el producto 10 con cantidad 99 a su carrito
    Then la respuesta debe tener codigo 422
    And el cuerpo del error debe tener el codigo "INSUFFICIENT_STOCK"

  Scenario: No se puede agregar una cantidad invalida
    When el usuario 1 agrega el producto 10 con cantidad 0 a su carrito
    Then la respuesta debe tener codigo 422
    And el cuerpo del error debe tener el codigo "INVALID_QUANTITY"