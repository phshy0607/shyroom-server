/* tslint:disable: no-console */

import * as dotenv from 'dotenv'
import * as path from 'path'

const env: dotenv.DotenvConfigOutput = dotenv.config()

if (!env.error) {
  console.debug('.env file founded => \n', env.parsed)
} else {
  console.error('.env file not found, config will fall back to default')
}

export const parsedEnv: dotenv.DotenvParseOutput = env.parsed || {}

export const port: number = normalizePort(parsedEnv.PORT) || 3000

export const docPort: number = normalizePort(parsedEnv.DOCS_PORT) || 3010

export const logPath: string = parsedEnv.LOG_PATH || path.resolve(process.cwd(), 'logs')

function normalizePort(val: number | string): number {
  if (typeof val === 'string') {
    return parseInt(val, 10)
  } else {
    return val
  }
}
