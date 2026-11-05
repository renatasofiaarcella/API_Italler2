import mongoose from "mongoose";

// El modelo valida y da formato a los datos antes de guardarlos en MongoDB.

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre de la categoría es obligatorio"],
        trim: true,
        minlength: [3, "El nombre necesita al menos 3 caracteres"],
        maxlength: [60, "El nombre no puede tener más de 60 caracteres"]
    },

    tipo: {
        type: String,
        required: [true, "El tipo de categoría es obligatorio"],
        trim: true,
        minlength: [2, "El tipo necesita al menos 2 caracteres"],
        maxlength: [30, "El tipo no puede tener más de 30 caracteres"]
    },

    descripcion: {
        type: String,
        required: [true, "La descripción es obligatoria"],
        trim: true,
        maxlength: [300, "La descripción no puede tener más de 300 caracteres"]
    },

    estado: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model("Categoria", categoriaSchema);
