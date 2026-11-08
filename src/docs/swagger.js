export const swaggerDoc = {
  openapi: "3.0.0",
  info: {
    title: "API ITaller2 — Incorrecta Taller E-Commerce",
    version: "1.0.0",
    description:
      "API RESTful con CRUD y Capa de Servicios desarrollada con Node.js, Express 5 y MongoDB Mongoose. Trabajo Práctico Final Backend — UTN BA.",
    contact: {
      name: "Renata Sofia Arcella",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local de desarrollo",
    },
    {
      url: "https://api-italler2.vercel.app",
      description: "Servidor en producción (Vercel)",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Pegá tu token JWT obtenido en /api/auth/login (sin escribir la palabra 'Bearer')",
      },
    },
  },
  tags: [
    { name: "Auth", description: "Autenticación, registro y perfil de usuarios" },
    { name: "Productos", description: "Catálogo de ropa, stock e imágenes" },
    { name: "Categorías", description: "Colecciones (AW26, ESENCIALES, COMUNIDAD)" },
    { name: "Carrito", description: "Gestión de carrito de compras del usuario" },
    { name: "Pedidos", description: "Checkout con control de stock atómico" },
    { name: "Usuarios", description: "Administración de usuarios (Solo Admin)" },
  ],
  paths: {
    /* ---------------- AUTH ---------------- */
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Iniciar sesión",
        description: "Devuelve los datos del usuario y el token JWT de acceso.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "admin@incorrecta.com" },
                  password: { type: "string", example: "admin1234" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login exitoso, devuelve usuario y token" },
          400: { description: "Faltan email o contraseña" },
          401: { description: "Credenciales inválidas" },
        },
      },
    },
    "/api/auth/registro": {
      post: {
        tags: ["Auth"],
        summary: "Registrar un nuevo comprador",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nombre", "apellido", "email", "password"],
                properties: {
                  nombre: { type: "string", example: "Lucía" },
                  apellido: { type: "string", example: "Pérez" },
                  email: { type: "string", example: "lucia@mail.com" },
                  password: { type: "string", example: "lucia1234" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Usuario registrado con éxito" },
          400: { description: "Datos de registro inválidos" },
          409: { description: "El email ya está registrado" },
        },
      },
    },
    "/api/auth/perfil": {
      get: {
        tags: ["Auth"],
        summary: "Perfil del usuario logueado",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Datos del usuario actual" },
          401: { description: "No autorizado (Token faltante o expirado)" },
        },
      },
    },

    /* ---------------- PRODUCTOS ---------------- */
    "/api/productos": {
      get: {
        tags: ["Productos"],
        summary: "Listar todos los productos",
        description: "Permite filtrar por nombre, estado y categoría. Realiza populate automático de la categoría.",
        parameters: [
          { name: "nombre", in: "query", schema: { type: "string" }, description: "Buscar por nombre" },
          { name: "categoria_id", in: "query", schema: { type: "string" }, description: "Filtrar por categoría (Nombre o ID)" },
          { name: "estado", in: "query", schema: { type: "boolean" }, description: "true (disponibles) o false" },
        ],
        responses: {
          200: { description: "Listado de productos" },
        },
      },
      post: {
        tags: ["Productos"],
        summary: "Crear un nuevo producto",
        security: [{ bearerAuth: [] }],
        description: "Requiere rol de vendedor o admin. Admite categoría por Nombre o por ObjectId.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nombre", "precio", "stock", "categoria_id"],
                properties: {
                  nombre: { type: "string", example: "Remera Oversize Tokio" },
                  descripcion: { type: "string", example: "100% algodón peinado pesado con serigrafía." },
                  precio: { type: "number", example: 28000 },
                  stock: { type: "number", example: 10 },
                  categoria_id: { type: "string", example: "AW26" },
                  imagen: { type: "string", example: "https://tiizyunffonjcnuveras.supabase.co/storage/v1/object/public/productos/ejemplo.jpg" },
                  destacado: { type: "boolean", example: true },
                  estado: { type: "boolean", example: true },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Producto creado con éxito" },
          400: { description: "Validación fallida" },
          401: { description: "Token requerido" },
          403: { description: "Permisos insuficientes" },
        },
      },
    },
    "/api/productos/{id}": {
      get: {
        tags: ["Productos"],
        summary: "Obtener un producto por su ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Detalle del producto" },
          404: { description: "Producto no encontrado" },
        },
      },
      patch: {
        tags: ["Productos"],
        summary: "Actualizar un producto",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  precio: { type: "number", example: 32000 },
                  stock: { type: "number", example: 15 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Producto modificado" },
          404: { description: "Producto no encontrado" },
        },
      },
      delete: {
        tags: ["Productos"],
        summary: "Eliminar un producto",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Producto eliminado correctamente" },
          404: { description: "Producto no encontrado" },
        },
      },
    },

    /* ---------------- CATEGORÍAS ---------------- */
    "/api/categorias": {
      get: {
        tags: ["Categorías"],
        summary: "Listar todas las categorías",
        responses: { 200: { description: "Listado de categorías" } },
      },
      post: {
        tags: ["Categorías"],
        summary: "Crear una categoría",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nombre", "tipo"],
                properties: {
                  nombre: { type: "string", example: "VERANO26" },
                  tipo: { type: "string", example: "indumentaria" },
                  descripcion: { type: "string", example: "Colección verano" },
                  estado: { type: "boolean", example: true },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Categoría creada" },
        },
      },
    },
    "/api/categorias/{id}": {
      get: {
        tags: ["Categorías"],
        summary: "Obtener categoría por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Detalle de la categoría" } },
      },
      delete: {
        tags: ["Categorías"],
        summary: "Eliminar categoría",
        security: [{ bearerAuth: [] }],
        description: "Rebota con 409 si la categoría aún tiene productos asociados.",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Categoría eliminada" },
          409: { description: "Conflicto: No se puede eliminar porque contiene productos" },
        },
      },
    },

    /* ---------------- CARRITO ---------------- */
    "/api/carrito": {
      get: {
        tags: ["Carrito"],
        summary: "Ver el carrito del usuario logueado",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Carrito con productos y total calculado" } },
      },
      post: {
        tags: ["Carrito"],
        summary: "Agregar producto al carrito",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["producto", "cantidad"],
                properties: {
                  producto: { type: "string", description: "ID del producto" },
                  cantidad: { type: "number", example: 2 },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Carrito actualizado" } },
      },
      delete: {
        tags: ["Carrito"],
        summary: "Vaciar el carrito",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Carrito vaciado" } },
      },
    },

    /* ---------------- PEDIDOS ---------------- */
    "/api/pedidos": {
      get: {
        tags: ["Pedidos"],
        summary: "Listar mis pedidos",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Historial de pedidos del usuario" } },
      },
      post: {
        tags: ["Pedidos"],
        summary: "Confirmar compra (Checkout)",
        security: [{ bearerAuth: [] }],
        description: "Descuenta stock de forma atómica y vacía el carrito automáticamente.",
        responses: {
          201: { description: "Pedido creado con éxito" },
          400: { description: "Carrito vacío o stock insuficiente" },
        },
      },
    },
    "/api/pedidos/{id}/cancelar": {
      patch: {
        tags: ["Pedidos"],
        summary: "Cancelar un pedido",
        security: [{ bearerAuth: [] }],
        description: "Cancela el pedido y devuelve el stock a los productos automáticamente.",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Pedido cancelado y stock reincorporado" } },
      },
    },

    /* ---------------- USUARIOS (ADMIN) ---------------- */
    "/api/usuarios": {
      get: {
        tags: ["Usuarios"],
        summary: "Listar usuarios (Solo Admin)",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Lista de todos los usuarios registrados" } },
      },
    },
  },
};