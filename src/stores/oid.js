import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useСompanies } from './companies'

const orgs = useСompanies();

export const useOid = defineStore({
  id: 'selected-organization',
  state: () => ({
    myData: { oids: [] }, // useLocalStorage('oid', null),
    org: {},
    loading: false,
    error: null,
  }),
  getters: {
    oid(state) {
      return state.myData.oids[0]
    }
  },
  actions: {
    setOid(oids, selected) {
      const oid = selected || oids[0]
      Object.assign(this.myData, { oids: oids, selected: undefined });

      orgs.get(oid)
        .then(data => {
          Object.assign(this.org, data);
        })
        .catch(e => {
          console.log('error', e)
        })
    },
    selectOrganization(org) {
      setOid(this.myData.oids, org?._id)
    },
  },
})