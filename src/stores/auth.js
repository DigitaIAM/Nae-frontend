import { defineAuthStore } from 'feathers-pinia'
import { api as feathersClient } from '../feathers'
import { useUsers } from './users'

const users = useUsers();

export const useAuth = defineAuthStore({
  feathersClient,
  state: () => ({
    userId: null
  }),
  getters: {
    me(state) {
      return state.userId ? users.getFromStore(state.userId) : undefined
    },
  },
  actions: {
    handleResponse(response) {
      if (response.user) {
        this.userId = response.user.id || response.user._id
        const user = Object.assign({}, response.user);
        users.addToStore(user)
      } else {
        this.userId = undefined
      }
      return response
    },
  },
})