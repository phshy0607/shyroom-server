import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as express from 'express'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import * as path from 'path'
import { logsRouter } from './routers/logsRouter'
import { engine } from './vendors/handlebars'
import { logger, stream } from './vendors/winston'

class App {
  public instance: express.Application
  public name: String

  constructor() {
    this.name = 'Blog Server'
    this.instance = express()
    this.config()
    this.routes()
  }

  private config(): void {
    // set body-parser
    this.instance.use(bodyParser.urlencoded({ extended: true }))
    this.instance.use(bodyParser.json())

    // set morgan
    this.instance.use(morgan(':method :url :status :res[content-length] - :response-time ms', {stream: stream}))

    // set compression
    this.instance.use(compression())

    // set helmet
    this.instance.use(helmet())

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

  private routes(): void {
    // set up routes

    // set up error handling
    this.instance.get('/', (req: express.Request, res: express.Response) => {
      res.json({
        message: 'express app started',
        mode: process.env.NODE_ENV
      })
    })

    this.instance.use('/logs', logsRouter)
    logger.debug('Application routers installed......')
  }
}

export const app: express.Application = new App().instance
