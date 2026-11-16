import { ref, type Ref, computed, inject, watch, reactive, type Reactive } from 'vue'
import { usePermission, useWindowSize } from '@vueuse/core'
import { defineStore } from 'pinia'

import { Lang, setCssVar } from 'quasar'
import { declareStarterStore } from '../my-register-sw'
import { keyFromB64, fromUrl } from './util'

/* Options d'une langue:
  - value: son code (fr, en-GB ...)
  - label: son nom danbs la langue elle-même
  - flag: son drapeau (un caractère)
  - props: les propriétés de la "locale" pour cette langue définie par quasar/Lang
*/
export type LangOption = { value: string, label: string, flag: string, props?: any }

export type SubsToken = {
  // si les deux sont vides, aucune demande n'a jamais été faite
  json: string, // Si non vide, le token valide
  err: string // le code d'erreur à l'obtention ou vide si OK. 
}

export const useStarterStore = defineStore('starter', () => {
  // PRIVATE
  const appConfig:any = inject('appConfig')
  // PRIVATE: clé web-push en binaire
  const webpushkey: Ref<BufferSource | undefined> = ref(appConfig.WEBPUSH ? keyFromB64(fromUrl(appConfig.WEBPUSH)) as BufferSource : undefined)

  // PRIVATE: option de la langue par défaut
  const defLangOption: LangOption = { value: 'en', label: 'English 🇬🇧',  flag: '🇬🇧' }
  // Option de la langue courante
  const curLangOption: Ref<LangOption> = ref(defLangOption)
  // Liste des options des langues de l'application
  const langOptions: Ref<LangOption[]> = ref(appConfig.LANGOPTIONS)

  /* SEMI-PRIVATE : returns a reactive ref<'granted' | 'denied' | 'prompt'>
  Utilisé par PermissionBox.vue inclus dans App.vue */
  const notificationAccess = usePermission('notifications')

  /* SEMI-PRIVATE : model d'ouverture du composant PermissionsBox.vue inclus dans App.vue */
  const permDialog: Ref<boolean> = ref(false)

  watch(notificationAccess, (v) => {
    console.log('Permission change: ' + v)
    if (v === 'granted') permDialog.value = false
  })

  /* Largeur / hauteur de la windo (reactive) */
  const { width, height } = useWindowSize ()

  /* PRIVATE : 
  - myself est la référence au store lui-même depuis l'intérieur APRES init() 
  */
  let i18n:any, $t:Function, myself: any
  /* $q DOIT être reactive: on pose un watch dessus pour la largeur et la hauteur */
  const $q: Ref<any> = ref()

  /* SEMI-PRIVATE: invoquée uniquement dans App.vue dans son <script setup> */
  const init = (_i18n: any, _$q: any) => {
    i18n = _i18n
    $t = _i18n.t
    $q.value = _$q

    const lo = getLangOption(appConfig.LANG)
    Lang.set(lo.props)
    i18n.locale.value = appConfig.LANG
    curLangOption.value = lo
    _$q.dark.set(appConfig.DARK)
    setTheme()
    myself = useStarterStore()
    declareStarterStore(myself)
  }

  /* Retourne true si le mode sombre est actif (réactif) */
  const isDark: Ref<boolean> = computed(() => $q ? $q.value.dark.isActive : true)

  /* Retourne l'option de la langue citée, ou celle par défaut si elle n'est pas installée */
  const getLangOption = (lang: string) : LangOption => {
    if (lang) for (const x of langOptions.value) if (x.value === lang) return x
    return defLangOption
  }
  
  /* Change la langue courante */
  const setLang = (lang: string) => {
    if (lang === curLangOption.value.value) return
    for(const lo of langOptions.value) {
      if (lo.value === lang) {
        i18n.locale.value = lang
        curLangOption.value = lo
        Lang.set(lo.props)
      }
    }
  }

  /* Passe en mode sombre / clair */
  const setDark = (dark: boolean) => {
    const d = isDark.value
    if ((d && dark) || (!d && !dark)) return
    $q.value.dark.set(dark)
    setTheme()
  }

  // PRIVATE
  const setTheme = () => {
    const d = isDark.value
    const t = appConfig.THEMES as any
    for(const c in t) setCssVar(c, t[c][d ? 0 : 1])
  }

  /* SEMI-PRIVATE: model d'ouverture du dialogue NewVersion.vue (inclus dans App.vue uniquement) */
  const newVersionDialog = ref(false)

  /* Hook invoqué par my-register-sw à détection de la disponibilité d'une nouvelle version */
  const onAppUpdate = () => {
    newVersionDialog.value = true
  }

  /* Gestion du token web-push et de la permission de notification ***********************
  - le token de subscription est géré par le browser.
  - il est calculé lors de la première demande souscription
  Si on est certain de l'avoir obtenu une fois il est disponible dans subsToken,
  sinon on peut l'obtenir par getSubsToken() mais en cas de besoin de création
  nécessite un appel depuis un <script setup> (quoi que ?).
  *****************************************************************************************/
  const subsToken : Reactive<SubsToken> = reactive({json: '', err: ''})

  /* Retourne si le net est disponible ou qu'on est en mode "avion" */
  const hasNet: Ref<boolean> = ref(true)

  /* Fixe dynamiquement le mode online / avion */
  const setNet = (_hasNet: boolean) => {
    hasNet.value = _hasNet
  }

  /* Obtention du token de subscription, le cas échéant demande d'enregistrement */
  const getSubsToken = async () : Promise<SubsToken> => {
    if (subsToken.json || subsToken.err) return subsToken

    const registration = await navigator.serviceWorker.ready
    const pm = registration.pushManager
    if (!pm) { 
      subsToken.json = ''
      subsToken.err = 'Cannot get pushManager'
      console.log('subs token KO: ' + subsToken.err)
      return subsToken
    }
    try {
      const sub = await pm.getSubscription()
      if (sub) { 
        subsToken.json = JSON.stringify(sub)
        subsToken.err = ''
        console.log('subs token OK: ' + subsToken.json)
        return subsToken
      }
      const opt: PushSubscriptionOptionsInit = { userVisibleOnly: true, applicationServerKey: webpushkey.value }
      try {
        const sub = await pm.subscribe(opt)
        subsToken.json = JSON.stringify(sub)
        subsToken.err = ''
        console.log('subs token OK: ' + subsToken.json)
        return subsToken
      } catch(e: any) {
        subsToken.json = ''
        subsToken.err = e.toString()
        console.log('subs token KO: ' + subsToken.err)
        return subsToken
      }
    } catch(e: any) {
      subsToken.json = ''
      subsToken.err = e.toString()
      console.log('subs token KO: ' + subsToken.err)
      return subsToken
    }
  }

  /* Avec l'option web-push: si online et token pas déjà acquis,
  - si "granted", demande du subsToken en cas de changement de notificationAccess.
  - sinon ouverture du dialogue de demande.
  */
  if (webpushkey.value) 
    watch (notificationAccess, async (newStatus) => {
      if (newStatus === 'granted') {
        if (hasNet.value && !subsToken.json)
          await getSubsToken()
      } else {
        permDialog.value = true
      }
    })

  /* Avec l'option web-push: si online et token pas déjà acquis,
  - si "granted" demande du subsToken.
  - sinon ouverture du dialogue de demande.*/
  if (webpushkey.value)
    watch(() => hasNet.value, async (net) => {
      if (net && !subsToken.json) {
        if (notificationAccess.value === 'granted') await getSubsToken()
        else permDialog.value = true
      }
    })

  /* Avec l'option web-push:
  - si la session est online, le token est demandé immédiatement.
  - sinon il sera demandé si plus tard la session passera online (watch ci-dessus).
  - si l'accès n'est pas granted, le dialogue de demande est ouvert.
  */
  if (webpushkey.value && hasNet.value) {
    if (notificationAccess.value === 'granted') {
      setTimeout(async () => { 
        await getSubsToken() }, 1)
    } else 
      permDialog.value = true
  }

  console.log('Boot configuration done.')

  // Hooks de l'application à définir
  const onSwMessage = async (messageData: any)=> {
    console.log(messageData.type)
  }

  const onPushMessage = async (messageData: any)=> {
    console.log(messageData.type)
  }

  return {
    // SEMI-PRIVATE
    init, 
    newVersionDialog, permDialog, notificationAccess, subsToken, 
    onAppUpdate, onSwMessage, onPushMessage, // Hooks invoqués par register-sw

    langOptions, curLangOption, setLang, 
    isDark, setDark, 
    width, height,
    hasNet, setNet, getSubsToken
  }
})