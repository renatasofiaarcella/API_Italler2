import { ErrorApp } from "../utils/ErrorApp.js"
import { ROLES } from "../utils/constants.js"
import { verificarToken } from "./verificarToken.js"

// Se usa despues de verificarToken: req.usuario ya existe
export const permitirRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
        throw new ErrorApp("No tenés permisos para esta acción", 403)
    }
    next()
}

// atajo: protege una ruta para vendedor y admin
// router.delete("/:id", ...soloStaff, controller)
export const soloStaff = [verificarToken, permitirRoles(ROLES.VENDEDOR, ROLES.ADMIN)]
export const soloAdmin = [verificarToken, permitirRoles(ROLES.ADMIN)]
