import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useCompanies } from './companies'

const orgs = useCompanies();

export const useOid = defineStore({
  id: 'profile',
  state: () => ({
    myData: useStorage(
      'orgs',
      { uid: undefined, oids: [], selected: undefined },
      localStorage,
      {
        mergeDefaults: true,
        serializer: {
          read: (v) => {
            console.log('read', v)
            return v ? JSON.parse(v) : null
          },
          write: (v) => {
            console.log('write', v)
            console.log('write', JSON.stringify(v.value))
            return JSON.stringify(v.value)
          },
        },
      }
    ), // { oids: [], selected: undefined },
    org: {},
    loading: false,
    error: null,
  }),
  getters: {
    oid(state) {
      const data = state.myData
      if (data.selected) {
        return data.selected;
      } else {
        return data.oids[0];
      }
    }
  },
  actions: {
    setUser(user) {
      const id = user?._id
      const oids = user?.oids || []

      let oid = oids[0]
      if (id && this.myData.uid === id) {
        oid = this.myData.selected || oid
      }
      this.myData.value = { uid: id, oids: oids, selected: oid }

      if (oid) {
        orgs.get(oid)
          .then(data => Object.assign(this.org, data))
          .catch(e => Object.assign(this.org, {}))
      } else {
        Object.assign(this.org, {});
      }
    },
    selectOrganization(org) {
      const oid = org?._id
      Object.assign(this.myData.value, { selected: oid })
      Object.assign(this.org, org || {})
    },
  },
})
