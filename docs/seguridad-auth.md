# Seguridad, autenticacion y autorizacion

Implementacion basada en los ejercicios 1, 2 y 3 de la Unidad 4.

## Ejercicio 1

- Registro con password hasheada con bcrypt.
- Login con access token y refresh token.
- Renovacion del access token mediante refresh token.

## Ejercicio 2

- Middleware requireAuth.
- Middleware requireRole.
- Proteccion por propiedad del recurso para evitar IDOR.

## Ejercicio 3

- CORS con origenes configurables.
- Rate limiting en login.
- Sanitizacion basica contra claves sospechosas en payloads.

## Rutas

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- GET /api/auth/profile
- GET /api/auth/admin/users
- GET/POST/PATCH/DELETE /api/v1/secure/carrito/:clienteId

La ruta original /api/v1/carrito se conserva para no romper las historias BDD existentes.

## Evidencia con cURL

### Registro

```bash
curl -i -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"nombre":"Fede","email":"fede@example.com","password":"Clave123!"}'
```

Esperado: 201.

### Login

```bash
curl -i -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"fede@example.com","password":"Clave123!"}'
```

Esperado: 200 con accessToken y refreshToken.

### Perfil protegido

```bash
curl -i http://localhost:3000/api/auth/profile -H "Authorization: Bearer ACCESS_TOKEN"
```

Sin token: 401. Token invalido o expirado: 403.

### Refresh

```bash
curl -i -X POST http://localhost:3000/api/auth/refresh -H "Content-Type: application/json" -d '{"refreshToken":"REFRESH_TOKEN"}'
```

Esperado: 200 con nuevo access token.

### RBAC

```bash
curl -i http://localhost:3000/api/auth/admin/users -H "Authorization: Bearer ACCESS_TOKEN"
```

USER: 403. El ADMIN demo se habilita con DEMO_ADMIN_EMAIL y DEMO_ADMIN_PASSWORD en .env.

### IDOR

Un USER con id 1 intenta acceder a:

```bash
curl -i http://localhost:3000/api/v1/secure/carrito/2 -H "Authorization: Bearer ACCESS_TOKEN"
```

Esperado: 403 RESOURCE_FORBIDDEN.

### Rate limiting

Luego de mas de cinco intentos de login dentro de 15 minutos, el servidor responde 429.

### Sanitizacion

Payloads con claves que comienzan con $ o contienen . son rechazados con 400 INVALID_INPUT.
