// =====================================================================
//  src/seed.js  —  carga datos de ejemplo
//
//  Correlo así:   npm run seed
//  OJO: BORRA todas las colecciones de la base antes de sembrar.
// =====================================================================

import mongoose from "mongoose";
import { conectarDB, esAtlas, uriSinPassword } from "./db.js";
import Categoria from "./models/categoria.js";
import Producto from "./models/producto.js";
import Usuario from "./models/usuario.js";
import Carrito from "./models/carrito.js";
import Pedido from "./models/pedido.js";

// Contra Atlas la base puede ser COMPARTIDA: hay que pedir el borrado a propósito
//     npm run seed -- --si
if (esAtlas && !process.argv.includes("--si")) {
    console.error("")
    console.error("🛑 Estás por sembrar una base de Atlas, y sembrar BORRA TODO.")
    console.error(`   base: ${uriSinPassword()}`)
    console.error("   Si es la que querés vaciar, repetí el comando así:  npm run seed -- --si")
    console.error("")
    process.exit(1);
}

await conectarDB();

// Se borra de afuera hacia adentro: pedidos y carritos apuntan a productos y usuarios,
// y los productos apuntan a las categorías.
await Pedido.deleteMany({});
await Carrito.deleteMany({});
await Producto.deleteMany({});
await Categoria.deleteMany({});
await Usuario.deleteMany({});
console.log("🧹 Colecciones vaciadas");

// syncIndexes crea de verdad los índices unique (email, carrito.usuario)
await Categoria.syncIndexes();
await Producto.syncIndexes();
await Usuario.syncIndexes();
await Carrito.syncIndexes();
await Pedido.syncIndexes();

const [remeras, pantalones, calzado] = await Categoria.create([
    { nombre: "Remeras",    tipo: "indumentaria", descripcion: "Remeras y musculosas" },
    { nombre: "Pantalones", tipo: "indumentaria", descripcion: "Jeans, joggers y bermudas" },
    { nombre: "Calzado",    tipo: "accesorios",   descripcion: "Zapatillas y zapatos" }
]);

// El stock va variado a propósito para probar casos:
// stock 1 -> "stock insuficiente" · stock 0 + estado false -> no se puede agregar al carrito
await Producto.create([
    { nombre: "Remera básica",  descripcion: "Remera de algodón lisa",       precio: 12000, stock: 10, categoria_id: remeras._id },
    { nombre: "Remera estampada", descripcion: "Remera con estampa frontal", precio: 15000, stock: 5,  categoria_id: remeras._id },
    { nombre: "Jean clásico",   descripcion: "Jean recto azul",              precio: 38000, stock: 4,  categoria_id: pantalones._id },
    { nombre: "Jogger",         descripcion: "Jogger de friza",              precio: 29000, stock: 1,  categoria_id: pantalones._id },
    { nombre: "Zapatillas urbanas", descripcion: "Zapatillas de cuero",      precio: 65000, stock: 3,  categoria_id: calzado._id },
    { nombre: "Botas",          descripcion: "Botas de invierno",            precio: 72000, stock: 0,  categoria_id: calzado._id, estado: false }
]);

// ⭐ Tiene que ser create() y NO insertMany(): insertMany se saltea el
//    pre-save hook y las contraseñas quedarían guardadas en texto plano.
await Usuario.create([
    { nombre: "Ana",   apellido: "Gómez",   email: "ana.gomez@mail.com",  password: "ana12345",  rol: "comprador" },
    { nombre: "Bruno", apellido: "Díaz",    email: "bruno.diaz@mail.com", password: "bruno1234", rol: "comprador" },
    { nombre: "Carla", apellido: "Ruiz",    email: "carla.ruiz@mail.com", password: "carla1234", rol: "vendedor"  },
    { nombre: "Admin", apellido: "Sistema", email: "admin@mail.com",      password: "admin1234", rol: "admin"     }
]);

console.log(`🌱 ${await Categoria.countDocuments()} categorías, ${await Producto.countDocuments()} productos, ${await Usuario.countDocuments()} usuarios`);
console.log("   logins: ana.gomez@mail.com / ana12345   (comprador)");
console.log("           carla.ruiz@mail.com / carla1234 (vendedor)");
console.log("           admin@mail.com / admin1234      (admin)");

await mongoose.connection.close();
