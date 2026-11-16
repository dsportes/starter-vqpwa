<!-- Boîte d'affichage des permissions du browser 
 et d'erreur d'acquisition du token webpush -->
<template>
<q-dialog v-model="starter.permDialog" persistent>
<q-card class="pwsm">
  <q-toolbar class="tbp">
    <q-toolbar-title v-if="starter.subsToken.err" class="font-title fs-md">{{$t('PERM_err')}}</q-toolbar-title>
    <q-toolbar-title v-else class="font-title fs-md">
      {{$t('PERM_tit') + ' ' + (starter.notificationAccess || '?')}}</q-toolbar-title>
  </q-toolbar>

  <div class="q-pa-sm" v-if="starter.subsToken.err">
    <div class="font-title fs-md text-italic q-my-md">{{ $t(('PERM_errdet')) }}</div>
    <div class="font-mono fs-sm q-my-md">{{ starter.subsToken.err }}</div>
  </div>

  <div class="q-pa-sm" v-else>
    <div class="font-title fs-md text-italic q-my-md text-center">{{ $t(('PERM_info1')) }}</div>
    <div class="font-def fs-lg text-center ask q-my-md text-bold">
      {{ isPrompt ? $t('PERM_answer') : $t(('PERM_info2'))}}</div>
  </div>

  <div class="column items-center q-gutter-md q-my-md">
    <q-btn dense icon="close" flat color="warning" padding="none"
      class="font-mono fs-md"
      :label="$t('PERM_quit' + (starter.subsToken.err ? '3' : '1'))" 
      @click="coolBye"/>
    <q-btn dense icon="refresh" flat color="warning" padding="none"
      class="font-mono fs-md"
      :label="$t('PERM_quit' + (starter.subsToken.err ? '4' : '2'))" 
      @click="reloadPage"/>
  </div>

</q-card>
</q-dialog>
</template>

<script setup lang="ts" vapor>
import { inject, computed, watch, onMounted} from 'vue'
import { coolBye, reloadPage } from './util'
import { useStarterStore } from './store'

const $t = inject('$t') as Function
const starter = useStarterStore()
const isPrompt = computed(() => starter.notificationAccess === 'prompt')

watch(() => starter.notificationAccess, (v) => {
  if (v === 'granted') starter.permDialog = false
})

watch(isPrompt, async (v) => {
  if (v)
    // D'après MDM safari prend un callback et ne retourne pas de promise
    // comme on n'attend pas le résultat, pas d'await
    Notification.requestPermission()
})

onMounted(async () => {
  if (isPrompt.value) Notification.requestPermission()
})

</script>

<style lang="scss" scoped>
@import '../css/app.scss';
.ask { border: 1px solid $grey; padding: 3px; border-radius: 7px; }
</style>