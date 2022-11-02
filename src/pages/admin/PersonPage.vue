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
            <div class="row">
              {{ tasks.error }}
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
        <q-btn flat label="Register user" :icon="userRegistered" color="primary" @click="onRegisterUser" :disable="isDisabled"/>
        <q-btn flat label="Register picture" :icon="pictureRegistered" color="primary" @click="onRegisterPicture" :disable="isDisabled" />
        <q-btn flat label="Save" :icon="saved" color="primary" @click="onStore" />
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

import { useActions } from '../../stores/actions'
import { useCameras } from 'src/stores/cameras';

const backendUrl = "http://localhost:3030";

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
  visiable: Boolean,
})

const view = ref('')

const oid = ref('')
const pid = ref('')
const clone = ref({})
const save = ref(undefined)

const count = ref(0)
const pictureUrl = computed(() => backendUrl+"/v1/picture?oid="+oid.value+"&pid="+pid.value+"&r="+count.value)

const { visiable } = toRefs(props)
watchEffect(() => {
  // console.log('clones', props.item)
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
  tasks.done = ''
  let params = { commit: false, query: { oid: oid.value } }
  save.value(undefined, params)
    .then(r => {
      emit('onclose')
      // console.log(r)
      // tasks.done = r?.wasDataSaved ? 'saved' : ''
    })
    .catch(e => {
      console.log(e)
      error.value = e
    })
}

const onClose = () => {
  tasks.id = ''
  tasks.requests = []
  tasks.error = ''
  tasks.done = ''

  view.value = 'form'
  emit('onclose')
}

const tasks = reactive({
  id: '',
  requests: [],
  error: '',
  done: '',
})
const isDisabled = computed(() => tasks.id !== '')
const userRegistered = computed(() => tasks.done === 'onRegisterUser' ? 'done' : '')
const pictureRegistered = computed(() => tasks.done === 'onRegisterPicture' ? 'done' : '')
const saved = computed(() => tasks.done === 'saved' ? 'done' : '')

const cameras = useCameras();
const actions = useActions();
const onRegisterUser = () => {
  tasks.done = ''
  tasks.id = 'onRegisterUser'
  cameras.find({query:{oid: oid.value}})
    .then(res => {
      (res.data || []).forEach(cam => {
        const item = new actions.Model({command: 'create_user', params: {oid: oid.value, cid: cam._id, pid: pid.value}})
        item.create().then(task => tasks.requests.push(task))
      });
    })
}

const onRegisterPicture = () => {
  tasks.done = ''
  tasks.id = 'onRegisterPicture'
  cameras.find({query:{oid: oid.value}})
    .then(res => {
      (res.data || []).forEach(cam => {
        const item = new actions.Model({command: 'register_picture', params: {oid: oid.value, pid: pid.value}})
        item.create().then(task => tasks.requests.push(task))
      });
    })
}

const handlePatched = (item) => {
  console.log('patched', item)
  if (item?.state?.status === 'completed') {
    for (const i in tasks.requests) {
      const task = tasks.requests[i]
      if (task._id === item._id) {
        tasks.requests.splice(i, 1)
      }
    }
    if (tasks.id === 'onRegisterUser') {
      const answer = item?.data?.UserInfoOutList?.UserInfoOut ?? []
      const msg = answer[0]?.errorMsg
      if (!(msg === 'Operation completed.' || msg === 'deviceUserAlreadyExist' || msg === 'employeeNoAlreadyExist')) {
        tasks.error = msg || item?.data
      }
    } else if (tasks.id === 'onRegisterPicture') {
      const msg = item?.data?.errorMsg
      if (!(msg === 'Operation completed.')) {
          tasks.error = msg || item?.data
      }
    }
    if (tasks.id && tasks.requests.length === 0) {
      tasks.done = tasks.id
      tasks.id = ''
    }
  }
  // TODO check for error
}
actions.Model.on('patched', handlePatched)
onBeforeUnmount(() => {
  actions.Model.off('patched', handlePatched)
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