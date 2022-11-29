<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page>
        <div class="row" style="height: 90vh">
          <div class="col flex content-center justify-center">
            <q-card v-bind:style="$q.screen.lt.sm ? {'width': '80%'} : {'width': '70%'}" style="max-width: 500px">
              <q-card-section>
                <q-avatar size="101px" class="absolute-center shadow-10">
                  <img src="/ishtar-symbol.svg" alt="avatar">
                </q-avatar>
              </q-card-section>
              <template v-if="login.error">
                <q-card-section>
                  <div class="q-pt-lg">
                    <div class="col text-h6 ellipsis flex justify-center">
                      <h2 class="text-h4 text-uppercase q-my-none text-weight-regular">Error</h2>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="text-center q-mt-sm q-gutter-lg q-pb-lg">
                    <div>{{ login.error }}</div>
                  </div>
                  <div>
                    <q-btn class="full-width" color="red" label="ok" rounded @click="login.error=''"></q-btn>
                  </div>
                </q-card-section>
              </template>
              <template v-else>
                <q-card-section>
                  <div class="q-pt-lg">
                    <div class="col text-h6 ellipsis flex justify-center">
                      <h2 class="text-h4 text-uppercase q-my-none text-weight-regular">Login</h2>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <q-form class="q-gutter-md" @submit.prevent="fnLogin">
                    <q-input label="Username" v-model="login.username">
                    </q-input>
                    <q-input label="Password" type="password" v-model="login.password">
                    </q-input>
                    <div>
                      <!-- <q-btn class="full-width" color="primary" label="Login" type="submit" rounded></q-btn> -->
                      <q-btn class="q-pa-sm" style="width:70%" label="Login" color="primary" type="submit" rounded/>
                      <q-btn class="q-pa-sm" style="width:20%" label="Sign Up" rounded @click="fnRegister"/>
                      <!-- <div class="text-center q-mt-sm q-gutter-lg">
                        <router-link class="text-black" to="/login">Forgot your password?</router-link>
                        <router-link class="text-black" to="/login">Create Account</router-link>
                      </div> -->
                    </div>
                  </q-form>
                </q-card-section>
              </template>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

import { useAuth } from '../stores/auth'
import { useUsers } from '../stores/users'

const $q = useQuasar()
const router = useRouter()

const login = reactive({
  username: '',
  password: '',
  error: '',
})

const auth = useAuth()
const users = useUsers()

const fnLogin = () => {
  $q.loadingBar.start()
  auth.authenticate({
    strategy: 'local',
    email: login.username,
    password: login.password,
  })
    .then(msg => router.push({ path: '/admin' }))
    .catch(err => {
      if (err.message) {
        login.error = err.message
      } else {
        login.error = err
      }
    })
    .finally(() => $q.loadingBar.stop())
}

const fnRegister = () => {
  $q.loadingBar.start()
  users.create({
    email: login.username,
    password: login.password,
  })
    .then(msg => console.log('then', msg))
    .catch(err => {
      console.log(err)
      console.log('catch', err)
      if (err.message) {
        login.error = err.message
      } else {
        login.error = err
      }
    })
    .finally(() => $q.loadingBar.stop())
}

</script>


<style scoped>
</style>
