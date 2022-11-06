<template>
  <q-dialog v-model="visiable" @update:model-value="onClose">
    <q-card style="width: 700px; max-width: 80vw; height: 72vh;">
      <q-toolbar class="q-pa-md">
        <q-icon name="person" size="md" class="text-primary"/>
        <q-toolbar-title>{{ title }}</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-separator />
      <q-card-section>
        <q-scroll-area style="height: 50vh;">
          <div v-if="view === 'camera'">
            <PhotoFromCamera :url="pictureUrl" @uploaded="view = 'form'"/>
            <q-btn label="cancel" @click="view = 'form'" />
          </div>
          <div v-else-if="view === 'file'">
            <q-uploader
              label="Photo"
              style="max-width: 300px"
              :url="pictureUrl"
              accept="image/jpeg"
              :max-files="1"
              :max-file-size="1024*200"
              @uploaded="() => { count += 1; view = 'form'; }"
            />
            <q-btn label="cancel" @click="view = 'form'" />
          </div>
          <q-form class="q-gutter-md" v-else>
            <div class="row" v-for="error in tasks.errors" :key="error">
              {{ error }}
            </div>
            <div class="row">
              <div class="col">
                <div class="row" v-for="el in fields" :key="el.name">
                  <MultiComponent
                    v-model="clone[el.field]"
                    :label="el.name"
                    :type="el.type"
                    class="full-width q-pa-sm"
                  />
                </div>
              </div>
              <div class="col-3 text-center q-pa-sm q-gutter-sm">
                <q-img
                  :src="pictureUrl"
                  spinner-color="white"
                  style="height: 160px; max-width: 140px"
                />
                <q-btn label="upload photo" @click="view = 'file'" class="full-width"/>
                <q-btn label="capture photo" @click="view = 'camera'" class="full-width"/>
              </div>
            </div>
          </q-form>
        </q-scroll-area>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Register on cameras" color="primary"
          @click="onRegisterUser"
          :disable="loading"
          :loading="loading"
          :percentage="percentage"
        />
        <!-- <q-btn flat label="Register picture" :icon="pictureRegistered" color="primary" @click="onRegisterPicture" :disable="isDisabled" /> -->
        <q-btn flat label="Save" color="primary" @click="onStore" />
        <q-btn flat label="Close" @click="onClose" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import PhotoFromCamera from 'src/components/PhotoFromCamera.vue';
import MultiComponent from '../../components/MultiComponent.vue';
import { ref, toRefs, watchEffect, reactive, computed, onMounted, onBeforeUnmount, onUnmounted } from 'vue'

import { storeToRefs } from 'pinia'
import { useClones } from 'feathers-pinia'

import { api } from 'src/feathers'
import { useActions } from '../../stores/actions'
import { useCameras } from 'src/stores/cameras'

import { dataUrl } from 'src/feathers'

const fields = [
  { name: 'Name', type: 'text', field: 'name' },
  { name: 'Position', type: 'text', field: 'position' },
  { name: 'Division', type: 'text', field: 'division' },
  { name: 'Sub-division', type: 'text', field: 'sub_division' },
]

const emit = defineEmits(['onclose'])

const props = defineProps({
  title: String,
  // fields: Array,
  item: Object,
})

const view = ref('')

const oid = ref('')
const pid = ref('')
const clone = ref({})
const save = ref(undefined)

const count = ref(0)
const pictureUrl = computed(() => dataUrl+"/v1/picture?oid="+oid.value+"&pid="+pid.value+"&r="+count.value)

const visiable = computed(() => props.item !== undefined)
watchEffect(() => {
  console.log('clones', props.item)
  const { clones, saveHandlers } = useClones({item: props.item}, {useExisting: false, debug: true})
  if (clones.item) {
    oid.value = clones.item.oid
    pid.value = clones.item._id
    clone.value = clones.item
    const { save_item } = saveHandlers
    save.value = save_item
  } else {
    oid.value = ''
    pid.value = ''
    clone.value = {}
    save.value = undefined
  }
}, [props.item])

const onStore = () => {
  let params = { commit: false, query: { oid: oid.value } }
  save.value(undefined, params)
    .then(r => onClose())
    .catch(e => {
      console.log(e)
      error.value = e
    })
}

const onClose = () => {
  tasksReset()

  view.value = 'form'
  emit('onclose')
}

const tasks = reactive({
  total: 0,
  complited: 0,

  requests: [],
  errors: [],
})
const tasksReset = () => {
  tasks.total = 0
  tasks.complited = 0
  tasks.requests = []
  tasks.errors = []
}

const loading = computed(() => tasks.total != 0 && tasks.total != tasks.complited)
const percentage = computed(() => tasks.complited / tasks.total)
const userRegistered = computed(() => tasks.total != 0 && tasks.total === tasks.complited)

const cameras = api.service('cameras')
const actions = api.service('actions')

const onRegisterUser = () => {
  tasksReset()
  tasks.total = -1
  cameras.find({query:{oid: oid.value}})
    .then(res => {
      let cams = (res.data || [])
      tasks.total = cams.length
      cams.forEach(cam => {
        actions
          .create({command: 'hikvision-create_user', params: {oid: oid.value, cid: cam._id, pid: pid.value}})
          .then(task => {
            console.log('onRegisterUser task', task)
            tasks.requests.push(task)
          })
          .catch(e => {
            console.log('error at onRegisterUser', e)
            tasks.complited += 1
          })
      });
    })
}

const registerImage = (cid) => {
  tasks.total += 1
  actions
    .create({command: 'hikvision-register_image', params: {oid: oid.value, cid: cid, pid: pid.value}})
    .then(task => {
      console.log('onRegisterPicture task', task)
      tasks.requests.push(task)
    })
    .catch(e => {
      console.log('error at registerImage', e)
      tasks.complited += 1
    })
}

const handlePatched = (task) => {
  console.log('patched', task)
  if (task?.state?.status === 'completed') {
    tasks.complited += 1
    for (const i in tasks.requests) {
      const t = tasks.requests[i]
      if (task?._id === t._id) {
        tasks.requests.splice(i, 1)
      }
    }
    if (task?.command === 'hikvision-create_user') {
      console.log('hikvision-create_user')
      if (task.state?.status === 'completed') {
        console.log('completed')
        const answer = task?.data?.UserInfoOutList?.UserInfoOut ?? []
        const msg = answer[0]?.errorMsg
        if (!(msg === 'Operation completed.' || msg === 'deviceUserAlreadyExist' || msg === 'employeeNoAlreadyExist')) {
          console.log('error', msg || item?.data)
          tasks.errors.push(msg || item?.data)
        } else {
          console.log('registerImage', task?.params?.cid)
          registerImage(task?.params?.cid)
        }
      }
    } else if (task?.command === 'hikvision-register_image') {
      console.log('hikvision-register_image')
      if (task.state?.status === 'completed') {
        console.log('completed')
        const msg = task?.data?.errorMsg
        if (!(msg === 'Operation completed.')) {
            tasks.error = msg || item?.data
        }
      }
    }
  }
  // TODO check for error
}
actions.on('patched', handlePatched)
onBeforeUnmount(() => {
  actions.off('patched', handlePatched)
})

const onkey = (e) => {
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
