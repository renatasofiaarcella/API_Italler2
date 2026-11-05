import { Router } from "express"
import * as authController from "../controllers/authController.js"
import { verificarToken } from "../middleware/verificarToken.js"

const router = Router()

router.post("/registro", authController.registrarController)
router.post("/login", authController.loginController)
router.get("/perfil", verificarToken, authController.perfilController)

export default router
