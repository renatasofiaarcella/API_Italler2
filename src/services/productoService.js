import mongoose from "mongoose";
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

// Verificar que exista la categoría (acepta tanto el ObjectId de Mongo como el nombre ej: "AW26")
export const verificarCategoriaService = async (categoriaIdentificador) => {
    if (!categoriaIdentificador) {
        throw new ErrorApp("La categoría es obligatoria", 400);
    }

    // 1. Si enviaron un ObjectId válido de Mongo
    if (mongoose.Types.ObjectId.isValid(categoriaIdentificador)) {
        const existe = await Categoria.findById(categoriaIdentificador);
        if (existe) return existe._id;
    }

    // 2. Si enviaron el nombre de la categoría (ej: "AW26", "ESENCIALES", "COMUNIDAD")
    const porNombre = await Categoria.findOne({
        nombre: { $regex: new RegExp(`^${categoriaIdentificador}$`, "i") }
    });
    if (porNombre) {
        return porNombre._id;
    }

    throw new ErrorApp(`No existe ninguna categoría con el ID o nombre "${categoriaIdentificador}"`, 400);
};

// POST: crear producto
export const crearProductoService = async (datos = {}) => {
    const categoriaIdValido = await verificarCategoriaService(datos.categoria_id);
    datos.categoria_id = categoriaIdValido;

    const producto = await Producto.create(datos);
    return await producto.populate("categoria_id", POPULATE_CATEGORIA);
};

// PATCH: actualizar producto
export const actualizarProductoService = async (id, datos = {}) => {
    if (datos.categoria_id !== undefined) {
        datos.categoria_id = await verificarCategoriaService(datos.categoria_id);
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
