<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="width: 700px; max-width: 80vw;">
      <q-toolbar class="q-pa-md">
        <q-icon name="person" size="md" class="text-primary"/>
        <q-toolbar-title>{{ title }}</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-separator />
      <q-card-section>
        <!-- {{ form }} -->
        <q-scroll-area style="height: 50vh;">
          <q-form class="q-gutter-md">
            <template v-for="block in props.fields" :key="block.field">
              <template v-if="Array.isArray(block)">
                <div class="row">
                  <template v-for="el in block" :key="el.field">
                    <div class="col">
                      <MultiComponent
                        v-model="clone[el.field]"
                        :label="el.name"
                        :type="el.type"
                      />
                    </div>
                  </template>
                </div>
              </template>
              <MultiComponent v-else
                v-model="clone[block.field]"
                :label="block.name"
                :type="block.type"
              />
            </template>
          </q-form>
        </q-scroll-area>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Save" color="primary" @click="onStore" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import MultiComponent from './MultiComponent.vue';
import { ref, toRefs, watch, watchEffect, reactive, computed, onMounted, onUnmounted } from 'vue'

import { storeToRefs } from 'pinia'
import { useFind, usePagination, useClones } from 'feathers-pinia'

import { useOid } from '../stores/oid'
const { orgId } = storeToRefs(useOid())

const emit = defineEmits(['onStore', 'onclose'])

const props = defineProps({
  title: String,
  fields: Array,
  item: Object,
  store: Object,
})

const oid = computed(() => props.item?.oid)
const clone = ref({})
const save = ref(undefined)

const isOpen = computed({
  get() {
    return props.item !== undefined
  },
  set(value) {
    console.log('set', value)
    if (value == false) {
      doClose()
    }
  }
})

var last_id = ''
// watchEffect(() => {
watch(() => props.item, (item) => {
  console.log('watch item', item)
  const id = item?._id
  if (item) {
    if (id !== last_id) {
      last_id = id

      const { clones, saveHandlers } = useClones(props, {useExisting: false, debug: true})
      const { save_item } = saveHandlers

      if (clones.item) {
        clone.value = clones.item
        save.value = save_item
      } else {
        clone.value = {}
        save.value = undefined
      }
    }
  } else {
    last_id = ''
    clone.value = {}
    save.value = undefined
  }
})

const doClose = () => {
  // console.log('changeState', state)
  
  clone.value = {}
  save.value = undefined
  last_id = ''

  emit('onclose')
}

const onStore = () => {
  let params = { commit: false, query: { oid: oid.value } }
  // console.log('onStore', oid.value, params)
  // if (save.value) { 
  //  // update existing
  //  save.value(undefined, params)
  //    .then(r => {
  //      console.log('done')
  //      doClose()
  //    })
  //    .catch(e => console.log('e', e))
  //}
  const item = new props.store.Model(clone.value)
  item.save({query: { oid: oid.value }})
    .then(r => doClose())
    .catch(e => {
      console.log(e)
      // error.value = e
    })
}

const onkey = e => {
  // e.ctrlKey
  if (e.metaKey && e.key === 's') {
    e.preventDefault();
    onStore()
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
</style>