import * as pedidoService from "../services/pedidoService.js"

export const crearPedidoController = async (req, res) => {
    const pedido = await pedidoService.crearPedidoService(req.usuario.id)
    res.status(201).json(pedido)
}

export const listarMisPedidosController = async (req, res) => {
    const pedidos = await pedidoService.listarMisPedidosService(req.usuario.id)
    res.status(200).json(pedidos)
}

export const listarTodosPedidosController = async (req, res) => {
    const pedidos = await pedidoService.listarTodosPedidosService()
    res.status(200).json(pedidos)
}

export const obtenerMiPedidoController = async (req, res) => {
    const pedido = await pedidoService.obtenerMiPedidoService(req.params.id, req.usuario.id)
    res.status(200).json(pedido)
}

export const pagarPedidoController = async (req, res) => {
    const pedido = await pedidoService.pagarPedidoService(req.params.id, req.usuario.id)
    res.status(200).json(pedido)
}

export const cancelarPedidoController = async (req, res) => {
    const pedido = await pedidoService.cancelarPedidoService(req.params.id, req.usuario.id)
    res.status(200).json(pedido)
}
