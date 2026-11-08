import test from "node:test";
import assert from "node:assert";

test("API Status: El servidor responde con código 200 y mensaje de bienvenida", async () => {
  // Consulta a tu API desplegada en producción
  const response = await fetch("https://api-italler2.vercel.app");
  const text = await response.text();

  // Verificamos que el estado HTTP sea 200 (OK)
  assert.strictEqual(response.status, 200, "El código de estado debe ser 200");

  // Verificamos que devuelva el mensaje del servidor
  assert.ok(
    text.includes("Servidor de Incorrecta Taller funcionando"),
    "La respuesta debe confirmar que el servidor está funcionando"
  );
});

test("Productos: El endpoint GET /api/productos devuelve una lista válida", async () => {
  const response = await fetch("https://api-italler2.vercel.app/api/productos");
  const data = await response.json();

  assert.strictEqual(response.status, 200, "El código de estado debe ser 200");
  assert.ok(Array.isArray(data), "La respuesta debe ser un array de productos");
});