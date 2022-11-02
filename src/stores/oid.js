import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useСompanies } from './companies'

const orgs = useСompanies();

export const useOid = defineStore({
  id: 'selected-organization',
  state: () => ({
    orgId: useLocalStorage('oid', null),
    loading: false,
    error: null,
  }),
  getters: {
    org(state) {
      return state.orgId ? orgs.getFromStore(state.orgId) : undefined
    }
  },
  actions: {
    selectOrganization(org) {
      console.log('org', org._id);
      if (org._id) {
        this.orgId = org._id
      } else {
        org._id = null
      }
    },
  },
})