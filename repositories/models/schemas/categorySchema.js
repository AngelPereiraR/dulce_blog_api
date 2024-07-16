import { Schema } from "mongoose"

export const categorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subcategories: [{
    _id: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    enabled: { type: Boolean, required: true }
  }],
  enabled: { type: Boolean, required: true }
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  })
