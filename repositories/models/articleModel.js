import { model } from "mongoose"
import { articleSchema } from "./schemas/articleSchema.js"

export const ArticleModel = model('articles', articleSchema)
