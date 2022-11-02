import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { setupFeathersPinia } from 'feathers-pinia'
import { api } from '../feathers'

export const pinia = createPinia()

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  // const pinia = createPinia()

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia
})

export const { defineStore, BaseModel } = setupFeathersPinia({
  ssr: true,
  clients: { api },
  idField: '_id',
  whitelist: ['$regex', '$options'],
})
