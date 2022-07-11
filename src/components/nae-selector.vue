<template>
  <q-select
    dark dense standout use-input hide-selected
    color="black" :stack-label="false" :label="label"
    v-model="text" :options="filteredOptions" @filter="filter"
    style="width: 300px"
  >
  </q-select>
</template>

<script>
import { ref, toRefs } from 'vue'

export default {
  name: 'nae-selector',
  props: ['value', 'field'],
  setup (props) {
    const { value, field, label } = toRefs(props)

    const text = ref('')
    const options = ref(null)
    const filteredOptions = ref([])
    const search = ref(null) // $refs.search


    function filter (val, update) {
      if (options.value === null) {
        // load data
        setTimeout(() => {
          options.value = [{ref: '1', label: 'test #1'}, {ref: '2', label: 'test #2'}]
          search.value.filter('')
        }, 2000)
        update()
        return
      }

      if (val === '') {
        update(() => {
          filteredOptions.value = options.value
        })
        return
      }

      update(() => {
        filteredOptions.value = [
          ...options.value
            .filter(op => op.label.toLowerCase().includes(val.toLowerCase()))
        ]
      })
    }

    return {
      label,
      text,
      options,
      filteredOptions,
      search,

      filter
    }
  }
}
</script>
