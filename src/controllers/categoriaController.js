import * as categoriaService from "../services/categoriaService.js"

// req.query (query params) -> opcional, se usa para filtros
// req.params -> obligatorio para acceder a la ruta

export const listarCategoriaController = async (req, res) => {
    const categorias = await categoriaService.listarCategoriaService(req.query)
    res.status(200).json(categorias)
}

export const obtenerCategoriaIdController = async (req, res) => {
    const categoria = await categoriaService.obtenerCategoriaIdService(req.params.id)
    if (!categoria) {
        return res.status(404).json({ error: "No existe esa categoría" })
    }
    res.status(200).json(categoria)
}

export const crearCategoriaController = async (req, res) => {
    const categoria = await categoriaService.crearCategoriaService(req.body)
    res.status(201).json(categoria)
}

export const actualizarCategoriaController = async (req, res) => {
    const categoria = await categoriaService.actualizarCategoriaService(req.params.id, req.body)
    if (!categoria) {
        return res.status(404).json({ error: "No existe esa categoría" })
    }
    res.status(200).json(categoria)
}

export const eliminarCategoriaController = async (req, res) => {
    const categoria = await categoriaService.eliminarCategoriaService(req.params.id)
    if (!categoria) {
        return res.status(404).json({ error: "No existe esa categoría" })
    }
    res.status(200).json(categoria)
}
