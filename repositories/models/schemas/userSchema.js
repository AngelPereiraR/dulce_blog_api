import { Schema } from 'mongoose'

export const allowedUserProfiles = ['user', 'admin']
export const DEFAULT_USER_PROFILE = 'user'

export const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  profile: { type: String, enum: allowedUserProfiles, default: DEFAULT_USER_PROFILE },
  enabled: { type: Boolean, required: true }
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)
