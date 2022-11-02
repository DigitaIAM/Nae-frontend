<template>
  <q-card>
    <q-card-section horizontal>
      <div class="row fit">
        <div class="col">
          <div class="q-pr-sm text-h2 text-right">{{ day }}</div>
        </div>
        <div class="col">
          <div class="text-subtitle1">{{ month }}</div>
          <div class="text-subtitle1 text-grey">{{ dayOfWeek }}</div>
        </div>
      </div>
    </q-card-section>
    
    <q-separator/>
    
    <q-card-section horizontal>
      <DoughnutChart :chartData="сhartData" :options="options" />
    </q-card-section>
    
    <!-- <q-separator/> -->

    <q-card-section horizontal>
      <div class="row fit text-center">
        <div class="col">
          <hr size="5px" color="green" style="margin: 0;"/>
          <div class="text-h6">32</div>
          <div class="text-caption">на работе</div>
        </div>
        <q-separator vertical />
        <div class="col">
          <hr size="5px" color="red" style="margin: 0;" />
          <div class="text-h6">3</div>
          <div class="text-caption">отсутствуют</div>
        </div>
        <q-separator vertical />
        <div class="col">
          <hr size="5px" color="blue" style="margin: 0;" />
          <div class="text-h6">5</div>
          <div class="text-caption">опоздали</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watchEffect, reactive, computed, onMounted, onUnmounted } from 'vue'

import { useFind, usePagination } from 'feathers-pinia'
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from "chart.js"
import moment from 'moment'

const now = ref(moment())

const dayOfWeek = computed(() => now.value.format('dddd'))
const day = computed(() => now.value.format('D'))
const month = computed(() => now.value.format('MMMM'))

Chart.register(...registerables);

const options = ref({
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top',
    },
    title: {
      display: false,
      text: 'Chart.js Doughnut Chart',
    },
  },
});

const сhartData = {
  labels: ['на работе', 'отсутствуют', 'опоздали'],
  datasets: [{
    data: [32, 3, 5],
    backgroundColor: ['green', 'red', 'blue'],
  }],
}

</script>

<style lang="sass" scoped>
</style>