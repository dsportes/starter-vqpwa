/* Script générique mais customisable d'amorçage de l'application
  Invoqué directement dans le <body> de index.html.

Importation de la configuration de l'application.
  - "patch" de celle-ci pour tenir compte d'une personnalisation
    spécifique à chaque "build"

Application des "patch" sur cette configuration dépendants de l'environnement d'exécution:
- soit de "dev",
- soit d'un "build" spécifique.
Le fichier de "patch" est dans /src/assets/custom.json?
*/

/* Par simplification et convention:
- la configuration est dans '/src/app/config.ts'
- le patch à appliquer est dans '/src/assets/custom.json'.
  Dans le script de build pour une cible donnée, un fichier spécifique
  vient écraser ce fichier (et le rétablir après build avec celui de dev).
*/
import { appConfig } from './app/config'

// Imports de la création de l'application, de pinia, de quasar et I18n
import { createApp } from 'vue'
// @ts-expect-error
import Quasar from 'quasar/src/vue-plugin.js'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

/* CUSTOM de I18n et de "localisation" de Quasar:
  - les langues supportées dans l'application sont listées dans 'src/app/config.ts'
  - importer les "localisations" de Quasar pour chaque langue de l'application.
*/
import langFr from 'quasar/lang/fr'
import langEn from 'quasar/lang/en-GB'
const locales:any = { fr: langFr, en: langEn }
for (const lo of appConfig.LANGOPTIONS) if (lo.value !== 'en') (lo as any)['props'] = locales[lo.value]

/* CUSTOM: importer les scripts de traduction des langues de l'application.
  Par convention dans /src/i18n/...
*/
import { enMsg } from './i18n/en'
import { frMsg } from './i18n/fr'
export const messages: any = { en: enMsg, fr: frMsg }

/* Configuration de I18n selon les langues de l'application */
const i18n = createI18n({
  legacy: false,
  locale: appConfig.LANG,
  fallbackLocale: appConfig.LANG,
  missingWarn: false,
  fallbackWarn: false,
  messages
})

/* CUSTOM: importer les librairies utilisables */
// import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
// import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
// import '@quasar/extras/material-icons-round/material-icons-round.css'
// import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'
// import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'
// import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css'
// import '@quasar/extras/material-symbols-sharp/material-symbols-sharp.css'
// import '@quasar/extras/mdi-v7/mdi-v7.css'
// import '@quasar/extras/fontawesome-v7/fontawesome-v7.css'
// import '@quasar/extras/ionicons-v4/ionicons-v4.css'
// import '@quasar/extras/eva-icons/eva-icons.css'
// import '@quasar/extras/themify/themify.css'
// import '@quasar/extras/line-awesome/line-awesome.css'
// import '@quasar/extras/bootstrap-icons/bootstrap-icons.css'

// A few examples for animations from Animate.css:
// import '@quasar/extras/animate/fadeIn.css'
// import '@quasar/extras/animate/fadeOut.css'

/* Import Quasar css */
import 'quasar/src/css/index.sass'

/* Import de App.vue, amorce générique:
  - création de l'application
  - mise à dispotion générale (provide) de la configuration de l'application
*/
import App from './App.vue'
const myApp = createApp(App)

/* Enregistrement de pinia et des plugins pinia et Quasar 
Pour Quasar une configuration PEUT être étendue */
myApp.use(createPinia())
myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  /* config: { 
    extras: [ 'roboto-font', 'material-icons']
  } */
})
myApp.use(i18n)

/* Amorce de l'application montage de App.vue
  - Les initialisations de l'application sont dans son <script setup> */
try {
  myApp.mount('#app')
} catch(e) {
  console.log(e)
}
