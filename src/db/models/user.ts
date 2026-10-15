import { Schema, type InferSchemaType, type Types } from 'mongoose'

export const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true },
)

type UserFields = InferSchemaType<typeof userSchema>

export type UserWithPassword = UserFields & { _id: Types.ObjectId }

export type User = Omit<UserWithPassword, 'password'>

export type NewUser = Pick<UserFields, 'name' | 'email' | 'password'>
