/* Script d'enregistrement du service-worker.

Pas de CUSTOM.

Ce script est directement invoqué dans index.html au chargement du <body>
Ce script est invoqué indépendemment de main.ts et ne peut bénéficier d'aucun
autre service que ceux importés ci-après qui sont "neutres" (sans dépendances):
- register-service-worker : pas de dépndances problématiques.
- app/config.ts : aucun import
- assats/custom.json : pur texte
*/

import { register } from 'register-service-worker'

import { appConfig } from './app/config'
const DEBUG = appConfig.DEBUG
const DUPBYE = !appConfig.DUPBYE ? '' : (appConfig.DUPBYE as any)[appConfig.LANG]

/*******************************************************************************
 * Exports à destination du seul starter store '/src/start/store.ts'
 *******************************************************************************/
let starterStore: any

/* Le starter Store s'enregistre par cette function de manière à recevoir les appels:
 - onAppUpdate : disponibilité d'une nouvelle version du W
 - onSWMessage : réception d'un message émis par SW
 - onPushMessage: réception d'un message reçu par push.
*/
export function declareStarterStore (_starterStore: any) {
  starterStore = _starterStore
}

/* Usage interne pour émettre la page de de détection de double lancement */
function urlFromText (text: string, type?: string) : string {
  const encoder = new TextEncoder()
  const blob = new Blob([encoder.encode(text)], { type: type || 'text/html' })
  return URL.createObjectURL(blob)
}

/* On peut recevoir des messages du SW dès le register effectué.
En conséquence il faut enregistrer le listener AVANT appel du register.
Traite les messages émis par le SW, AVANT MEME que starter Store ne se soit enregistré.
- traite le message 'STOP' émis sur détection de double lancement.
  Arrête l'application en ouvrant une nouvelle location hors du domaine
  (ce qui libère le service-worker).
- log localement les messages 'LOG' émis par le SW.
Quand le starter Store est enregistré:
- route les messages PUSH vers le hook dédié de starter Store.
- route les messages du SW vers le hook dédié de starter Store.
*/
navigator.serviceWorker.onmessage = async (message) => {
  try {
    if (message.data) { // { type:, payload: }
      if (message.data.type === 'STOP') {
        window.location.href = urlFromText(DUPBYE)
      } else if (message.data.type === 'PUSH') {
        if (DEBUG)
          console.log('Notification received by web-push')
        if (starterStore)
          await starterStore.onPushMessage(message.data)
      } else {
        if (message.data.type === 'LOG') {
          console.log(`Log reçu dans App envoyé par SW: ${message.data.payload}`);
        } else if (starterStore)
          await starterStore.onSwMessage(message.data)
      }
    }
  } catch (e: any) {
    console.log(e)
  }
}

/*
En dev, vite génère un dev-sw.js?dev-sw (nom non configurable) en guise de service-worker script.
Celui-ci contenant des 'import', il faut forcer les options d'enregistrement avec { type:'module' }
qui sont à indiquer dans 'registrationOptions.
En production (après build), le script de service-worker est /my-sw.js.
Le nom 'my-sw.js' est celui indiqué dans la configuration de vite /vite.config.ts:
- plugIns: VitePWA, propriété 'filename'
*/
console.log('Register SW ...')
const sw = import.meta.env.MODE === 'production' ? './my-sw.js' : '/dev-sw.js?dev-sw'

register(
  sw, 
  {
    registrationOptions: { type: 'module' },
    registered (registration: ServiceWorkerRegistration) {
      console.log('Service worker is registered: ', registration ? 'OK' : 'KO')
    },

    ready (registration: ServiceWorkerRegistration) {
      console.log('Service worker is active: ', registration ? 'OK' : 'KO')
      if (DUPBYE && registration && registration.active)
        registration.active.postMessage({ type: 'STARTING' })
    },

    updated (registration: ServiceWorkerRegistration) {
      console.log('Service worker is UPDATED.')
      if (starterStore)
        starterStore.onAppUpdate()
    },

    cached (/* registration */) { }, // console.log('Content has been cached for offline use.')
    updatefound (/* registration */) { }, // console.log('New content is downloading.')
    offline () { }, // console.log('No internet connection found. App is running in offline mode.')
    error (/* err */) { } // console.error('Error during service worker registration:', err)
  }
)
