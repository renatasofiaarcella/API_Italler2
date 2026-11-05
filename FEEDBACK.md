# Feedback del Trabajo Práctico Final — API RESTful con CRUD y Capa de Servicios

## Lo que está muy bien

- **Arquitectura:** separaste bien las responsabilidades. Los controllers son livianos y toda la lógica y las llamadas a Mongoose están en `services/`, como pide la consigna.
- **Seguridad de contraseñas:** bcrypt en un `pre-save` hook, con `select: false` y un `toJSON` que borra el hash. Es un doble candado muy bien pensado.
- **Manejo de errores:** un middleware central que traduce errores a 400, 401, 403, 404, 409 o 500, y una clase `ErrorApp`. Buena decisión usar Express 5 para no repetir `try/catch`.
- **Más allá de lo pedido:** carrito y pedidos con descuento de stock atómico (`findOneAndUpdate` con `$gte`) y compensación si algo falla. Es un nivel superior al de la consigna.
- **Comentarios:** explican el porqué de las decisiones (por ejemplo, la "foto" del precio en el pedido). Se nota que entendés lo que escribiste.

## Lo que había que corregir

Al revisar, el proyecto **no arrancaba**. No era un problema de concepto sino de integración final:

1. **Errores de sintaxis e imports:** `PORT` declarado dos veces, `import mongoose` duplicado, imports a archivos que no existían, y nombres que no coincidían entre service y controller (`listarproductoService` vs `listarProductoService`). Node distingue mayúsculas y minúsculas.
2. **Código copiado de otro proyecto:** el seed y partes de los services usaban campos de una librería (`titulo`, `isbn`, `genero`, `disponible`). Los modelos usan `nombre`, `precio`, `categoria_id` y `estado`. Por eso la semilla fallaba, que es justo lo que te costaba.
3. **Rutas incompletas:** `router.get()` sin argumentos, una coma escrita como punto, falta de `/:id`, un GET donde iba un POST, y las rutas de auth y pedidos sin conectar.
4. **Seguridad de las rutas:** crear, actualizar y eliminar no estaban protegidos con JWT (lo pide la consigna). Además `POST /api/usuarios` público dejaba elegir `rol`, es decir, cualquiera podía crearse un admin.
5. **Faltaban archivos de la entrega:** `package.json`, `.env` y `README.md`.

Ya dejé todo esto corregido, y los endpoints principales funcionan (seed, login, roles, productos, carrito y pedido). Compará tu versión con la corregida para ver cada cambio.

## Para mejorar

- **Corré el proyecto después de cada cambio.** Casi todos los errores aparecían al hacer `npm run dev` y leer el primer mensaje de error. Un error de sintaxis se corrige en un minuto si se detecta en el momento.
- **Si copiás código de ejemplos, revisalo campo por campo** contra tus propios modelos. Un buscador de "titulo" en el proyecto habría mostrado lo que quedaba.
- **Probá las rutas protegidas con y sin token** en Postman antes de entregar.
- **Mantené la consistencia en los nombres:** una convención (camelCase) y los mismos nombres de punta a punta.
- **Respecto a la consigna:** alineá los nombres de archivos y carpetas con la estructura pedida (`middleware`, no `middlewere`), o aclará en el README que usás nombres en español.
- **Priorizá lo pedido antes que los extras:** carrito, pedidos y roles son un gran plus, pero primero tiene que funcionar lo obligatorio.

## Antes de entregar

- Subir el proyecto a un **repositorio público de GitHub**.
- Revisar que el `.env` incluido tenga solo valores de ejemplo.
- Probar el README desde cero: clonar, `npm install`, `npm run seed`, `npm run dev`.
- Si no entregás el `.env`, hay que hostear la aplicación.

## Cierre

Tenés una base técnica sólida y buen criterio de diseño. Con más práctica en la parte de integración, que es normal que cueste, vas a poder hacer proyectos de este tamaño sin trabarte. ¡Buen trabajo!
