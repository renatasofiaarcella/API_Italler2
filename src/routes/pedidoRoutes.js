import { Router } from "express"
import * as pedidoController from "../controllers/pedidoController.js"
import { verificarToken } from "../middleware/verificarToken.js"
import { soloStaff } from "../middleware/permitirRoles.js"

const router = Router()

// "/todos" va ANTES de "/:id", si no Express tomaria "todos" como un id
router.get("/todos", ...soloStaff, pedidoController.listarTodosPedidosController)

router.post("/", verificarToken, pedidoController.crearPedidoController)
router.get("/", verificarToken, pedidoController.listarMisPedidosController)
router.get("/:id", verificarToken, pedidoController.obtenerMiPedidoController)
router.patch("/:id/pagar", verificarToken, pedidoController.pagarPedidoController)
router.patch("/:id/cancelar", verificarToken, pedidoController.cancelarPedidoController)

export default router
