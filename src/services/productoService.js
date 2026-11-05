import Categoria from "../models/categoria.js";
import Producto from "../models/producto.js";
import { ErrorApp } from "../utils/ErrorApp.js";

// el servicio tiene la responsabilidad de hacer el llamado a los datos, procesarlos, operarlos, combinarlos. Todo tratamiento a los datos se hace desde acá y muchas veces dependemos de llamados a la base de datos

const POPULATE_CATEGORIA = "nombre tipo descripcion estado";

const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET: listar productos, con filtros opcionales
export const listarProductoService = async ({ nombre, estado, categoria_id } = {}) => {
    const filtro = {};

    if (nombre) {
        filtro.nombre = { $regex: escaparRegex(String(nombre)), $options: "i" };
    }

    if (estado !== undefined) {
        filtro.estado = estado === true || estado === "true";
    }

    if (categoria_id) {
        filtro.categoria_id = categoria_id;
    }

    return await Producto.find(filtro)
        .populate("categoria_id", POPULATE_CATEGORIA)
        .sort({ nombre: 1 });
};

// GET: obtener producto por ID
export const obtenerProductoIdService = async (id) => {
    return await Producto.findById(id).populate("categoria_id", POPULATE_CATEGORIA);
};

// Verificar que exista la categoría
export const verificarCategoriaService = async (categoriaId) => {
    if (!categoriaId) {
        throw new ErrorApp("La categoría es obligatoria", 400);
    }

    const existe = await Categoria.exists({ _id: categoriaId });

    if (!existe) {
        throw new ErrorApp(`No existe ninguna categoría con el ID ${categoriaId}`, 400);
    }
};

// POST: crear producto
export const crearProductoService = async (datos = {}) => {
    await verificarCategoriaService(datos.categoria_id);

    const producto = await Producto.create(datos);
    return await producto.populate("categoria_id", POPULATE_CATEGORIA);
};

// PATCH: actualizar producto
export const actualizarProductoService = async (id, datos = {}) => {
    // Solo verificamos la categoría si se envió en la actualización.
    if (datos.categoria_id !== undefined) {
        await verificarCategoriaService(datos.categoria_id);
    }

    return await Producto.findByIdAndUpdate(id, datos, {
        returnDocument: "after",
        runValidators: true
    }).populate("categoria_id", POPULATE_CATEGORIA);
};

// DELETE: eliminar producto
export const eliminarProductoService = async (id) => {
    return await Producto.findByIdAndDelete(id);
};
