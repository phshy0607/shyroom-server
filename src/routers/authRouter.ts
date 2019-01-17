import { NextFunction, Request, Response, Router } from 'express'
import * as fs from 'fs'
import * as moment from 'moment'
import { generateJWT, passport } from '../vendors/passport'
import { logger } from '../vendors/winston'

const authRouter: Router = Router()

authRouter.post('/login', (req: Request, res: Response) => {
  const username: string = req.body.username
  const password: string = req.body.password

  logger.info(`A user <${username}> requests login`)

  const checkUser: (un: string, ps: string) => Boolean = (
    un: string,
    ps: string
  ): Boolean => {
    if (un === 'admin' && ps === '111') {
      return true
    } else {
      return false
    }
  }

  if (checkUser(username, password) === true) {
    res.json({
      token: generateJWT(username),
      message: 'logined successfully, use this token for further requests'
    })
  } else {
    res.sendStatus(400)
  }
})

authRouter.post('/register', (req: Request, res: Response) => {
  res.json({
    message: 'yes'
  })
})

authRouter.get(
  '/protected',
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers.authorization)
    next()
  },
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    res.json({
      secret: 111
    })
  }
)

export { authRouter }
