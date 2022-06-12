import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

export type CheckPasswordFnType = (receivedPassword: string) => Promise<boolean>

export type UserType = mongoose.Model<any> & {
  email: string
  password: string
  checkPassword: CheckPasswordFnType
}

const { Schema } = mongoose

const userData = {
  email: {
    type: String,
    trim: true,
    required: true,
    index: {
      unique: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
}

const userSchema = new Schema(userData)

userSchema.methods.checkPassword = function (
  receivedPassword: string
): Promise<boolean> {
  return bcrypt.compare(receivedPassword, this.password)
}

export const User = mongoose.model<UserType>('User', userSchema, 'users')
