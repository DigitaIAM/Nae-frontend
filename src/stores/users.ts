import { defineStore, BaseModel } from './index'
import { api } from '../feathers'

export class User extends BaseModel {}

const servicePath = 'users'
export const useUsers = defineStore({
  idField: '_id',
  servicePath,
  Model: User,
})

api.service(servicePath).hooks({})
