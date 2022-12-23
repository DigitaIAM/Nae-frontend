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
      :store="cameras"
      :cols="[
        { name: 'name', label: 'name', field: 'name', required: true, align: 'center', sortable: false},
        { name: 'ip', label: 'ip', field: 'ip', required: true, align: 'center', sortable: false},
        { name: 'port', label: 'port', field: 'port', required: true, align: 'center', sortable: false},
        { name: 'enabled', label: 'enabled', field: 'enabled', required: true, align: 'center', sortable: false},
        { name: 'status', label: 'status', field: row => statusLabel(row.status), required: true, align: 'center', sortable: false},
      ]"
      :fields="[
        { name: 'Name', type: 'text', field: 'name' },
        { name: 'enabled', type: 'toggle', field: 'enabled' },
        { name: 'eventType', type: 'text', field: 'eventType' },
        { name: 'devIndex', type: 'text', field: 'devIndex' },
        [
          { name: 'protocol', type: 'text', field: 'protocol' },
          { name: 'ip', type: 'text', field: 'ip' },
          { name: 'port', type: 'text', field: 'port' },
        ],
        [
          { name: 'username', type: 'text', field: 'username' },
          { name: 'password', type: 'password', field: 'password' },
        ]
      ]"
      :context="{ oid: oid }"
    />
  </q-page>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import TimeAgo from 'javascript-time-ago'
import { storeToRefs } from 'pinia'
import { useFind, usePagination, useClones } from 'feathers-pinia'

import JornalAndForm from '../../components/JornalAndForm.vue';

import { useActions } from '../../stores/actions'
import { useOid } from '../../stores/oid'
import { useCameras } from '../../stores/cameras'

const cameras = useCameras()

const { oid } = storeToRefs(useOid())

const timeAgo = new TimeAgo('en-US')

const statusLabel = (status) => {
  if (status) {
    console.log('status.ts', status)
    return status.name + ' ' + timeAgo.format(status.ts * 1000)
  } else {
    return {name: 'unknown', ts: 0}
  }
}

const pass = ref('')
const actions = useActions();
const list_devices = () => {
  const item = new actions.Model({command: 'list_devices', params: {protocol: 'http', ip: '195.158.8.222', port: "7005", username: 'admin', password: pass.value}})
  item.save()
}

const handlePatched = (item) => {
  console.log('patched', item)
}
actions.Model.on('patched', handlePatched)
onBeforeUnmount(() => {
  actions.Model.off('patched', handlePatched)
})

</script>


<style lang="sass" scoped>
</style>
