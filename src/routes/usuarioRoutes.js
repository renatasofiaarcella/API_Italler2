import { Router } from "express"
import * as usuarioController from "../controllers/usuarioController.js";
import { soloAdmin } from "../middleware/permitirRoles.js";

const router = Router()

// administrar usuarios es cosa del admin
router.get("/", ...soloAdmin, usuarioController.listarUsuarioController)
router.get("/:id", ...soloAdmin, usuarioController.obtenerUsuarioIdController)
router.post("/", ...soloAdmin, usuarioController.crearUsuarioController)

export default router
