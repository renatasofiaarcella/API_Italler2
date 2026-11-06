// =====================================================================
//  src/seed.js  —  carga datos de ejemplo para Incorrecta Taller
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
    console.error("");
    console.error("🛑 Estás por sembrar una base de Atlas, y sembrar BORRA TODO.");
    console.error(`   base: ${uriSinPassword()}`);
    console.error("   Si es la que querés vaciar, repetí el comando así:  npm run seed -- --si");
    console.error("");
    process.exit(1);
}

await conectarDB();

// Se borra de afuera hacia adentro
await Pedido.deleteMany({});
await Carrito.deleteMany({});
await Producto.deleteMany({});
await Categoria.deleteMany({});
await Usuario.deleteMany({});
console.log("🧹 Colecciones vaciadas");

// Sincronizar índices únicos
await Categoria.syncIndexes();
await Producto.syncIndexes();
await Usuario.syncIndexes();
await Carrito.syncIndexes();
await Pedido.syncIndexes();

// 1. Categorías oficiales de Incorrecta Taller
const [aw26, esenciales] = await Categoria.create([
    {
        nombre: "AW26",
        tipo: "coleccion",
        descripcion: "Colección Otoño/Invierno 2026 de Incorrecta Taller"
    },
    {
        nombre: "ESENCIALES",
        tipo: "basicos",
        descripcion: "Prendas clásicas de diseño independiente y series limitadas"
    }
]);

