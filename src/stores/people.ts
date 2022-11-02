import { defineStore, BaseModel } from './index'
import { api } from '../feathers'

export class People extends BaseModel {}

const servicePath = 'people'
export const usePeople = defineStore({
  idField: '_id',
  servicePath,
  Model: People,
})

api.service(servicePath).hooks({})
