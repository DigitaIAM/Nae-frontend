<template>
  <q-page padding>
    <jornal-and-form
      singular-title="Person"
      plural-title="People"
      :store="store"
      :cols="[
        { name: 'photo', label: 'photo', field: row => dataUrl+'/v1/picture?oid='+row.oid+'&pid='+row._id, required: true, align: 'left', sortable: false},
        { name: 'name', label: 'name', field: 'name', required: true, align: 'left', sortable: false},
        { name: 'gender', label: 'gender', field: 'gender', required: true, align: 'left', sortable: false},
        { name: 'division', label: 'division', field: 'division', required: true, align: 'left', sortable: false},
        { name: 'position', label: 'position', field: 'position', required: true, align: 'left', sortable: false},
      ]"
      :fields="[]"
      :context="{ oid: oid }"
      :onSelection="selected"
    />

    <PersonPage 
      title='Person'
      :item="form.item"
      @onclose="onclose"
    />
  </q-page>
</template>

<script setup>
import JornalAndForm from '../../components/JornalAndForm.vue';
import PersonPage from './PersonPage.vue';

import { dataUrl } from 'src/feathers'

import { ref, toRefs, watchEffect, reactive, computed, onMounted, onUnmounted } from 'vue'

import { usePeople } from '../../stores/people'

import { storeToRefs } from 'pinia'
import { useOid } from '../../stores/oid'

const { oid } = storeToRefs(useOid())

const store = usePeople()

const form = reactive({
  item: undefined,
})

const selected = (item, index) => {
  form.item = item
}

const onclose = () => {
  form.item = undefined
}

</script>


<style lang="sass" scoped>
</style>