// 2. Los 20 productos de la tienda con sus fotos y stock
await Producto.create([
    {
        nombre: "Buso Oversize snakes",
        precio: 89900,
        descripcion: "Buso de algodón premium oversize.",
        stock: 8,
        categoria_id: aw26._id,
        imagen: "/assets/aw26/buso1.jpg",
        destacado: true
    },
    {
        nombre: "Buso Gris",
        precio: 95000,
        descripcion: "Buso frisado unisex.",
        stock: 4,
        categoria_id: aw26._id,
        imagen: "/assets/aw26/buso2.jpg",
        destacado: false
    },
    {
        nombre: "Buso Medieval Trend",
        precio: 87000,
        descripcion: "Edición limitada. Full frisado",
        stock: 2,
        categoria_id: aw26._id,
        imagen: "/assets/aw26/buso3.jpg",
        destacado: true
    },
    {
        nombre: "Top Bauhaus",
        precio: 27000,
        descripcion: "Top de Lycra estampa original",
        stock: 1,
        categoria_id: esenciales._id,
        imagen: "/assets/shop/bahuhaus_top1.jpg",
        destacado: false
    },
    {
        nombre: "Remera Bauhaus",
        precio: 35000,
        descripcion: "Remera algodón peinado. Consultar talles.",
        stock: 10,
        categoria_id: esenciales._id,
        imagen: "/assets/shop/bauhaus_remera_1.jpg",
        destacado: true
    },
    {
        nombre: "Top Siuxie",
        precio: 30000,
        descripcion: "Top Lycra",
        stock: 12,
        categoria_id: esenciales._id,
        imagen: "/assets/shop/siuxi_1.jpg",
        destacado: false
    },
    {
        nombre: "Buso Oriente",
        precio: 52000,
        descripcion: "Buso negro Hoodie algodón frizado",
        stock: 3,
        categoria_id: aw26._id,
        imagen: "/assets/shop/buso_negro_chino.jpg",
        destacado: true
    },
    {
        nombre: "Vestido Vampira",
        precio: 49000,
        descripcion: "Vestido encaje con sobrevuelos.",
        stock: 3,
        categoria_id: aw26._id,
        imagen: "/assets/shop/aw26_12.jpg",
        destacado: false
    },
    {
        nombre: "Top Oriente blanco",
        precio: 30000,
        descripcion: "Top Oriente Lycra blanco",
        stock: 2,
        categoria_id: esenciales._id,
        imagen: "/assets/shop/top_china.jpg",
        destacado: false
    },
    {
        nombre: "King Tote Bag",
        precio: 20000,
        descripcion: "Tote Bags medida 40x50",
        stock: 1,
        categoria_id: esenciales._id,
        imagen: "/assets/shop/king_tote.jpg",
        destacado: false
    },
    {
        nombre: "Buso California",
        precio: 95000,
        descripcion: "Buso frizado premium",
        stock: 3,
        categoria_id: aw26._id,
        imagen: "/assets/shop/buso_california.jpg",
        destacado: false
    },
    {
        nombre: "Buso California Estampa",
        precio: 95000,
        descripcion: "Buso frizado premium con estampa trasera",
        stock: 3,
        categoria_id: aw26._id,
        imagen: "/assets/shop/buso_california_2.jpg",
        destacado: false
    },
    {
        nombre: "Top Olas",
        precio: 30000,
        descripcion: "Top Olas Lycra",
        stock: 1,
        categoria_id: esenciales._id,
        imagen: "/assets/shop/26.jpg",
        destacado: false
    },
    {
        nombre: "Buso Puas",
        precio: 95000,
        descripcion: "Buso tipo Hoodie Frizado",
        stock: 3,
        categoria_id: aw26._id,
        imagen: "/assets/shop/7.jpg",
        destacado: false
    },
    {
        nombre: "Buso King Blanco",
        precio: 52000,
        descripcion: "Buso Blanco algodón",
        stock: 1,
        categoria_id: aw26._id,
        imagen: "/assets/shop/king_ml.jpg",
        destacado: false
    },
    {
        nombre: "King combo Promo",
        precio: 150000,
        descripcion: "Buso + Tote + Remera manga larga",
        stock: 20,
        categoria_id: esenciales._id,
        imagen: "/assets/shop/king_combo.jpg",
        destacado: false
    },
    {
        nombre: "Falda Vampira",
        precio: 40000,
        descripcion: "Falda de encaje + Cinto ojales",
        stock: 10,
        categoria_id: aw26._id,
        imagen: "/assets/shop/falda_encaje.jpg",
        destacado: false
    },
    {
        nombre: "Tote Siuxie",
        precio: 30000,
        descripcion: "Tote Bags 40x50",
        stock: 1,
        categoria_id: esenciales._id,
        imagen: "/assets/shop/tote_color.jpg",
        destacado: false
    },
    {
        nombre: "Tote Bags",
        precio: 20000,
        descripcion: "Tote Bags 30x40",
        stock: 1,
        categoria_id: esenciales._id,
        imagen: "/assets/shop/tote_azul.jpg",
        destacado: false
    },
    {
        nombre: "Top Punk",
        precio: 32000,
        descripcion: "Top batik Lycra",
        stock: 1,
        categoria_id: aw26._id,
        imagen: "/assets/shop/aw26_3.jpg",
        destacado: false
    }
]);

// 3. Usuarios de prueba de Incorrecta Taller
await Usuario.create([
    {
        nombre: "Administrador",
        apellido: "Incorrecta",
        email: "admin@incorrecta.com",
        password: "admin1234",
        rol: "admin"
    },
    {
        nombre: "Renata",
        apellido: "Arcella",
        email: "renata@gmail.com",
        password: "renata1234",
        rol: "comprador"
    },
    {
        nombre: "Carla",
        apellido: "Ruiz",
        email: "carla.ruiz@mail.com",
        password: "carla1234",
        rol: "vendedor"
    }
]);

console.log(`🌱 Semilla cargada con éxito:`);
console.log(`   - ${await Categoria.countDocuments()} categorías (AW26 y ESENCIALES)`);
console.log(`   - ${await Producto.countDocuments()} productos de Incorrecta Taller`);
console.log(`   - ${await Usuario.countDocuments()} usuarios`);
console.log("");
console.log("   Accesos de prueba:");
console.log("   - admin@incorrecta.com / admin1234  (admin)");
console.log("   - renata@gmail.com / renata1234     (comprador)");
console.log("   - carla.ruiz@mail.com / carla1234  (vendedor)");

await mongoose.connection.close();
