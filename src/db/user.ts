/* tslint:disable:no-function-expression */
import { Document, model, Model, Schema } from 'mongoose'
import { logger } from '../vendors/winston'

export interface IUserModel extends Shyroom.IUser, Document {
}

export let userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true
    },
    password: { type: String, required: true, unique: true, trim: true },
    nickname: String
  },
  { timestamps: true }
)

export let userModel: Model<IUserModel> = model('user', userSchema)

// userSchema.query.findByUsername = function (username: string): Model {
//   return this.find({username})
// }

// userSchema.methods.findByUsername = function (err: Error, users: Shyroom.IUser[]): void {
//   if (err) {
//     logger.error(err)
//   } else {
//     logger.info(users)
//   }
// }
