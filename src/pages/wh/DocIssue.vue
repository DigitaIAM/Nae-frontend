<template>
  <q-page padding>
    <!-- <div class="fill">
      <q-space/>
      <q-btn @click="list_devices">query relay</q-btn>
      <q-input label="password" v-model="pass" type="password"/>
    </div> -->
    <jornal-and-form
      singular-title="Camera"
      plural-title="Cameras"
      :store="docs"
      :cols="[
        { name: 'date', label: 'date', field: 'date', required: true, align: 'center', sortable: false},
        { name: 'number', label: 'number', field: 'number', required: true, align: 'center', sortable: false},
        { name: 'counterparty', label: 'counterparty', field: 'counterparty', required: true, align: 'center', sortable: false},
        { name: 'storage', label: 'storage', field: 'storage', required: true, align: 'center', sortable: false},
        { name: 'notes', label: 'notes', field: 'notes', required: true, align: 'center', sortable: false},
      ]"
      :fields="[
        [
          { name: 'number', type: 'text', field: 'number' },
          { name: 'date', type: 'date', field: 'date' },
        ],
        { name: 'counterparty', type: 'text', field: 'counterparty' },
        { name: 'storage', type: 'text', field: 'storage' },
        { type: 'table', cols: [
          { name: 'goods', type: 'goods', field: 'goods' },
          { name: 'uom', type: 'uom', field: 'uom' },
          { name: 'qty', type: 'number', field: 'qty' },
        ]}
      ]"
      :context="{ oid: oid, document: ['warehouse','receive'] }"
    />
  </q-page>
</template>

<script setup>
import { storeToRefs } from 'pinia'

import { useOid } from 'src/stores/oid'
import { useDocs } from 'src/stores/docs'

const docs = useDocs()

const { oid } = storeToRefs(useOid())
</script>


<style lang="sass" scoped>
</style>
