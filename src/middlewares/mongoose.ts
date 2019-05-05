import * as mongoose from 'mongoose'
import { logger } from './winston'

export const connectDB: Function = (): void => {
  const MONGO_URI = 'mongodb://127.0.0.1:27017/test1'
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10
  }).then(() => {
    logger.info(`MongoDb is ready to use at ${MONGO_URI}`)
  }).catch((err: Error) => {
    logger.error(err)
  })
}
