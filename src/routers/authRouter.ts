import { Request, Response, Router } from 'express'
import { UserModel, userModel } from '../db/user'
import { generateJWT, passport } from '../middlewares/passport'
import { logger } from '../middlewares/winston'
const authRouter: Router = Router()

authRouter.post('/register', (req: Request, res: Response) => {
  const user: Shyroom.User = {
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname || ''
  }
  userModel
    .create(user)
    .then((data: UserModel) => {
      res.json({
        message: `User <${data.username}> has been registered`,
        user: data
      })
    })
    .catch((err: Error) => {
      logger.error(err.message)
      // TODO: username 重复的异常处理。
      res.status(500)
    })
})

authRouter.post('/login', (req: Request, res: Response) => {
  const username: string = req.body.username
  const password: string = req.body.password

  logger.info(`A user <${username}> requests login`)

  const checkUser: (un: string, ps: string) => Promise<Shyroom.User> = (
    un: string,
    ps: string
  ): Promise<Shyroom.User> => {
    return new Promise<Shyroom.User>(
      (resolve: Function, reject: Function): void => {
        userModel
          .findOne({ username: un, password: ps })
          .then((data: UserModel | null) => {
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

  checkUser(username, password).then((payload: Shyroom.User) => {
    res.json({
      token: generateJWT(payload),
      message: 'logined successfully, use this token for further requests'
    })
  }).catch((err: Error) => {
    logger.error(err)
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
