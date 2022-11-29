<template>
  <q-layout class="bg-grey-1" view="hHh lpR fFf">
    <q-header elevated class="text-white" style="background: #24292e" height-hint="61.59">
      <q-toolbar class="q-py-sm q-px-md">
        <q-btn
          flat
          dense
          round
          :ripple="false"
          size="19px"
          color="white"
          class="q-mr-sm"
          no-caps
          @click="drawer = !drawer"
        >苗</q-btn>

        <q-select
          ref="search" dark dense standout use-input hide-selected
          class="GL__toolbar-select"
          color="black" :stack-label="false" label="Search or jump to..."
          v-model="text" :options="filteredOptions" @filter="filter"
          style="width: 300px"
        >
          <template v-slot:append>
            <img src="https://cdn.quasar.dev/img/layout-gallery/img-github-search-key-slash.svg">
          </template>

          <template v-slot:no-option>
            <q-item>
              <q-item-section>
                <div class="text-center">
                  <q-spinner-pie
                    color="grey-5"
                    size="24px"
                  />
                </div>
              </q-item-section>
            </q-item>
          </template>

          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              class="GL__select-GL__menu-link"
            >
              <q-item-section side>
                <q-icon name="collections_bookmark" />
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="scope.opt.label" />
              </q-item-section>
              <q-item-section side :class="{ 'default-type': !scope.opt.type }">
                <q-btn outline dense no-caps text-color="blue-grey-5" size="12px" class="bg-grey-1 q-px-sm">
                  {{ scope.opt.type || 'Jump to' }}
                  <q-icon name="subdirectory_arrow_left" size="14px" />
                </q-btn>
              </q-item-section>
            </q-item>
          </template>

        </q-select>

        <q-space />

        {{ name }}

        <q-space />

        <div class="q-pl-sm q-gutter-sm row items-center no-wrap">
          <q-btn v-if="$q.screen.gt.xs" dense flat round size="sm" icon="notifications" />

          <q-btn dense flat no-wrap>
            <q-avatar rounded size="20px">
              <img src="https://cdn.quasar.dev/img/avatar3.jpg">
            </q-avatar>
            <q-icon name="arrow_drop_down" size="16px" />

            <q-menu auto-close>
              <q-list dense>
                <q-item class="GL__menu-link-signed-in">
                  <q-item-section>
                    <div>Signed in as <strong>Mary</strong></div>
                  </q-item-section>
                </q-item>
                <q-separator />

                <q-item clickable class="GL__menu-link">
                  <q-item-section>Sign out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay

      :width="200"
      :breakpoint="500"
      bordered
      class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <template v-for="(item, index) in menu">
            <q-separator v-if="item.separator" :key="index" />
            <EssentialLink
              v-else
              :key="item.label"
              :title="item.label"
              :icon="item.icon"
              :link="item.link"
            />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import EssentialLink from '../components/EssentialLink.vue'

import { computed, ref } from 'vue'

import { storeToRefs } from 'pinia'

import { useOid } from '../stores/oid'

const { org } = storeToRefs(useOid())
const name = computed(() => {
  console.log('org', org.value)
  if (org.value) { 
    return org.value.name || ''
  } else {
    return ''
  }
})

const menu = [
  { label: 'Users', icon: 'person', link: '/admin/users' },
  { label: 'Companies', icon: 'corporate_fare', link: '/admin/companies' },
  { separator: true },
  { label: 'Cameras', icon: 'camera', link: '/admin/cameras' },
  { label: 'Shifts', icon: 'calendar_month', link: '/admin/shifts' },
  { label: 'People', icon: 'people', link: '/admin/people' },
  { label: 'Events', icon: 'inbox', link: '/admin/events' },
  { separator: true },
  { label: 'Attendance', icon: 'inbox', link: '/admin/attendance' },
]

const drawer = ref(false)
const miniState = ref(true)

const text = ref('')
const options = ref(null)
const filteredOptions = ref([])
const search = ref(null) // $refs.search

function filter (val, update) {
  if (options.value === null) {
    // load data
    setTimeout(() => {
      options.value = stringOptions
      search.value.filter('')
    }, 2000)
    update()
    return
  }

  if (val === '') {
    update(() => {
      filteredOptions.value = options.value.map(op => ({ label: op }))
    })
    return
  }

  update(() => {
    filteredOptions.value = [
      {
        label: val,
        type: 'In documents'
      },
      {
        label: val,
        type: 'In '
      },
      ...options.value
        .filter(op => op.toLowerCase().includes(val.toLowerCase()))
        .map(op => ({ label: op }))
    ]
  })
}
</script>

<style lang="sass">
.GL
  &__select-GL__menu-link
    .default-type
      visibility: hidden
    &:hover
      background: #0366d6
      color: white
      .q-item__section--side
        color: white
      .default-type
        visibility: visible

  &__toolbar-link
    a
      color: white
      text-decoration: none
      &:hover
        opacity: 0.7
  &__menu-link:hover
    background: #0366d6
    color: white

  &__menu-link-signed-in,
  &__menu-link-status
    &:hover
      & > div
        background: white !important
  &__menu-link-status
    color: $blue-grey-6
    &:hover
      color: $light-blue-9

  &__toolbar-select.q-field--focused
    width: 450px !important
    .q-field__append
      display: none
</style>