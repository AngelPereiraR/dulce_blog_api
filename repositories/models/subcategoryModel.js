import { model } from "mongoose"
import { subcategorySchema } from "./schemas/subcategorySchema.js"

export const SubcategoryModel = model('subcategories', subcategorySchema)
