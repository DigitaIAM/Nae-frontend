import { defineStore, BaseModel } from './index'
import { api } from '../feathers'

export class Event extends BaseModel {}

const servicePath = 'events'
export const useEvents = defineStore({
  idField: '_id',
  servicePath,
  Model: Event,
})

api.service(servicePath).hooks({})
