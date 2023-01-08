<template>
  <q-page padding>
    <!-- <suspense key="people"> -->
      {{ org }}
    <journal-and-form
      singular-title="Company"
      plural-title="Companies"
      :store="companies"
      :cols="[
        { style: 'width: 50%', name: 'name', label: 'name', field: 'name', required: true, align: 'center', sortable: false},
        { style: 'width: 50%', name: 'actions', label: 'actions', field: 'actions', required: true},
      ]"
      :fields="[
        { name: 'Name', type: 'text', field: 'name' },
      ]"
      :onSelection="click"
      :actions="[
        { id: 'cameras', color: 'secondary', icon:'camera' },
        { id: 'shifts', color: 'amber', icon:'calendar_month' },
        { id: 'people', color: 'green', icon:'people' },
        { id: 'events', color: 'green', icon:'inbox' },
      ]"
    />
    <!-- </suspense> -->
  </q-page>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import JournalAndForm from 'src/components/JournalAndForm.vue';

import { useCompanies } from 'src/stores/companies'
import { useOid } from 'src/stores/oid'

import { useRouter } from 'vue-router'

const companies = useCompanies()
const { org, loading, error } = storeToRefs(useOid())
const { selectOrganization } = useOid()

const router = useRouter()

const click = (item, index) => {
  if (index && index !== -1) {
    selectOrganization(item, index)
    router.push({ path: '/dmin/' + index })
  } else {
    return true
  }
}
</script>


<style lang="sass" scoped>
</style>
