import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre del producto es obligatorio"],
        trim: true,
        minlength: [2, "El nombre necesita al menos 2 caracteres"],
        maxlength: [100, "El nombre no puede tener más de 100 caracteres"]
    },

    descripcion: {
        type: String,
        required: [true, "La descripción es obligatoria"],
        trim: true,
        maxlength: [500, "La descripción no puede tener más de 500 caracteres"]
    },

    precio: {
        type: Number,
        required: [true, "El precio es obligatorio"],
        min: [0, "El precio no puede ser negativo"]
    },

    stock: {
        type: Number,
        default: 0,
        required: [true, "El stock es obligatorio"],
        min: [0, "El stock no puede ser negativo"],
        validate: {
            validator: Number.isInteger,
            message: "El stock tiene que ser un número entero"
        }
    },

    categoria_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categoria",
        required: [true, "La categoría es obligatoria"]
    },

    estado: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model("Producto", productoSchema);
