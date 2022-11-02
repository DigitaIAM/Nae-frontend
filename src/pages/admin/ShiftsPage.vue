<template>
  <q-page padding>
    <jornal-and-form
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
import JornalAndForm from '../../components/JornalAndForm.vue';
import { useShifts } from '../../stores/shifts'

import { storeToRefs } from 'pinia'
import { useOid } from '../../stores/oid'

const { orgId } = storeToRefs(useOid())

const store = useShifts()
</script>


<style lang="sass" scoped>
</style>
