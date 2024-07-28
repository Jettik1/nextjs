import mongoose, { mongo } from 'mongoose'

export enum UserRole {
  Owner = 'owner',
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user',
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: UserRole,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
)

const UserModel = mongoose.models?.User || mongoose.model('User', UserSchema)

export default UserModel
