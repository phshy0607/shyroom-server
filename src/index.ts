import { port } from './middlewares/env'
import * as http from 'http'
import { app } from './app'
import { logger } from './middlewares/winston'

app.set('port', port)

const instance: http.Server = http.createServer(app)

instance.listen(port)

function onListening (): void {
  logger.debug(`Application starts on port ${port}......`)
}

instance.on('listening', onListening)

