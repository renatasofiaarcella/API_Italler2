import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce"
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRA = process.env.JWT_EXPIRA || "2h"

if (!JWT_SECRET) {
    console.error("Falta JWT_SECRET en el archivo .env")
    process.exit(1)
}

export { MONGO_URI, PORT, JWT_SECRET, JWT_EXPIRA }
