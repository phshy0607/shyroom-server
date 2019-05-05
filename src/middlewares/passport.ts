import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'
import {
  ExtractJwt,
  Strategy as JWTStrategy,
  StrategyOptions,
  VerifyCallback
} from 'passport-jwt'

interface User {
  username: string;
  password?: string;
}

passport.serializeUser((user: User, cb: Function) => {
  cb(null, user.username)
})

passport.deserializeUser((user: User, cb: Function) => {
  cb(null, {
    message: 'im serialized'
  })
})

const SECRET_KEY = 'MY_TOP_SECRET'

const strategyOption: StrategyOptions = {
  secretOrKey: SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const strategyFunction: VerifyCallback = (payload: User, done: Function): void => {
  // read information from payload
  // assume payload has username, you need query from db, if you get a userFromDb
  const userFromDb: User = {
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
const generateJWT: (user: Shyroom.User) => string = (user: Shyroom.User): string => {
  return jwt.sign(user, SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '1h'
  })
}

passport.use(
  new JWTStrategy(
    strategyOption,
    strategyFunction
  )
)

export { passport, generateJWT }
