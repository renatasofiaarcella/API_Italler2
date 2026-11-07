# Incorrecta Taller — API RESTful (TP Final Backend)

API RESTful para el e-commerce de **Incorrecta Taller**. Administra catálogo de productos, categorías y usuarios, con autenticación JWT, carrito y control de stock atómico.

---

## Tecnologías
Node.js (ESM) · Express 5 · MongoDB Atlas (Mongoose) · bcrypt · jsonwebtoken · dotenv · cors · Vercel

---

## Arquitectura

```
src/
├── index.js          # Servidor y middlewares globales
├── db.js             # Conexión a MongoDB Atlas
├── seed.js           # Datos de prueba (20 productos reales)
├── models/           # Modelos Mongoose (producto, categoria, usuario, carrito, pedido)
├── services/         # Lógica de negocio y consultas a DB
├── controllers/      # Controladores HTTP ligeros
├── routes/           # Rutas públicas y protegidas
├── middleware/       # JWT, roles y manejo de errores
└── utils/            # Configuración y utilidades
```

---

## Esquema de la Base de Datos

| Colección | Campos principales |
|---|---|
| **categorias** | `nombre`, `tipo`, `descripcion`, `estado` |
| **productos** | `nombre`, `descripcion`, `precio`, `stock`, `categoria_id` (ref: Categoria, `populate`), `imagen`, `destacado`, `estado` |
| **usuarios** | `nombre`, `apellido`, `email`, `password` (hasheada con bcrypt), `rol` (`comprador` \| `vendedor` \| `admin`) |
| **carritos** | `usuario` (ref: Usuario), `items[{ producto, cantidad }]` |
| **pedidos** | `usuario`, `items`, `total`, `estado` (descuento atómico de stock) |

---

## Instalación y Ejecución

```bash
npm install
cp .env.example .env     # Configurar variables de entorno
npm run seed -- --si     # Poblar Atlas con los 20 productos de la tienda
npm run dev              # Iniciar servidor en http://localhost:3000
```

**Usuarios de prueba (Seed):**
* **Admin:** `admin@incorrecta.com` / `admin1234`
* **Comprador:** `renata@gmail.com` / `renata1234`
* **Vendedor:** `carla.ruiz@mail.com` / `carla1234`

---

## Endpoints

*Header para rutas protegidas:* `Authorization: Bearer <token>`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | Público | Inicia sesión y devuelve token |
| POST | `/api/auth/registro` | Público | Registra nuevo comprador |
| GET | `/api/productos` | Público | Lista productos con categoría (`populate`) |
| GET | `/api/productos/:id` | Público | Obtiene un producto por ID |
| POST | `/api/productos` | 🔒 Admin / Vendedor | Crea un producto (acepta ID o nombre de categoría) |
| PATCH | `/api/productos/:id` | 🔒 Admin / Vendedor | Actualiza un producto |
| DELETE | `/api/productos/:id` | 🔒 Admin / Vendedor | Elimina un producto |
| GET | `/api/categorias` | Público | Lista categorías |
| POST | `/api/categorias` | 🔒 Admin / Vendedor | Crea categoría |
| GET | `/api/usuarios` | 🔒 Solo Admin | Lista usuarios registrados |
| GET / POST | `/api/carrito` | 🔒 Token | Ver y agregar productos al carrito |
| POST | `/api/pedidos` | 🔒 Token | Confirma compra y descuenta stock en MongoDB |

---

## Ejemplos Mock (JSON)

**POST /api/auth/login**
```json
{
  "email": "admin@incorrecta.com",
  "password": "admin1234"
}
```

**POST /api/productos** 🔒
```json
{
  "nombre": "Buso Oversize snakes",
  "descripcion": "Buso de algodón premium oversize",
  "precio": 89900,
  "stock": 8,
  "categoria_id": "AW26",
  "imagen": "/assets/aw26/buso1.jpg"
}
```

---

## Funcionalidades
* **Implementadas:** CRUD completo, capa de servicios, `populate`, contraseñas con bcrypt, JWT, roles (RBAC), carrito, stock atómico, MongoDB Atlas en la nube y Vercel serverless.
* **A futuro:** Subida de imágenes en la nube (Cloudinary/Firebase), documentación Swagger y tests automatizados.
