<template>
  <div class="row items-center justify-between q-pa-sm">
    <q-btn color="negative" padding="none" size="md" icon="close" @click="coolBye"/>
    <div>{{ $t('hello') + ' ' + $t('world') + ' -[3]- ' + appConfig.APPNAME + ' / ' + appConfig.BUILD}}</div>
  </div>

  <img alt="Vue logo" :src="ano" width="32" height="32" />
  <div class="font-title">Bonjour !</div>
  <div class="font-mono selx btn" @click="resetDh">{{ dx.subClass('roman').name + ' ' + dhs }}</div>

  <div class="row rows-center q-mt-sm">
    <img :src="superman" class="self-start q-mr-sm q-mt-sm" width="24px"/>
    <q-btn class="q-ma-sm primary" flat dense text-color="white" 
      :label="darkClear" @click="swDark"/>
  </div>

  <q-select class="q-ma-sm" filled dense style="width:200px"
    v-model="locOpt" :options="starter.langOptions" :label="$t('lang')" map-options/>

  <q-btn class="q-ma-sm primary" flat dense text-color="white" 
    label="Show Notification" @click="showNotif"/>

</template>

<script setup lang="ts" vapor>
import { inject } from 'vue'
import Stores from '../starter/all'
import { type LangOption } from '../starter/store'
import { coolBye } from '../starter/util'

import { dx } from './registry'
import { ref, type Ref, computed, watch } from 'vue'

import { showNotification } from '../my-register-sw'
import superman from '../assets/img/superman.jpg'
import ano from '../assets/img/anonymous-w.svg'

const appConfig: any = inject('appConfig')
const $t = inject('$t') as Function

const starter = Stores.starter

const storeFooBar = Stores.getDocStore('foo', 'bar')
storeFooBar.docs['123'] = { title: 'Title of 123 '}
console.log('Title :', storeFooBar.getDoc('123').title)
console.log('Title :', storeFooBar.getDoc('456').title)

const locOpt: Ref<LangOption> = ref(starter.curLangOption)
watch(locOpt, (lo) => { starter.setLocale(lo.value) })

const darkClear: Ref<string> = computed(() => $t(starter.isDark ? 'dark' : 'clear'))
const swDark = () => { starter.setDark(!starter.isDark) }

const dh: Ref<number> = ref(0)
const dhs: Ref<string> = computed(() => new Date(dh.value).toISOString())

const resetDh = () => { dh.value = Date.now() }

const showNotif = async () => {
  const href = window.location.href
  await showNotification('My fair notification', { body: 'coucou', data: { url: href }})
}

resetDh()

</script>

<style lang="scss" scoped>
@use '../css/app';
.selx:hover { background-color: $secondary; color: black }
.selx { cursor:pointer !important; background-color: var(--q-primary); }
.btn { border:1px solid black; padding: 2px; }
.primary { background-color: var(--q-primary);}
</style>