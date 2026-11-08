# Esta es la primera revision que realizo el profe, la dejo guardada como parte del proceso de aprendizaje


# Revisión del proyecto API ITaller2

Revisión estática de `consigna.txt`, `renata.txt` y todo `src/`. No se ejecutó el código.

**Conclusión:** hoy el proyecto no arranca (errores de sintaxis, imports rotos y archivos faltantes). El diseño de fondo es bueno: capa de servicios, bcrypt en pre-save, JWT, middleware central de errores y control de stock atómico. Parece una plantilla de otro proyecto (una librería) mal adaptada a productos y categorías.

## 1. Bloqueantes (el servidor no levanta)

| Dónde | Problema |
|---|---|
| `src/index.js:6` y `:48` | `PORT` se importa y se vuelve a declarar con `const` (SyntaxError). |
| `src/models/producto.js`, `src/models/categoria.js` | `import mongoose` duplicado. |
| `src/services/categoriaService.js:1-12` | Imports duplicados; apuntan a `categoriaModel.js` y `productoModel.js` (no existen); `ErrorApp` se importa como default pero se exporta con nombre. |
| `src/services/productoService.js` | Importa `producto` y `categoria` en minúscula pero usa `Producto` y `Categoria`; importa `storageService.js`, que no existe. |
| Controllers de producto y categoría | Importan `listarproductoService`, pero el service exporta `listarProductoService` (mayúscula distinta). Igual en categoría. |
| `src/utils/constants.js:4` | Importa `../middleware/permitirRoles.js`, que no existe (la carpeta real es `middlewere`). |
| `src/utils/config.js` | No exporta `JWT_SECRET` ni `JWT_EXPIRA`, usados por `authService` y `verificarToken`. |
| `src/controllers/carritoController.js:1` | Import con ruta absoluta `"/services/..."`. |
| `src/services/carritoService.js:126` y `:181` | `const producto = await producto.findById(...)` tapa el import con el mismo nombre (ReferenceError). |
| `src/routes/productoRoutes.js:6` y `:14` | `router.get()` sin argumentos; `router.post("/". ...)` con punto en vez de coma. |
| `pedidoController.js`, `pedidoRoutes.js` | Archivos vacíos. |
| Raíz del proyecto | Faltan `package.json` (con `"type": "module"` y Express 5), `.env` y `README.md`. |

## 2. Errores de lógica

- **Seed (`src/seed.js`):** usa campos de una librería (`titulo`, `isbn`, `genero`, `nacionalidad`, `disponible`, `categoria`). Los modelos usan `nombre`, `descripcion`, `tipo`, `categoria_id` y `estado`, por lo que la validación falla. Además importa `esAtlas` y `uriSinPassword` de `db.js`, que no los exporta. Explica "problemas para correr la semilla" de `renata.txt`.
- **`src/db.js`:** URI fija en localhost, no usa `.env`; los `console` usan comillas simples y `${...}` se imprime literal; typo `menssage`.
- **Rutas:**
  - `categoriaRoutes`: falta `/:id` en GET, PATCH y DELETE.
  - `usuarioRoutes`: usa `/id` literal en vez de `/:id`.
  - `carritoRoutes.js:7`: usa GET donde debería ir POST.
  - El carrito usa `:usuarioId` en la URL, pero el controller lee `req.usuario.id` y nunca se aplica `verificarToken`.
  - No hay ruta de login ni registro (`authController` no está conectado) y falta `/api/auth` en `index.js`.
- **Seguridad:** ninguna ruta de crear, actualizar o eliminar está protegida con JWT (lo pide la consigna). `POST /api/usuarios` acepta `rol` desde el body (cualquiera podría crearse admin) y `GET /api/usuarios` es público.
- **`authService.js:53`:** `throw new Error(msg, 400)` termina en 500; debería ser `ErrorApp`.
- **Referencias de Mongoose:** `ref: "producto"` en carrito y pedido no coincide con el modelo `Producto`. Los `populate` piden campos inexistentes (`titulo`, `disponible`, `categoria`); deberían ser `nombre`, `estado`, `categoria_id`.
- **`carritoService.js:130`:** falta el código 404 en el `ErrorApp` de producto inexistente.

## 3. Contra la consigna

- **Estructura:** los nombres difieren (`usuario` vs `user`, `middlewere` mal escrito, `db.js` en `src/` en vez de `src/config/`). Alinear o aclarar en el README.
- **try/catch:** el código lo evita a propósito con Express 5 y un middleware central. Es válido, pero debe explicarse en el README y Express 5 debe figurar en `package.json`.
- **Carrito, pedidos y roles:** no se piden y están a medio hacer; son lo que más rompe. Terminarlos o sacarlos del alcance.
- **Entrega pendiente:** README (título, esquema de DB, tecnologías, instrucciones, endpoints, mocks JSON, funcionalidades actuales y a futuro), `.env` de ejemplo y repositorio público en GitHub.

## 4. Notas de `renata.txt`

- **Seed y colecciones sobrantes:** se resuelven alineando el seed a los modelos. Para borrar colecciones de más: `db.dropDatabase()` en `mongosh`.
- **Error al crear una conexión nueva (causa posible, no verificada):** en Windows `localhost` a veces resuelve a IPv6. Probar con `127.0.0.1` y leer la URI desde `.env`.
- Otros puntos del archivo (cómo esquematizar, datos falsos o no, integración back-front) son dudas de la persona; no hay código relacionado todavía.
