<template>
  <template v-if="type === 'toggle'">
    <q-toggle
      :modelValue="modelValue"
      @update:model-value="updateValue"
      color="green"
      :label="label"
      left-label
    />
  </template>
  <q-input v-else
    outlined
    :modelValue="modelValue"
    @update:model-value="updateValue"
    :label="label"
    :type="type"
  />
</template>

<script setup>
import { ref, watchEffect, reactive, computed, onMounted, onUnmounted } from 'vue'

import { useFind, usePagination } from 'feathers-pinia'

const props = defineProps({
  type: String,
  label: String,
  modelValue: [String, Number, Boolean],
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (value) => {
  // console.log('updateValue', value)
  emit('update:modelValue', value)
}

</script>

<style lang="sass" scoped>
</style>