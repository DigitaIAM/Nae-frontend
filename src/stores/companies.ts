import { defineStore, BaseModel } from './index'
import { api } from '../feathers'

export class Company extends BaseModel {}

const servicePath = 'companies'
export const useСompanies = defineStore({
  idField: '_id',
  servicePath,
  Model: Company,
})

api.service(servicePath).hooks({})
