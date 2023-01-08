import { defineStore, BaseModel } from './index'
import { api } from 'src/feathers'

export class Document extends BaseModel {}

const servicePath = 'docs'
export const useDocs = defineStore({
  idField: '_id',
  servicePath,
  Model: Document,
})

api.service(servicePath).hooks({})
