<!-- App.vue est la vue d'amorçage générique.
Elle bénéficie de appConfig obtenue par inject() (le provide est dans main.ts)
Les customisations sont:
- la fixation de la "home page" de l'application (import et composant)
- l'initialisation de modules:
  - import
  - appel de leur initialisation asynchrone ou synchrone
    qui s'exécute donc sous <script setup>.
-->

<template>

  <!-- Message "please wait" facultatif: peut être commenté -->
  <transition name="anim3">
    <div v-if="!initdone" 
      class="title-md text-center text-italic full-width">
      {{ $t('pleasewait') }}</div>
  </transition>

  <!-- Image de splash facultative: peut être commentée -->
  <transition name="anim1">
    <div v-if="!initdone" :class="bg + ' q-mt-lg'" 
      style="position: absolute; top: 0; left: 0; width: 95vw; height: 95vh"/>
  </transition>

  <!-- La transition d'accès à la "home page" peut êttre enlevée -->
  <transition name="anim2">
    <!-- Custom: changer le nom de la "home page" de l'application-->
    <home v-if="initdone"/>
  </transition>

  <!-- Dialogue d'information sur la disponibilté d'une nouvelle version.-->
  <new-version v-if="nv"/>

  <!-- Dialogue de demande de permissions de notification.-->
  <permission-box v-if="pb"/>

</template>

<script setup lang="ts" vapor>
import { ref, type Ref, inject, provide, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useStarterStore } from './starter/store'
import { setupUtil, sleep } from './starter/util'

import NewVersion from './starter/NewVersion.vue'
import PermissionBox from './starter/PermissionBox.vue'

/* CUSTOM: 
  - imorter la "home page" de l'application
  - importer les modules devant être intialisés
*/
import Home from './demo/Home.vue'
import { test } from './demo/registry.ts'

// Variable de protection contre l'affichage lors de l'initialisation
const initdone: Ref<boolean> = ref(false)

// Acquisition de la configuration de l'application
const appConfig: any = inject('appConfig')

// Style de l'image de splash selon le mode DARK ou non : facultatif
const bg = 'splash-' + (appConfig['DARK'] ? 'w' : 'b')

// Acquisition des entrées des plugins I18n et Quasar
const i18n = useI18n()
const $q = useQuasar()
const $t = i18n.t

// Mise à dispositiion générale des vues et stores
provide('i18n', i18n)
provide('$t', $t)
provide('$q', $q)

// Acquisition du Store du starter et son initialisation
const starter = useStarterStore()
starter.init(i18n, $q)

// Initialisation du module "util" du starter
setupUtil(starter, $t, appConfig)

/* Variables de contrôle d'ouverure des deux dialogues:
  - de demande de permissions de notification.
  - d'information sur la disponibilté d'une nouvelle version.
*/
const pb = computed(() => starter.permDialog)
const nv = computed(() => starter.newVersionDialog)

onMounted (async () => {
  /* CUSTOM: procéder aux initialisations asynchrones (ou synchrones)
    Elles s'exécutent sous un <script setup> donc peuvent accéder:
    - aux stores statiques et créer des stores dynamiques
    - aux injections appConfig, $t, $q et I18n
  */

  test() // exemple de demo
  
  await sleep(300) // facultatif pour avoir le temps de voir l'animation du splash
  
  /* Déclenche l'affichage de la "home page" de l'application 
    et la disparition du splash / avis "please wait" */
  initdone.value = true 
})

</script>

<style lang="scss">
@import './css/app';
// L'image de splash est facultative
.splash-b, .splash-w {
  background-position: center center;
  background-repeat: no-repeat;
  background-size:contain;
  opacity: 0.10
}
.splash-b { background-image: url('./assets/img/splash-b.svg'); }
.splash-w { background-image: url('./assets/img/splash-w.svg'); }

// Animation de la sortie de l'image de splash
.anim1-leave-active { transition: all 0.5s;}
.anim1-leave-to { opacity: 0;}

// Animation de l'entrée de la "home page"
.anim2-enter-active { transition: all 0.2s;}
.anim2-enter-from { transform: translateX(50%);}

// Animation de la sortie du message "please wait"
.anim3-leave-active { transition: all 0.2s;}
.anim3-leave-to { transform: translateX(-50%);}
</style>