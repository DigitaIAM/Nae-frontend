import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
// import { iff, discard } from 'feathers-hooks-common'

export const dataUrl = 'http://localhost:3030'

const socket = io(dataUrl, { transports: ['websocket'] })

// This variable name becomes the alias for this server.
export const api: any = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }))
