import mongoose, { mongo } from 'mongoose'

export enum UserRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Moderator = 'Moderator',
  User = 'User',
}

export const PreferedRoles: UserRole[] = [
  UserRole.Owner,
  UserRole.Admin,
  UserRole.Moderator,
]

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
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.User,
    },
  },
  { timestamps: true }
)

const UserModel = mongoose.models?.User || mongoose.model('User', UserSchema)

export default UserModel
