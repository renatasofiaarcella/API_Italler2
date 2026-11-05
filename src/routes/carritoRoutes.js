import { Router } from 'express';
import * as carritoController from "../controllers/carritoController.js";
import { verificarToken } from "../middleware/verificarToken.js";

const router = Router()

// el usuario sale del token (req.usuario.id), no de la URL
router.use(verificarToken)

router.get("/", carritoController.obtenerCarritoController)
router.post("/", carritoController.agregarItemCarritoController)
router.patch("/:productoId", carritoController.actualizarItemCarritoController)
router.delete("/:productoId", carritoController.quitarItemCarritoController)
router.delete("/", carritoController.vaciarCarritoController)

export default router
