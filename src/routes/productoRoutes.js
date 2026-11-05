import { Router } from "express";
import * as productoController from "../controllers/productoController.js";
import { soloStaff } from "../middleware/permitirRoles.js";

const router = Router()

// lectura publica
router.get("/", productoController.listarProductoController)
router.get("/:id", productoController.obtenerProductoIdController)

// crear, actualizar y eliminar: requieren token (vendedor o admin)
router.post("/", ...soloStaff, productoController.crearProductoController)
router.patch("/:id", ...soloStaff, productoController.actualizarProductoController)
router.delete("/:id", ...soloStaff, productoController.eliminarProductoController)

export default router
