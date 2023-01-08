<template>
  {{ pagination }}
  <q-table
    ref="tableRef"
    :title="pluralTitle"
    class="sticky-header"
    v-model:pagination="pagination"
    :loading="loading"
    :rows="items"
    :columns="cols"
    row-key="_id"
    :dense="$q.screen.lt.md"
    separator="horizontal"
    @row-click="onclick"
    @request="onRequest"
  >
    <template v-slot:top-right>
      <!-- <q-space /> -->
      <q-input dense debounce="300" color="primary" v-model="filter">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn
        color="primary"
        icon="add"
        no-caps
        @click="createNew"
      />
    </template>

    <template v-slot:body="props" v-if="properties.actions">
      <q-tr :props="props">
        <q-td key="name" :props="props">
          <div class="q-pa-sm q-gutter-sm">
            {{ props.row.name }}
          </div>
        </q-td>
        <q-td key="actions" :props="props">
          <div class="q-gutter-sm">
            <q-btn square color="primary" icon="edit" @click="(e) => onclick(e, props.row)"/>
            <template v-for="action in properties.actions" :key="action.id">
              <q-btn square :color="action.color" :icon="action.icon" @click="(e) => onclick(e, props.row, action.id)"/>
            </template>
          </div>
        </q-td>
      </q-tr>
    </template>

    <template v-slot:body="props" v-else>
      <q-tr :props="props">
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          @click="event => onclick(event, props.row)"
          auto-width
        >
          <!-- <div v-if="col.name =='photo'">{{ col.value }}</div> -->
          <!-- <q-avatar rounded v-if="col.name =='photo'" size="80px"> -->
          <q-img :src="col.value" style="height: 40px; max-width: 35px" v-if="col.name ==='photo'" />
          <!-- </q-avatar> -->
          <span v-else>{{ col.value }}</span>

        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- {{ form.item }} -->
  <FormComponent
    :title="properties.singularTitle"
    :item="form.item"
    :store="properties.store"
    :fields="properties.fields"
    @onclose="onclose"
  />
</template>

<script setup>
import { api } from "src/feathers"
import MultiComponent from './MultiComponent.vue';
import FormComponent from './FormComponent.vue';

import {ref, watchEffect, reactive, computed, onMounted, onUnmounted, onBeforeUnmount} from 'vue'

const properties = defineProps({
  singularTitle: String,
  pluralTitle: String,
  store: Object,
  context: Object,

  cols: Array,
  fields: Array,

  actions: Array,
  onSelection: Function,
})

const tableRef = ref()
const items = ref([])
const loading = ref(false)
const filter = ref('')

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1, // currentPage.value,
  rowsPerPage: 10, // pagination.value.$limit,
  rowsNumber: 0, // rowsNumber
})

const onRequest = (props) => {
  const query = {}
  Object.assign(query, properties.context)

  const search = (filter.value || '').trim()
  if (search) {
    query['$search'] = search
  }

  const skip = (pagination.value.page - 1) * pagination.value.rowsPerPage
  query['skip'] = skip

  loading.value = true
  api.service(properties.store.Model.servicePath).find({ query: query })
    .then(res => {
      console.log('res', res);
      items.value = res.data;

      // pagination.value.page = page
      pagination.value.rowsPerPage = res.$limit
      // pagination.value.sortBy = sortBy
      // pagination.value.descending = descending
      pagination.value.rowsNumber = res.total
      console.log('pagination', pagination)
    })
    .catch(e => console.log('error', e))
    .finally(() => loading.value = false)

}

const form = reactive({
  item: undefined,
})

const createNew = () => {
  // console.log('createNew', properties.onSelection)
  const item = new properties.store.Model({})
  Object.assign(item, properties.context)
  if (properties.onSelection) {
    if (properties.onSelection(item, -1)) {
      form.item = item
    }
  } else {
    form.item = item
  }
}

const onclose = () => {
  // console.log('close')
  form.item = undefined
}

const onclick = (evt, row, index) => {
  console.log('onclick', properties.onSelection)
  evt.stopPropagation()
  if (properties.onSelection) {
    if (properties.onSelection(row, index)) {
      form.item = row
    }
  } else {
    form.item = row
  }
}

onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction()
})

const handlePatched = (item) => {
  console.log('patched', item)
}
properties.store.Model.on('patched', handlePatched)
onBeforeUnmount(() => {
  properties.store.Model.off('patched', handlePatched)
})
</script>

<style lang="sass" scoped>
  .sticky-header
    // height: 310px
    // max-width: 600px
    td:first-child
      background-color: #c1f4cd !important
    tr th
      position: sticky
      z-index: 2
      background: #fff
    thead tr:last-child th
      top: 48px
      z-index: 3
    thead tr:first-child th
      top: 0
      z-index: 1
    tr:first-child th:first-child
      z-index: 3
    td:first-child
      z-index: 1
    td:first-child, th:first-child
      position: sticky
      left: 0
  </style>
