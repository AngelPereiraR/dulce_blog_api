import express from "express";
import helmet from "helmet"
import cors from 'cors'
import mongoose from 'mongoose'
import bearerToken from 'express-bearer-token'
import { pathNotFoundHandler } from './errors/pathNotFoundHandler.js'
import { customErrorHandler } from "./errors/customErrorHandler.js"
import { indexController } from "./controllers/indexController.js"
import { usersController } from "./controllers/usersController.js";
import { subcategoriesController } from "./controllers/subcategoriesController.js";
import { categoriesController } from "./controllers/categoriesController.js";
import { articlesController } from "./controllers/articlesController.js";

const app = express()
const port = process.env.PORT || 8080

app.use(helmet())
app.use(cors())
app.use(bearerToken())
app.use(express.json())

console.info(`Entorno de ejecución ${process.env.NODE_ENV}`)

app.use(indexController)
app.use(usersController)
app.use(subcategoriesController)
app.use(categoriesController)
app.use(articlesController)

app.use(pathNotFoundHandler)
app.use(customErrorHandler)

try {
  await mongoose.connect(process.env.MONGO_CONN_STR)
  console.info("¡Conectado a la base de datos!")

  app.listen(port, () => {
    console.info(`Servidor funcionando en http://localhost:${port}`)
  })
} catch (e) {
  console.error("Error conectando a la base de datos, no se levantará el servidor")
  console.error(e)
}
