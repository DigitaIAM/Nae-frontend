<template>
  <q-page padding>
    <div class="row">
      <div class="col q-pb-sm">
        <month-picker @change="showDate"></month-picker>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-table
          class="sticky-table"
          :loading="loading"
          :rows="rows"
          :columns="columns"
          row-key="person"
          :hide-pagination="true"
        >
          <template v-slot:body-cell="props">
            <q-td :props="props">
              {{  props.value  }}
              <!-- <q-badge color="blue" :label="props.value" /> -->
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { MonthPicker } from 'vue-month-picker'
import { ref, computed, watchEffect } from 'vue'

import { storeToRefs } from 'pinia'
import { useGet, useFind, usePagination } from 'feathers-pinia'

import { api } from '../../feathers'
import { useOid } from '../../stores/oid'
import { useAttendanceReport } from '../../stores/attendance-report'

import moment from 'moment'
import useAsyncComputed from '../../use-async-computed'

const today = () => {
  let yourDate = new Date()
  const offset = yourDate.getTimezoneOffset()
  yourDate = new Date(yourDate.getTime() - (offset*60*1000))
  return yourDate.toISOString().split('T')[0]
}

const loading = ref(false)
const dates = ref(null)
const division = ref("") // Отдел снабжения и логистики

const columns = ref([])
const rows = ref([])

const { oid } = storeToRefs(useOid())

watchEffect(async () => {
  if (dates.value) {
    loading.value = true
    const cols = [{name: 'person', field: 'person', label: 'ФИО'}, {name: 'total', field: 'total', label: 'Всего'}]
    const lines = []

    var index = 0;
    const days = []
    for (var d = new Date(dates.value.from.getTime()); d <= dates.value.till; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d.getTime()))

      const name = 'd'+(index++)
      cols.push({name: name, field: name, label: ''+d.getDate()})
    }

    const people = new Map()
    const records = new Map()

    for (const d of days) {
      const date = format(d)
      const response = await api.service('attendance-report').find({
        query: {
          oid: oid.value,
          date: date,
          // division: division.value,
        }
      })

      for (const report of response.data) {
        people.set(report.person._id, report.person)

        const key = ''+report.person._id+'~'+date
        records.set(key, report.intervals)
      }
    }

    for (const [id, person] of people) {
      const item = { person: person.name }

      var total = 0.0;
      var index = 0;
      for (const day of days) {
        const date = format(day)
        const key = ''+person._id+'~'+date
        const intervals = records.get(key)

        var hours = 0.0;
        if (intervals) {
        for (const interval of intervals) {
            if (interval.from && interval.till) {
              const f = new Date(interval.from)
              const t = new Date(interval.till)

              const h = Math.abs(t - f) / 36e5
              hours += h
            }
          }
        }

        hours = Math.round(hours * 10.0) / 10.0
        total += hours
        if (hours <= 0) {
          hours = '-'
        }
        item['d'+(index++)] = hours
      }
      item['total'] = Math.round(total * 10.0) / 10.0
      lines.push(item)
    }

    columns.value = cols
    rows.value = lines

    loading.value = false
  } else {
    columns.value = []
    rows.value = []
  }
}, [dates])

const format = (date, fn = (d) => d ) => {
  // console.log('format data', date)
  const offset = date.getTimezoneOffset()
  date = new Date(fn(date.getTime()) - (offset*60*1000))
  return date.toISOString().split('T')[0]
}

const showDate = (dt) => {
  console.log('dt', dt)

  const month = dt.monthIndex - 1
  const year = dt.year

  var date = new Date(year, month, 1);

  // console.log('date', date)

  const from = new Date(date.getTime())
  var till = new Date(date.getTime())

  while (date.getMonth() === month) {
    till = new Date(date.getTime())
    date.setDate(date.getDate() + 1);
    // console.log('date', date)
    // console.log('date.getMonth()', date.getMonth())
  }

  // console.log('from', from)
  // console.log('till', till)

  dates.value = { from: from, till: till }
}

const label_from = (d) => {
  if (d) {
    return d.getHours() + ':' + d.getMinutes()
  } else {
    return ''
  }
}

</script>


<style lang="sass" scoped>
.sticky-table
  height: 100%
  max-width: 100%
  td:first-child
    background-color: #c1f4cd !important
  tr th
    position: sticky
    z-index: 2
    background: #fff

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3
  td:first-child
    z-index: 1
  td:first-child, th:first-child
    position: sticky
    left: 0

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff
  thead tr th
    position: sticky
    z-index: 1
</style>
