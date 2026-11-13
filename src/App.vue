<template>
  <home-page/>
  <new-version v-if="nv"/>
  <permission-box v-if="pb"/>
</template>

<script setup lang="ts" vapor>
import { inject, provide, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useStarterStore } from './starter/store'
import { setup } from './starter/util'
import HomePage from './demo/HomePage.vue'
import NewVersion from './starter/NewVersion.vue'
import PermissionBox from './starter/PermissionBox.vue'

import { test } from './demo/registry.ts'

const appConfig: any = inject('appConfig')
const i18n = useI18n()
const $q = useQuasar()
const $t = i18n.t

const starter = useStarterStore()
starter.init(i18n, $q)
setup(starter, $t, appConfig)

test()

provide('i18n', i18n)
provide('$t', $t)
provide('$q', $q)

const pb = computed(() => starter.permDialog)
const nv = computed(() => starter.newVersionDialog)

</script>

<style lang="scss" scoped>
@use './css/app';
</style>