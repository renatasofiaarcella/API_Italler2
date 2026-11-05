import Categoria from "../models/categoria.js";
import Producto from "../models/producto.js";
import { ErrorApp } from "../utils/ErrorApp.js";

// GET: listar categorías, con filtros opcionales (tipo, estado)
// el objeto del parametro permite el filtrado dinamico y opcional
export const listarCategoriaService = async ({ tipo, estado } = {}) => {
    const filtro = {};

    if (tipo) {
        filtro.tipo = tipo;
    }

    if (estado !== undefined) {
        filtro.estado = estado === true || estado === "true";
    }

    return await Categoria.find(filtro).sort({ nombre: 1 });
};

// GET: obtener una categoría por ID
export const obtenerCategoriaIdService = async (id) => {
    return await Categoria.findById(id);
};

// POST: crear una categoría
export const crearCategoriaService = async (datos) => {
    return await Categoria.create(datos);
};

// PATCH: actualizar una categoría
export const actualizarCategoriaService = async (id, datos) => {
    return await Categoria.findByIdAndUpdate(id, datos, {
        returnDocument: "after",
        runValidators: true,
    });
};

// DELETE: eliminar una categoría
// No se puede eliminar si tiene productos asociados.
export const eliminarCategoriaService = async (id) => {
    const categoria = await Categoria.findById(id);

    if (!categoria) {
        return null;
    }

    const cantidadProductos = await Producto.countDocuments({ categoria_id: id });

    if (cantidadProductos > 0) {
        throw new ErrorApp(
            `No se puede eliminar: la categoría tiene ${cantidadProductos} producto(s) asociado(s)`,
            409
        );
    }

    await categoria.deleteOne();

    return categoria;
};
