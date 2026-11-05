import { Router } from 'express'
import * as categoriaController from "../controllers/categoriaController.js";
import { soloStaff } from "../middleware/permitirRoles.js";

const router = Router()

// lectura publica
router.get("/", categoriaController.listarCategoriaController)
router.get("/:id", categoriaController.obtenerCategoriaIdController)

// crear, actualizar y eliminar: requieren token (vendedor o admin)
router.post("/", ...soloStaff, categoriaController.crearCategoriaController)
router.patch("/:id", ...soloStaff, categoriaController.actualizarCategoriaController)
router.delete("/:id", ...soloStaff, categoriaController.eliminarCategoriaController)

export default router
