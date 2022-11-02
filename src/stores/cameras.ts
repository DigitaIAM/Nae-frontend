import { defineStore, BaseModel } from './index'
import { api } from '../feathers'

export class Camera extends BaseModel {}

const servicePath = 'cameras'
export const useCameras = defineStore({
  idField: '_id',
  servicePath,
  Model: Camera,
})

api.service(servicePath).hooks({})
