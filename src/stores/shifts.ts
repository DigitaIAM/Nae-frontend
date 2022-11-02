import { defineStore, BaseModel } from './index'
import { api } from '../feathers'

export class Shift extends BaseModel {}

const servicePath = 'shifts'
export const useShifts = defineStore({
  idField: '_id',
  servicePath,
  Model: Shift,
})

api.service(servicePath).hooks({})
