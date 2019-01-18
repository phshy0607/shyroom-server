declare namespace Express {
  export interface Request {
     token?: string
  }
}

declare namespace Shyroom {
  export interface IUser {
    username: string,
    nickname?: string
    password?: string
  }
}