<template>
  <q-page padding>
    <suspense key="cameras">
      <jornal-and-form
        singular-title="Event"
        plural-title="Events"
        :store="events"
        :cols="[
          { name: 'time', label: 'time', field: row => label(row.event, 'time'), required: true, align: 'center', sortable: false},
          { name: 'employeeNoString', label: 'employeeNoString', field: row => label(row.event, 'employeeNoString'), required: true, align: 'center', sortable: false},
          { name: 'name', label: 'name', field: row => label(row.event, 'name'), required: true, align: 'center', sortable: false},
        ]"
        :context="{ oid: orgId }"
        :fields="[
          // { name: 'time', type: 'text', field: 'time' },
          // { name: 'employeeNoString', type: 'text', field: 'employeeNoString' },
          // { name: 'name', type: 'text', field: 'name' },
        ]"
      />
    </suspense>
  </q-page>
</template>

<script setup>
import JornalAndForm from '../../components/JornalAndForm.vue';

import { storeToRefs } from 'pinia'
import { useOid } from '../../stores/oid'
import { useEvents } from '../../stores/events'

const { orgId } = storeToRefs(useOid())
const events = useEvents()

const label = (row, name) => {
  if (row) {
    return row[name] || ''
  } else {
    return ''
  }
}

</script>


<style lang="sass" scoped>
</style>
