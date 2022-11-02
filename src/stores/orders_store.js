import { defineStore, BaseModel } from 'feathers-pinia'
import { api } from '../feathers'

export class Order extends BaseModel {}

const servicePath = 'orders'
export const useOrders = defineStore({
  idField: '_id',
  clients: { api },
  servicePath,
  Model: Order,
})

api.service(servicePath).hooks({})
