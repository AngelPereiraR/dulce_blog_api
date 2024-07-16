import { model } from "mongoose"
import { userSchema } from "./schemas/userSchema.js"

export const UserModel = model('users', userSchema)
