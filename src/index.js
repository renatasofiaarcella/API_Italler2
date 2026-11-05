// Entry point
import express from 'express'
import cors from "cors";
import { conectarDB } from "./db.js";
import { PORT } from './utils/config.js';
import authRoutes from "./routes/authRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import carritoRoutes from "./routes/carritoRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import { manejarErrores } from './middleware/manejarErrores.js';

await conectarDB()

// express() devuelve un objeto, ese objeto es nuestro servidor
const app = express();

// Middlewares
app.use(cors()); //muy importante!
app.use(express.json());

// Ruta principal para comprobar que el servidor funciona
app.get("/", (req, res) => {
    res.status(200).send("Servidor de Incorrecta Taller funcionando");
});

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/pedidos", pedidoRoutes);

// Ruta para direcciones inexistentes
app.use((req, res) => {
    res.status(404).json({
        error: "La dirección solicitada no existe"
    });
});

// Middleware centralizado de errores: debe quedar al final
app.use(manejarErrores);

//Pone el servidor a escuchar en el puerto configurado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
