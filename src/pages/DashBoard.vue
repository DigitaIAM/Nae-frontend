<template>
  <q-page padding>
    <div class="row red">
      <div class="col-2 q-pr-md">
        <today-chart/>
      </div>
      <q-space/>
      <div class="col-10 ">
        <journal-and-form
          singular-title="Добавить"
          plural-title="Сегодня"
          :store="store"
          :cols="[
            { name: 'name', label: 'сотрудник', field: 'name', required: true, align: 'center', sortable: false},
            { name: 'name', label: 'время прихода', field: 'name', required: true, align: 'center', sortable: false},
            { name: 'name', label: 'время ухода', field: 'name', required: true, align: 'center', sortable: false},
            { name: 'name', label: 'опоздание', field: 'name', required: true, align: 'center', sortable: false},
            { name: 'name', label: 'ранний уход', field: 'name', required: true, align: 'center', sortable: false},
          ]"
          :fields="[
            { name: 'Сотрудник', type: 'combo', field: 'employee' },
            { name: 'Локация', type: 'combo', field: 'location' },
            { name: 'Дата', type: 'date', field: 'dt' },
            { name: 'Время', type: 'time', field: 'dt' },
            { name: 'Комментарий', type: 'text', field: 'comment' },
            [
              { name: 'Приход', type: 'button', field: 'comment' },
              { name: 'Уход', type: 'button', field: 'comment' },
            ]
          ]"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref, reactive } from 'vue'

import TodayChart from 'src/components/TodayChart.vue';

import JournalAndForm from 'src/components/JournalAndForm.vue';
import { usePeople } from '../stores/people'

const store = usePeople()

</script>


<style scoped>
</style>
