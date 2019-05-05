declare namespace Express {
  export interface Request {
    token?: string;
  }
}

declare namespace Shyroom {
  export interface User {
    username: string;
    nickname?: string;
    password?: string;
  }
}