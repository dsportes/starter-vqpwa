/* Fonction utilitaires requises pour le "starter" des applications et le SW.
Quelques une en plus, pour le fun.

Pas de CUSTOM.

Remarques:
- les exécutions DIRECTES dans un tel module ne SONT PAS sous
un <script setup> et ne peuvent PAS invoquer:
- fonctions des plugins I18n ($t) ou Quasar ($q).
- des fonctions des stores (ni en créer).
- ni appConfig (contourne ment en commentaire ci-après).

La fonction setupUtil() est invoquée depuis le <script setup> de App.vue.
- elle pourrait être async.
- elle peut initiliser les variables nécessaires.
*/ 

/* Comment accéder à appConfig dans l'initialisation du module,
AVANT excéution de setupUtil().

import appConfig from './app/config'
import customjson from './assets/custom.json?raw'
const appConfig: any = {}
{
  const patch: any = JSON.parse(customjson)
  for(const p in patch) (appConfig as any)[p] = patch[p]
}
*/

import { appConfig } from '../app/config'
import { sha256 } from 'js-sha256'

// Initialisations statiues du module
const encoder = new TextEncoder()
// @ts-expect-error
const p2 = [1, 0, 0, 0, 0, 0]; for (let i = 1; i < 6; i++) p2[i] = p2[i - 1] * 256

// Variables disponibles APRES initialisation "setupUtil"
let boot: any
let $t: Function

/* Fonction (qui pourrait être async) d'initialisation exécutée sous 
<script setup> */
export function setupUtil (_boot: any, _$t: Function) {
  $t = _$t
  boot = _boot
}

/* Cette fonction affiche une notification.
Elle peut être employée par l'application de n'importe où.
Exemple dans 'src/demo/Home.vue'.
- title: titre de la notification.
- options: { body: 'texte', data: { url: '...' } }
https://developer.mozilla.org/fr/docs/Web/API/ServiceWorkerRegistration/showNotification
*/
export async function showNotification (title: string, options: any) {
  const registration = await navigator.serviceWorker.ready
  await registration.showNotification(title, options)
}

/* Cette fonction envoie un message au SW.
Elle peut être employée par l'application de n'importe où.
Exemple dans 'src/demo/Home.vue'.
- type: permet au SW de dispatcher les messages aux handlers de chez lui.
- text: any (dans demo, un simple string)
*/
export async function postMessageToSW (type: string, text: any) {
  const registration = await navigator.serviceWorker.ready
  await registration.active?.postMessage({ type, text })
}

/* Crée un blob URL d'une page depuis le texte fourni qui peut être 
ensuite ouvert par: window.location.href = urlFromText(t)
*/
export function urlFromText (text: string, type?: string) : string {
  const blob = new Blob([encoder.encode(text)], { type: type || 'text/html' })
  return URL.createObjectURL(blob)
}

/* Ouvre une nouvelle page qui libère le browser de la page de l'application
- le service-worker n'est plus référencé par la page.
- la page ouverte recharge l'application.
*/
export function reloadPage () {
  const delay = appConfig.RELOADDELAY || 1000
  const m1 = $t('reload')
  const hr = window.location.href
  const t =  `<html><head><meta charset="utf-8">
<script>
setTimeout(() => { window.location.href = "${hr}" }, ${delay})
</script>
<style>div {font-size:18px;margin:12px;font-family:sans-serif;text-align:center;};</style>
</head><body>
<div>${m1}</div>
</body></html>`
  window.location.href = urlFromText(t)
}

/* Ouvre une nouvelle page qui libère le browser de la page de l'application
- le service-worker n'est plus référencé par la page.
- la page ouverte ne fait rien mais a un lien pour rouvrir l'application.
*/
export function coolBye () {
  const m1 = $t('coolbye')
  const m2 = $t('backtoapp')
  const help = $t('help')
  const url = $t('helpurl')
  const href = window.location.href
  const t = `<html><head><meta charset="utf-8">
<style>div {font-size:18px;margin:12px;font-family:sans-serif;text-align:center;};</style>
</head>
<body>
<div>${m1}</div>
<div><a href="${href}">${m2}</a></div>
<div><a href="${url}">${help}</a></div>
</body></html>`
  window.location.href = urlFromText(t)
}

/* Retourne un string en base 64 depuis un binaire */
export function keyToB64 (key: Uint8Array | null | undefined) : string {
  if (!key) return ''
  // @ts-expect-error
  return window.btoa(String.fromCharCode.apply(null, key))
}

/* Retourne un binaire depuis un string en base 64 */
export function keyFromB64 (key: string) : Uint8Array {
  if (!key) new Uint8Array([])
  const s = window.atob(key)
  const u8 = new Uint8Array(s.length)
  for (let i = 0, strLen = key.length; i < strLen; i++) u8[i] = s.charCodeAt(i)
  return u8
}

/* Retourne un number depuis un base64 de taille réduite pour supporter
un number "integer safe".
*/
export function b64ToInt (b64: string) { // b64 sur 8 char -> number integer safe
  const u8 = keyFromB64(b64)
  let r = 0
  // @ts-expect-error
  for (let j = 0; j < 6; j++) r += (p2[j] * u8[j])
  return r
}

/* Retourne un (court) base64 depuis un number "integer safe" */
export function intToB64 (n: number) { // n: number integer safe -> 8 char
  const u8 = new Uint8Array(6)
  let x = n
  for (let j = 0; j < 6; j++) {
    u8[j] = x % 256
    x = Math.floor(x / 256)
  }
  return keyToB64(u8)
}

/* Retourne un string en base 64 URL depuis un base 64 standard */
export function toUrl (s: string) : string {
  if (!s) return ''
  let i = s.length
  for(; s.charAt(i-1) === '='; i--) {}
  return s.substring(0, i).replace(/\+/g, '-').replace(/\//g, '_')
}

/* Retourne un string en base 64 standard depuis un string en base 64 URL */
export function fromUrl (s: string) : string {
  const diff = s.length % 4
  const pad = diff ? '===='.substring(0, 4 - diff) : ''
  return s.replace(/-/g, '+').replace(/_/g, '/') + pad
}

/* Attente (asynchrone) d'un délai */
export function sleep (delay: number) : Promise<void> {
  const d = delay < 0 ? 0 : delay
  return new Promise((resolve: Function) => { setTimeout(() => resolve(), d) })
}

/* Retourne la concaténation des buffer */
export function concat (views: ArrayBufferView[]) {
  let length = 0
  for (const v of views) length += v.byteLength
  const buf = new Uint8Array(length)
  let offset = 0
  for (const v of views) {
      const uint8view = new Uint8Array(v.buffer, v.byteOffset, v.byteLength)
      buf.set(uint8view, offset)
      offset += uint8view.byteLength
  }
  return buf
}

export function shaS (x: any) {
  const u8 = new Uint8Array(sha256.arrayBuffer(x))
  // return toUrl(keyToB64(u8.subarray(3, 18)))
  const s = keyToB64(u8.subarray(3, 18))
  return s.replace(/\+/g, '-').replace(/\//g, '_')
}
