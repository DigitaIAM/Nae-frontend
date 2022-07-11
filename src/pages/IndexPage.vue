<template>
  <q-page> <!-- class="flex flex-center" -->
    <div class="row full-width text-h6 text-center">
      Заказ № 00001 от 08 Июль 2022
    </div>
    <div class="fill">
      <q-table
        style="height: 400px"
        title="Материалы"
        :rows="rows"
        :columns="columns"
        row-key="index"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <!-- props.row.name -->
            <!-- props.value -->
            {{ props.col.field }}<br/>
            {{ _get(props.row, props.col.field) }}
            <q-field>
              <template v-slot:control>
                <selector :value="props.row" :field="props.col.field" :label="props.col.label"/>
              </template>
            </q-field>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get, set } from 'lodash'
import selector from '../components/nae-selector'

const columns = [
  { name: 'ref', align: 'center', label: 'Референс', field: 'material.ref', sortable: true, style: 'width: 200px' },
  { name: 'material', align: 'center', label: 'Наименование', field: 'material.label', sortable: true },
  { name: 'qty', align: 'center', label: 'Количество', field: 'qty.number', sortable: false },
  { name: 'cost', align: 'center', label: 'Себестоимость', field: 'cost.number', sortable: false },
]

const rows = ref([])

onMounted(() => {
  rows.value = [
    {
      index: 1,
      material: { ref: "ATV310HU15N4E", label: "Преобраз. частоты ATV310 1,5кВт 380В 3ф" },
      qty: { number: 1 },
      cost: { number: 141.11 },
    },
    {
      index: 2,
      ref: "87393",
      material_label: "ПЕР.ПАНЕЛЬ ЯЩИКА NS630 3P 12M,НЕОКР.",
      qty_label: 1,
      cost_label:  58.60,
    },
    {
      index: 3,
      ref: "140CRA93200",
      material_label: "Адаптер удал. В/В, двойн. кабель",
      qty_label: 1,
      cost_label: 1320.90,
    }
  ]
})

const pagination = ref({
  rowsPerPage: 0
})

const _get = (obj, path) => {
  console.log('obj', obj)
  console.log('path', path)

  let current = obj

  path = path.split('.')
  for (let key of path) {
    if (current[key] !== undefined) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return current;
}
const _set = set

</script>
