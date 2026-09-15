Feature: Listar catálogo de productos
  Como visitante de la tienda
  Quiero ver el listado de productos disponibles
  Para explorar qué puedo comprar antes de decidir

  Scenario: Listado exitoso de productos
    Given que existen productos disponibles en el catálogo
    When consulto el catálogo de productos
    Then la respuesta debe tener estado 200
    And debe devolver una lista de productos con id, nombre, precio y stock

  Scenario: Parámetro de paginación inválido
    Given que existen productos disponibles en el catálogo
    When consulto el catálogo con page igual a 0
    Then la respuesta debe tener estado 400
    And debe devolver el código de error "INVALID_PARAM"
