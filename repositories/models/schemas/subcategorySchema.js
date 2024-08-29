import { Schema } from "mongoose"

export const subcategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  enabled: { type: Boolean, required: true },
  orderNumber: { type: Number, required: true },
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  })
