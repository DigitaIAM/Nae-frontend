<template>
  <q-page padding>
    <q-input v-model="date" label="Date"/>
    <q-input v-model="division" label="Division"/>
    <div class="row">
      <div class="col"></div>
      <div class="col">пришел</div>
      <div class="col">ушел</div>
      <div class="col">last from</div>
      <div class="col">last till</div>
    </div>
    <div v-for="(record, index) in items" :key="index">
      <q-separator />
      {{ record?.person?.name }}
      <div class="row" v-for="(interval, index) in record?.intervals" :key="index">
        <div class="col"/>
        <div class="col">
          {{ time(interval?.from) }}
        </div>
        <div class="col">
          {{ time(interval?.till) }}
        </div>
        <div class="col">
          <template v-if="interval?.last_from && interval?.last_from !== interval?.from">
            {{ time(interval?.last_from) }}
          </template>
        </div>
        <div class="col">
          <template v-if="interval?.last_till && interval?.last_till !== interval?.till">
            {{ time(interval?.last_till) }}
          </template>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

import { storeToRefs } from 'pinia'
import { useGet, useFind, usePagination } from 'feathers-pinia'

import { useOid } from '../../stores/oid'
import { useAttendanceReport } from '../../stores/attendance-report'

const today = () => {
  let yourDate = new Date()
  const offset = yourDate.getTimezoneOffset()
  yourDate = new Date(yourDate.getTime() - (offset*60*1000))
  return yourDate.toISOString().split('T')[0]
}

const date = ref("2022-11-10") // today())
const division = ref("Отдел снабжения и логистики")

const { orgId } = storeToRefs(useOid())
const report = useAttendanceReport()

const label = (row, name) => {
  if (row) {
    return row[name] || ''
  } else {
    return ''
  }
}

const params = computed(() => {
  const query = {
    oid: orgId.value,
    date: date.value,
    division: division.value,
  }
  // Object.assign(query, properties.context)
  // Object.assign(query, pagination.value)

  // const search = (filter.value || '').trim()
  // if (search) {
  //   query['$search'] = search
  // }
  return { query: query, paginate: true }
})

const { items, latestQuery, isPending, error, paginationData } = useFind({ model: report.Model, params })

const time = (ts) => {
  if (ts) {
    const date = new Date(ts)
    return date.toLocaleTimeString()
  } else {
    return ""
  }
}
</script>


<style lang="sass" scoped>
</style>
