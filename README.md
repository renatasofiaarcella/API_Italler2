# API ITaller2 — Tienda online (Node.js + Express + MongoDB)

API RESTful con CRUD y capa de servicios. Gestiona **productos**, **categorías** y **usuarios**, con autenticación JWT. Como extra incluye **carrito** y **pedidos** (con control de stock).

## Tecnologías

Node.js (ESM) · Express 5 · MongoDB + Mongoose · bcrypt · jsonwebtoken · dotenv · cors

## Arquitectura

```
src/
├── index.js            punto de entrada (CORS, rutas, manejo de errores)
├── db.js               conexión a MongoDB
├── seed.js             datos de ejemplo
├── models/             esquemas Mongoose (producto, categoria, usuario, carrito, pedido)
├── services/           lógica de negocio y acceso a la DB (única capa que usa Mongoose)
├── controllers/        livianos: reciben el request, llaman al service, responden
├── routes/             definición de endpoints y protección
├── middleware/         verificarToken (JWT), permitirRoles, manejarErrores
└── utils/              config (.env), constantes, ErrorApp
```

**Manejo de errores:** al usar Express 5, los errores lanzados en funciones `async` llegan solos al middleware `manejarErrores`, que los traduce a 400 (validación / id inválido), 401, 403, 404, 409 o 500. Por eso los controllers y services no repiten `try/catch`; solo se usa donde se hace algo con el error (compensar stock en `pedidoService`).

## Esquema de la base de datos

| Colección | Campos |
|---|---|
| **categorias** | `nombre`, `tipo`, `descripcion`, `estado` (Boolean) |
| **productos** | `nombre`, `descripcion`, `precio`, `stock`, `categoria_id` → *Categoria* (referencia, se usa `populate`), `estado` |
| **usuarios** | `nombre`, `apellido`, `email` (único), `password` (hash bcrypt, oculta), `rol` (`comprador` \| `vendedor` \| `admin`), timestamps |
| **carritos** | `usuario` → *Usuario* (1 a 1), `items[{ producto → Producto, cantidad }]` |
| **pedidos** | `usuario` → *Usuario*, `items[{ producto, nombre, precioUnitario, cantidad, subtotal }]`, `total`, `estado` (`pendiente` \| `pagado` \| `cancelado`) |

## Cómo correrlo

Requisitos: Node 20+ y MongoDB corriendo (local o Atlas).

```bash
npm install
cp .env.example .env     # en Windows: copy .env.example .env  (y editar los valores)
npm run seed             # carga datos de ejemplo (BORRA las colecciones de la base)
npm run dev              # o: npm start
```

Variables de entorno (`.env`):

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=cambiar_por_un_secreto_largo
JWT_EXPIRA=2h
```

> En Windows conviene usar `127.0.0.1` en lugar de `localhost` en la URI (evita problemas de IPv6).
> Con Atlas (`mongodb+srv://`) el seed pide confirmación: `npm run seed -- --si`.

Usuarios del seed: `ana.gomez@mail.com / ana12345` (comprador) · `carla.ruiz@mail.com / carla1234` (vendedor) · `admin@mail.com / admin1234` (admin).

## Endpoints

Rutas protegidas: header `Authorization: Bearer <token>`.

### Auth
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/registro` | público | Crea un comprador y devuelve token |
| POST | `/api/auth/login` | público | Devuelve usuario + token |
| GET | `/api/auth/perfil` | token | Datos del usuario logueado |

### Categorías
| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/categorias` (filtros `?tipo=&estado=`) | público |
| GET | `/api/categorias/:id` | público |
| POST | `/api/categorias` | vendedor / admin |
| PATCH | `/api/categorias/:id` | vendedor / admin |
| DELETE | `/api/categorias/:id` (409 si tiene productos) | vendedor / admin |

### Productos (los GET hacen `populate` de la categoría)
| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/productos` (filtros `?nombre=&estado=&categoria_id=`) | público |
| GET | `/api/productos/:id` | público |
| POST | `/api/productos` | vendedor / admin |
| PATCH | `/api/productos/:id` | vendedor / admin |
| DELETE | `/api/productos/:id` | vendedor / admin |

### Usuarios (solo admin)
| Método | Ruta |
|---|---|
| GET | `/api/usuarios` |
| GET | `/api/usuarios/:id` |
| POST | `/api/usuarios` (permite elegir `rol`) |

### Carrito (token; el usuario sale del token)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/carrito` | Ver carrito con total |
| POST | `/api/carrito` | Agregar producto |
| PATCH | `/api/carrito/:productoId` | Fijar cantidad |
| DELETE | `/api/carrito/:productoId` | Quitar producto |
| DELETE | `/api/carrito` | Vaciar |

### Pedidos (token)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/pedidos` | Confirmar compra (descuenta stock, vacía carrito) |
| GET | `/api/pedidos` | Mis pedidos |
| GET | `/api/pedidos/:id` | Un pedido propio |
| PATCH | `/api/pedidos/:id/pagar` | Marcar pagado |
| PATCH | `/api/pedidos/:id/cancelar` | Cancelar (devuelve stock) |
| GET | `/api/pedidos/todos` | Todos (vendedor / admin) |

## Ejemplos de datos (JSON)

**POST /api/auth/registro**
```json
{ "nombre": "Lucía", "apellido": "Pérez", "email": "lucia@mail.com", "password": "lucia1234" }
```

**POST /api/auth/login**
```json
{ "email": "carla.ruiz@mail.com", "password": "carla1234" }
```

**POST /api/categorias**
```json
{ "nombre": "Camperas", "tipo": "indumentaria", "descripcion": "Camperas y abrigos" }
```

**POST /api/productos**
```json
{
  "nombre": "Gorra",
  "descripcion": "Gorra lisa",
  "precio": 8000,
  "stock": 7,
  "categoria_id": "<id de una categoría>"
}
```

**PATCH /api/productos/:id**
```json
{ "precio": 9000, "stock": 12 }
```

**POST /api/usuarios** (admin)
```json
{ "nombre": "Vera", "apellido": "Soto", "email": "vera@mail.com", "password": "vera1234", "rol": "vendedor" }
```

**POST /api/carrito**
```json
{ "producto": "<id de un producto>", "cantidad": 2 }
```

**PATCH /api/carrito/:productoId**
```json
{ "cantidad": 3 }
```

## Funcionalidades implementadas

- CRUD completo de productos y categorías, con relación y `populate`.
- Capa de servicios; controllers livianos.
- Contraseñas hasheadas con bcrypt en un pre-save hook; nunca se devuelven en las respuestas.
- Registro, login con JWT, perfil, y roles (comprador / vendedor / admin).
- Crear, actualizar y eliminar protegidos con JWT y rol.
- Carrito y pedidos con stock atómico, compensación ante errores y devolución de stock al cancelar.
- CORS, dotenv, códigos HTTP apropiados y middleware central de errores.

## Funcionalidades a futuro

- Edición y baja de usuarios (PATCH / DELETE).
- Paginación y orden en los listados.
- Imágenes de productos.
- Pasarela de pago real.
- Tests automatizados.
