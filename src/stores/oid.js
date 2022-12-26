import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useСompanies } from './companies'

const orgs = useСompanies();

export const useOid = defineStore({
  id: 'selected-organization',
  state: () => ({
    myData: { oids: [], selected: undefined }, // useLocalStorage('oid', null),
    org: {},
    loading: false,
    error: null,
  }),
  getters: {
    oid(state) {
      if (state.myData.selected) {
        return state.myData.selected;
      } else {
        return state.myData.oids[0];
      }
    }
  },
  actions: {
    setOid(oids, selected) {
      const oid = selected || oids[0]
      Object.assign(this.myData, { oids: oids, selected: oid });

      orgs.get(oid)
        .then(data => {
          Object.assign(this.org, data);
        })
        .catch(e => {
          console.log('error', e);
          Object.assign(this.org, {});
        })
    },
    selectOrganization(org) {
      this.setOid(this.myData.oids, org?._id)
    },
  },
})