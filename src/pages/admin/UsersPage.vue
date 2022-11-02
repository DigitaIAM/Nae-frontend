<template>
  <q-page padding>
    <suspense key="users">
      <jornal-and-form
        singular-title="User"
        plural-title="Users"
        :store="store"
        :cols="[
          { name: 'email', label: 'email', field: 'email', required: true, align: 'center', sortable: false},
          { name: 'name', label: 'name', field: 'name', required: true, align: 'center', sortable: false},
          { name: 'organization', label: 'organization', field: 'organization', required: true, align: 'center', sortable: false},
          { name: 'role', label: 'role', field: 'role', required: true, align: 'center', sortable: false},
        ]"
        :fields="[
          { name: 'Name', type: 'text', field: 'name' },
          { name: 'Organization', type: 'combo', zone: 'organization', field: 'organization' },
          { name: 'Department', type: 'combo', zone: 'department', field: 'Department' },
          { name: 'email', type: 'text', field: 'email' },
          { name: 'Password', type: 'password', field: 'password' },
        ]"
      />
      <!-- form.item.name -->
    </suspense>
  </q-page>
</template>

<script setup>
import JornalAndForm from '../../components/JornalAndForm.vue';
import { useUsers } from '../../stores/users'

const store = useUsers()
</script>


<style lang="sass" scoped>
</style>
