import { Document, model, Model, Schema } from 'mongoose'
export interface UserModel extends Shyroom.User, Document {
}

export let userSchema: Schema = new Schema({
  username: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true
  },
  password: { type: String, required: true, trim: true },
  nickname: String
},{ timestamps: true })

export let userModel: Model<UserModel> = model('user', userSchema)

