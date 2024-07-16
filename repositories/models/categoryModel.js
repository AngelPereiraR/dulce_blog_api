import { model } from "mongoose"
import { categorySchema } from "./schemas/categorySchema.js"

export const CategoryModel = model('categories', categorySchema)
