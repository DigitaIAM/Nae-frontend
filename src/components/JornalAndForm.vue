<template>
  <!-- <div>context: {{ context }}</div>
  <div>error: {{ error }}</div>
  <div>isPending: {{ isPending }}</div> -->
  <q-table
    :title="pluralTitle"
    class="sticky-header"
    v-model:pagination="table_pagination"
    :loading="isPending"
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
  </q-table>

  <!-- {{ form.item }} -->
  <FormComponent
    :title="properties.singularTitle"
    :item="form.item"
    :fields="properties.fields"
    @onclose="onclose"
    :visiable="form.item !== undefined"
  />
</template>

<script setup>
import MultiComponent from './MultiComponent.vue';
import FormComponent from './FormComponent.vue';

import { ref, watchEffect, reactive, computed, onMounted, onUnmounted } from 'vue'

import { storeToRefs } from 'pinia'
import { useGet, useFind, usePagination } from 'feathers-pinia'

import { useOid } from '../stores/oid'
const { orgId } = storeToRefs(useOid())

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


// let obj = await import('../stores/users.ts');
// const store = obj['useUsers']()

const filter = ref('')

const pagination = ref({
  $limit: 10,
  $skip: 0,
})

const params = computed(() => {
  const query = {}
  Object.assign(query, properties.context)
  Object.assign(query, pagination.value)
  
  const search = (filter.value || '').trim()
  if (search) {
    query['$search'] = search
  }
  return { query: query, paginate: true }
})

const { items, latestQuery, isPending, error, paginationData } = useFind({ model: properties.store.Model, params })

const { currentPage, toPage } = usePagination(
  pagination,
  latestQuery,
)

const table_pagination = computed(() => {
  var rowsNumber = 0
  const lq = latestQuery.value
  if (lq && lq.response) {
    rowsNumber = lq.response.total || 0
  }

  return {
    sortBy: 'desc',
    descending: false,
    page: currentPage.value,
    rowsPerPage: pagination.value.$limit,
    rowsNumber: rowsNumber
  }
})

const onRequest = (props) => {
  // console.log('onRequest', props)
  // console.log('paginationData', paginationData.value)
  toPage(props.pagination.page)
}

// watchEffect(
//   () => {
//     const lq = latestQuery.value
//     if (lq && lq.response) {
//       pagination.value.rowsNumber = lq.response.total || 0
//     } else {
//       pagination.value.rowsNumber = 0
//     }
//   },
// )

const form = reactive({
  item: undefined,
})

const createNew = () => {
  console.log('createNew', properties.onSelection)
  const item = new properties.store.Model({})
  Object.assign(item, properties.context)
  if (properties.onSelection) {
    properties.onSelection(item, -1)
  } else {
    form.item = item
  }
}

const onclose = () => {
  console.log('close')
  form.item = undefined
}

const onclick = (evt, row, index) => {
  console.log('onclick', properties.onSelection)
  if (properties.onSelection) {
    properties.onSelection(row, index)
  } else {
    form.item = row
  }
}

const onStore = () => {
  console.log('onStore')
  form.item.save()
    .then(r => {
      form.item = undefined
    })
    .catch(e => console.log('e', e))
}

const onkey = e => {
  // e.ctrlKey
  if (e.metaKey && e.key === 's') {
    e.preventDefault();
    if (form.show) {
      onStore()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', onkey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onkey)
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