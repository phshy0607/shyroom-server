// import * as passport from 'passport'
// import {
//   IVerifyOptions,
//   Strategy as LocalStrategy,
//   VerifyFunction
// } from 'passport-local'
// import { logger } from './winston'

// interface IUser {
//   username: string
//   password: string
// }

// passport.serializeUser((user: IUser, cb: Function) => {
//   cb(null, user.username)
// })

// passport.deserializeUser((user: IUser, cb: Function) => {
//   cb(null, {
//     message: 'im serialized'
//   })
// })

// const strategyFunction: VerifyFunction = (
//   username: string,
//   password: string,
//   done: (
//     error: Error | undefined,
//     user?: IUser | {},
//     options?: IVerifyOptions
//   ) => void
// ): void => {
//   logger.info(`username is => ${username}`)
//   logger.info(`password is => ${password}`)
//   // fake a correct user as
//   const correctUser: IUser = {
//     username: 'admin',
//     password: '111'
//   }

//   if (username === 'admin') {
//     /* tslint:disable:possible-timing-attack */
//     if (password === '111') {
//       return done(undefined, correctUser)
//     } else {
//       return done(undefined, {}, { message: 'Incorrect Password.' })
//     }
//   } else {
//     return done(undefined, {}, { message: 'Incorrect Username.' })
//   }
// }

// passport.use(
//   new LocalStrategy(
//     { usernameField: 'username', passwordField: 'password', session: false },
//     strategyFunction
//   )
// )

// export { passport }
import { Request } from 'express'
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'
import {
  ExtractJwt,
  JwtFromRequestFunction,
  Strategy as JWTStrategy,
  StrategyOptions,
  VerifyCallback
} from 'passport-jwt'
import { logger } from './winston'

interface IUser {
  username: string
  password?: string
}

passport.serializeUser((user: IUser, cb: Function) => {
  cb(null, user.username)
})

passport.deserializeUser((user: IUser, cb: Function) => {
  cb(null, {
    message: 'im serialized'
  })
})

const SECRET_KEY: string = 'MY_TOP_SECRET'

const strategyOption: StrategyOptions = {
  secretOrKey: SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const strategyFunction: VerifyCallback = (payload: IUser, done: Function): void => {
  // read information from payload
  // assume payload has username, you need query from db, if you get a userFromDb
  const userFromDb: IUser = {
    username: 'admin',
    password: '111'
  }
  if (userFromDb) {
    // a valid user
    return done(null, userFromDb)
  } else {
    // not a valid user
    return done(null, false)
  }
}

/**
 * a method that generates JWT
 * @param username a username for user
 */
const generateJWT: (username: string) => string = (username: string): string => {
  return jwt.sign({ username: username }, SECRET_KEY)
}

passport.use(
  new JWTStrategy(
    strategyOption,
    strategyFunction
  )
)

export { passport, generateJWT }
