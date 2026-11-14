<!-- Boîte d'affichage des permissions du browser 
 et d'erreur d'acquisition du token webpush -->
<template>
<q-dialog v-model="starter.permDialog" persistent>
<q-card class="pwsm">
  <q-toolbar class="tbp">
    <q-toolbar-title v-if="starter.errSubJSON" class="font-title fs-md">{{$t('PERM_err')}}</q-toolbar-title>
    <q-toolbar-title v-else class="font-title fs-md">{{$t('PERM_tit')}}</q-toolbar-title>
  </q-toolbar>

  <div class="q-pa-sm" v-if="starter.errSubJSON">
    <div class="font-title fs-md text-italic q-my-md">{{ $t(('PERM_errdet')) }}</div>
    <div class="font-mono fs-sm q-my-md">{{ starter.errSubJSON }}</div>
  </div>

  <div class="q-pa-sm" v-else>
    <div class="font-title fs-md text-italic q-my-md text-center">{{ $t(('PERM_info1')) }}</div>
    <div v-if="asking" class="font-def fs-xl text-center ask q-my-md text-bold">{{ $t('PERM_answer') }}</div>
    <div v-else class="font-def fs-md q-my-md">{{ $t(('PERM_info2')) }}</div>
  </div>

  <div class="column items-center q-gutter-md q-my-md">
    <q-btn dense icon="close" flat color="warning" padding="none"
      class="font-mono fs-md"
      :label="$t('PERM_quit' + (starter.errSubJSON ? '3' : '1'))" 
      @click="coolBye"/>
    <q-btn dense icon="refresh" flat color="warning" padding="none"
      class="font-mono fs-md"
      :label="$t('PERM_quit' + (starter.errSubJSON ? '4' : '2'))" 
      @click="reloadPage"/>
  </div>

</q-card>
</q-dialog>
</template>

<script setup lang="ts" vapor>
import { inject, ref, type Ref, onMounted, watch } from 'vue'
import { coolBye, reloadPage } from './util'
import { useStarterStore } from './store'

const $t = inject('$t') as Function
const starter = useStarterStore()

const asking = ref(false)

const isGranted = () => Notification.permission === 'granted'

const askPerm = async () => {
  asking.value = true
  await Notification.requestPermission()
  asking.value = false
  if (isGranted()) starter.setPermDialog()
}

onMounted(async () => {
  await askPerm()
})

</script>

<style lang="scss" scoped>
@import '../css/app.scss';
.ask { border: 1px solid $grey; padding: 3px; border-radius: 7px; }
</style>