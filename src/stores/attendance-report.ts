import { defineStore, BaseModel } from './index'
import { api } from '../feathers'

export class AttendanceReport extends BaseModel {}

const servicePath = 'attendance-report'
export const useAttendanceReport = defineStore({
  idField: '_id',
  servicePath,
  Model: AttendanceReport,
})

api.service(servicePath).hooks({})
