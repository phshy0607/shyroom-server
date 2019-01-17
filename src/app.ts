import * as compression from 'compression'
import * as express from 'express'
import * as helmet from 'helmet'
import * as jwt from 'jsonwebtoken'
import * as morgan from 'morgan'
import * as path from 'path'
import { authRouter } from './routers/authRouter' 
import { logsRouter } from './routers/logsRouter'
import { engine } from './vendors/handlebars'
import { passport } from './vendors/passport'
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

  private routes(): void {
    // set up routes

    // set up error handling
    this.instance.get('/', (req: express.Request, res: express.Response) => {
      res.json({
        message: 'express app started',
        mode: process.env.NODE_ENV
      })
    })
    this.instance.use('/api', authRouter)
    // ****************
    // this.instance.get('/api', (req: express.Request, res: express.Response) => {
    //   res.json({
    //     message: 'yes'
    //   })
    // })
    // const ensureToken: (
    //   req: express.Request,
    //   res: express.Response,
    //   next: express.NextFunction
    // ) => void = (
    //   req: express.Request,
    //   res: express.Response,
    //   next: express.NextFunction
    // ): void => {
    //   const bearerHeader: string = req.headers.authorization
    //   if (bearerHeader) {
    //     const bearer: string[] = bearerHeader.split(' ')
    //     const bearerToken: string = bearer[1]
    //     req.token = bearerToken
    //     logger.info('TOKEN =>', bearerToken)
    //     next()
    //   } else {
    //     res.sendStatus(403)
    //   }
    // }

    // this.instance.get(
    //   '/api/protected',
    //   ensureToken,
    //   (req: express.Request, res: express.Response) => {
    //     jwt.verify(
    //       req.token,
    //       'my_secret_key',
    //       (err: jwt.VerifyErrors, data: object) => {
    //         if (err) {
    //           res.sendStatus(403)
    //         } else {
    //           res.json({
    //             secret: 1,
    //             data
    //           })
    //         }
    //       }
    //     )
    //   }
    // )
    // this.instance.post(
    //   '/api/login',
    //   (req: express.Request, res: express.Response) => {
    //     const user: { id: number } = { id: 3 }
    //     const token: string = jwt.sign({ user }, 'my_secret_key')
    //     res.json({
    //       token
    //     })
    //   }
    // )

    // ********************

    // this.instance.post('/githook', (req: express.Request, res: express.Response) => {
    //   res.json({
    //     message: 'bingo'
    //   })
    // })

    this.instance.use('/logs', logsRouter)
    logger.debug('Application routers installed......')
  }
}

export const app: express.Application = new App().instance
