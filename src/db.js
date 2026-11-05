import mongoose from 'mongoose'
import { MONGO_URI } from './utils/config.js'

// mongodb+srv:// es Atlas (base en la nube, posiblemente compartida)
export const esAtlas = MONGO_URI.startsWith("mongodb+srv://")

// la URI sin usuario:password, para mostrarla en logs sin filtrar credenciales
export const uriSinPassword = () => MONGO_URI.replace(/\/\/[^@/]*@/, "//")

export const conectarDB = async () => {
   try {
      await mongoose.connect(MONGO_URI)
      console.log(`MongoDB conectado. base "${mongoose.connection.name}"`)
   } catch (error) {
      console.error(`No se pudo conectar: ${error.message}`)
      process.exit(1)
   }
}
