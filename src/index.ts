import { port } from './vendors/env'

import * as http from 'http'
import { AddressInfo } from 'net'
import { app } from './app'
import { logger } from './vendors/winston'

app.set('port', port)

const instance: http.Server = http.createServer(app)

instance.listen(port)

instance.on('error', onError)
instance.on('listening', onListening)

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error
  }
  switch (error.code) {
    case 'EACCES':
      logger.error(`Port ${port} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      logger.error(`Port ${port} is already in use`)
      process.exit(1)
      break
    default:
      logger.error(error)
      throw error
  }
}

function onListening(): void {
  const addr: AddressInfo | string = instance.address()
  logger.info(`Application starts on port ${port}......`)
}
