import { NextFunction, Request, Response, Router } from 'express'
import { IUserModel, userModel } from '../db/user'
import { generateJWT, passport } from '../vendors/passport'
import { logger } from '../vendors/winston'
const authRouter: Router = Router()

authRouter.post('/register', (req: Request, res: Response) => {
  const user: Shyroom.IUser = {
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname || ''
  }
  userModel
    .create(user)
    .then((data: IUserModel) => {
      res.json({
        message: `User <${data.username}> has been registered`,
        user: data
      })
    })
    .catch((err: Error) => {
      logger.error(err.message)
      res.sendStatus(500)
    })
})

authRouter.post('/login', (req: Request, res: Response) => {
  const username: string = req.body.username
  const password: string = req.body.password

  logger.info(`A user <${username}> requests login`)

  const checkUser: (un: string, ps: string) => Promise<Shyroom.IUser> = (
    un: string,
    ps: string
  ): Promise<Shyroom.IUser> => {
    return new Promise<Shyroom.IUser>(
      (resolve: Function, reject: Function): void => {
        userModel
          .findOne({ username: un, password: ps })
          .then((data: IUserModel | null) => {
            if (data === null) {
              reject(new Error('incorrect username or password'))
            } else {
              resolve({
                _id: data._id,
                username: data.username
              })
            }
          })
          .catch((err: Error) => {
            logger.error(err.message)
          })
      }
    )
  }

  checkUser(username, password).then((payload: Shyroom.IUser) => {
    res.json({
      token: generateJWT(payload),
      message: 'logined successfully, use this token for further requests'
    })
  }).catch((err: Error) => {
    res.sendStatus(401)
  })
})

authRouter.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    res.json({
      secret: 111
    })
  }
)

export { authRouter }
