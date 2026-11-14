<template>
<div class="column items-center"><div class="wsm">
  <div class="row items-center justify-between q-pa-sm">
    <q-btn color="negative" padding="none" size="md" icon="close" @click="coolBye"/>
    <div class="font-title fs-md">{{ $t('hello') + ' ' + $t('world') + ' -[3]- ' + appConfig.APPNAME + ' / ' + appConfig.BUILD}}</div>
  </div>

  <div class="row justify-around items-center">
    <img alt="Vue logo" :src="ano" width="32" height="32" />
    <div class="myprimary fs-md">{{ dx.docCl + ' - ' + starter.screenWidth + '/' + starter.screenHeight }}</div>
    <q-btn class="q-ma-sm" flat dense color="primary"
      :label="dhs" @click="resetDh"/>
  </div>

  <div class="row items-center q-mt-sm justify-around">
    <img :src="superman" class="q-mr-sm" width="24px"/>
    <q-btn class="q-ma-sm primary" dense color="primary" size="md"
      :label="$t(starter.isDark ? 'dark' : 'clear')" 
      @click="starter.setDark(!starter.isDark)"/>
  </div>

  <div class="row items-center q-mt-sm justify-around">
    <q-select filled dense style="width:200px"
      v-model="locOpt" :options="starter.langOptions" :label="$t('lang')" map-options/>
    <q-btn flat dense color="primary" label="Show Notification" @click="showNotif"/>
  </div>
</div></div>
</template>

<script setup lang="ts" vapor>
import { ref, type Ref, computed, watch, inject } from 'vue'

import Stores from '../starter/all'
import { type LangOption } from '../starter/store'
import { coolBye } from '../starter/util'

import { dx } from './registry'
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
@import '../css/app';
.myprimary:hover { background-color: $secondary; color: white}
.border { border:1px solid var(--q-primary); padding: 2px; }
.myprimary { background-color: $mdtitle; color: black}
</style>