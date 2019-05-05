import { Request, Response, Router } from 'express'
import * as fs from 'fs'
import * as moment from 'moment'
import * as path from 'path'
import { logPath } from '../middlewares/env'
import { logger } from '../middlewares/winston'

interface LogItem {
  message?: string;
  level: string;
  timestamp: string;
}

const readLogs: (filename: string) => Promise<Buffer> = (filename: string): Promise<Buffer> => {
  return new Promise((resolve: (data: Buffer) => void, reject: (err: NodeJS.ErrnoException) => void): void => {
    fs.readFile(path.join(logPath, filename), 'utf-8', (err: NodeJS.ErrnoException, data: Buffer) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const parseLog: (files: Buffer) => LogItem[] = (files: Buffer): LogItem[] => {
  return files
    .toString()
    .split('\n')
    .filter((line: string) => !!line)
    .map((line: string) => {
      const logItem: LogItem = JSON.parse(line)

      return {
        level: logItem.level.toUpperCase(),
        message: logItem.message,
        timestamp: moment(new Date(logItem.timestamp)).format('YYYY/MM/DD h:mm a')
      }
    })
    .sort((a: LogItem, b: LogItem) => {
      return parseInt(a.timestamp) - parseInt(b.timestamp) < 0 ? 1 : -1
    })
}

const logsRouter: Router = Router()

logsRouter.get('/', (req: Request, res: Response) => {
  readLogs('all-logs.log')
    .then(parseLog)
    .then((results: LogItem[]) => {
      res.render('logs', {
        logs: results
      })
    })
    .catch((err: NodeJS.ErrnoException) => {
      logger.error(err)
    })
})

logsRouter.get('/error', (req: Request, res: Response) => {
  readLogs('error-logs.log')
    .then(parseLog)
    .then((results: LogItem[]) => {
      res.render('logs', {
        logs: results
      })
    })
    .catch((err: NodeJS.ErrnoException) => {
      logger.error(err)
    })
})

logsRouter.delete('/', (req: Request, res: Response) => {
  const clearContent: (fileName: string) => Promise<undefined> = (filename: string): Promise<undefined> => {
    return new Promise((resolve: Function, reject: Function): void => {
      fs.writeFile(path.join(logPath, filename), '', (err: NodeJS.ErrnoException) => {
        if (err) {
          logger.error(err)
          reject(err)
        } else {
          logger.info(`log file ${filename} cleared`)
          resolve()
        }
      })
    })
  }

  const task: Promise<undefined>[] = [clearContent('all-logs.log'), clearContent('error-logs.log')]

  Promise.all(task).then(() => {
    res.status(200)
  }).catch(logger.error)

})

export { logsRouter }
