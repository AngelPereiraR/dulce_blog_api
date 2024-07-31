import { Schema } from 'mongoose'

export const articleSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  subcategories: [{
    _id: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    created_at: { type: String, required: true },
    updated_at: { type: String, required: true }
  }],
  author: { type: String, required: true },
  published_at: { type: Date, required: false },
  enabled: { type: Boolean, default: false }
},
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)
