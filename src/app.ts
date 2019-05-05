import * as compression from 'compression'
import * as express from 'express'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import * as path from 'path'
import { engine } from './middlewares/handlebars'
import { connectDB } from './middlewares/mongoose'
import { passport } from './middlewares/passport'
import { logger, stream } from './middlewares/winston'
import { authRouter } from './routers/authRouter'
import { logsRouter } from './routers/logsRouter'

class App {
  public instance: express.Application
  public name: string

  constructor () {
    this.name = 'Blog Server'
    this.instance = express()
    this.config()
    this.routes()
  }

  private config (): void {
    // connect mongodb
    connectDB()
    // set express bulit-in body-parser
    this.instance.use(express.urlencoded({ extended: true }))
    this.instance.use(express.json())
    // set morgan
    this.instance.use(
      morgan(':method :url :status :res[content-length] - :response-time ms', {
        stream: stream
      })
    )
    // set compression
    this.instance.use(compression())
    // set helmet
    this.instance.use(helmet())
    // set passport
    this.instance.use(passport.initialize())
    // set view directory
    this.instance.set('views', path.join(__dirname, '../src/views'))
    // set view engine
    this.instance.engine('handlebars', engine)
    this.instance.set('view engine', 'handlebars')
    // enable cache
    if (process.env.NODE_ENV === 'production') {
      this.instance.enable('view cache')
    }
    logger.debug('Application configured...... ')
  }

  private routes (): void {
    // set up routes

    // set up error handling
    this.instance.get('/', (req: express.Request, res: express.Response) => {
      res.json({
        message: 'express app started',
        mode: process.env.NODE_ENV
      })
    })

    this.instance.use('/api', authRouter)
    this.instance.use('/logs', logsRouter)
    logger.debug('Application routers installed......')
  }
}

export const app: express.Application = new App().instance
