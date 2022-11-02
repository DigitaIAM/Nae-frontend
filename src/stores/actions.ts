import { defineStore, BaseModel } from './index'
import { api } from '../feathers'

export class Action extends BaseModel {}

const servicePath = 'actions'
export const useActions = defineStore({
  idField: '_id',
  servicePath,
  Model: Action,
})

api.service(servicePath).hooks({})
