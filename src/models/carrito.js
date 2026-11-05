import mongoose from 'mongoose'


// El carrito entre compra y compra queda vacio (limpio)

// que tiene el carrito?
const itemSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: [true, "Falta el producto"]
    },
    cantidad: {
        type: Number,
        required: [true, "Falta la cantidad"],
        min: [1, "La cantidad minima es 1"],
        validate: {
            validator: Number.isInteger,
            message: "La cantidad tiene que ser un número entero"
        }
    }
}, {_id: false})

// porque no tiene _id? -> el item se identifica por el producto, si tenemos mas de un producto
// no se repite se suma la cantidad. Ademas item no guarda el precio: el carrito muestra el precio VIVO del producto -> el precio puede cambiar, VIVO significa que es el precio en tiempo real del producto

const carritoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
        unique: true // hace la relacion 1 a 1
    },
    items: {
        type: [itemSchema],
        default: []
    }
}, {timestamps: true})

// timestamps -> marcas de tiempo, guarda fechas de eventos
// createdAt, updatedAt, deletedAt
// los timestamps sirven para auditoria

export default mongoose.model("Carrito", carritoSchema)