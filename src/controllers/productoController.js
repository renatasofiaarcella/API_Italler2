import * as productoService from "../services/productoService.js"

export const listarProductoController = async (req, res) => {
    // query params -> opcional, sirve para filtrar
    const productos = await productoService.listarProductoService(req.query)
    res.status(200).json(productos)
}

export const obtenerProductoIdController = async (req, res) => {
    const producto = await productoService.obtenerProductoIdService(req.params.id)

    if (!producto) {
        return res.status(404).json({ error: "No existe ese producto" })
    }

    res.status(200).json(producto)
}

export const crearProductoController = async (req, res) => {
    const producto = await productoService.crearProductoService(req.body)
    res.status(201).json(producto)
}

export const actualizarProductoController = async (req, res) => {
    const producto = await productoService.actualizarProductoService(req.params.id, req.body)
    if (!producto) {
        return res.status(404).json({ error: "No existe ese producto" })
    }
    res.status(200).json(producto)
}

export const eliminarProductoController = async (req, res) => {
    const producto = await productoService.eliminarProductoService(req.params.id)
    if (!producto) {
        return res.status(404).json({ error: "No existe ese producto" })
    }
    res.status(200).json(producto)
}
