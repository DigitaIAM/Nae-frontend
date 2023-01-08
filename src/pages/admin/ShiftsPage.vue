<template>
  <q-page padding>
    <journal-and-form
      singular-title="Shift"
      plural-title="Shifts"
      :store="store"
      :cols="[
        { name: 'name', label: 'name', field: 'name', required: true, align: 'center', sortable: false},
      ]"
      :fields="[
        { name: 'Name', type: 'text', field: 'name' },
      ]"
      :context="{ oid: orgId }"
    />
  </q-page>
</template>

<script setup>
import JournalAndForm from 'src/components/JournalAndForm.vue';
import { useShifts } from 'src/stores/shifts'

import { storeToRefs } from 'pinia'
import { useOid } from 'src/stores/oid'

const { orgId } = storeToRefs(useOid())

const store = useShifts()
</script>


<style lang="sass" scoped>
</style>
