# Starter Kit pour vue / quasar / PWA

La configuration de départ d'une application from scratch dansz un contexte vue / quasr / PWA n'est pas triviale:
- les fichiers de configuration ont de nombreuses options dont la documentation et les interactions sont complexes à maîtriser,
- les applications d'exemple générées depuis un _init_ ne sont pas toujours exécutables et toujours difficiles à transformer.

Ce _Starter Kit_ est une application de très courte démonstration, fonctionnant en _dev_ et en _build_:
- les quelques fichiers à customiser sont documentés.
- la vue de démonstration illustre l'usage des quelques features de base.

## Options majeures
### Vue et Vite
C'est le couple le plus standard. Le fichier de `vite.config.ts` n'a, normalement, pas à être modifié.

### Quasar
Très belle bibliothèque de composants et de styles. Quasar CLI n'est pas utilisé: ça ajoute une couche d'opacité et de configuration sans avantage et force à utiliser des features comme le router non pertinents.

En conséquence le script de boot main.ts est simple et facile à customiser.

### IDE VScode

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

On peut y ajouter typiquement les plugins:
- `Code Spell Checker` et `French Code Spell Checker`
- `Markdown Shortcuts`.

La configuration de debug est celle Chrome Web en adaptant le port:

    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch 8085",
      "url": "http://localhost:8085",
      "webRoot": "${workspaceFolder}"
    }

A insérer si nécessaire dans `.vscode/launch.json`.

### `pnpm` pour la gestion des modules / versions
Très rapide, `pnpm` a été préféré à `npm` ou `yarn` (qui fonctionnent aussi), en particulier son répertoire `node_modules` est de taille limitée et ne contient que des liens.

## Features
### PWA - non optionnel
La mise en place est simple et même sans utilisation _offline_ cette option optimise les chargements d'application.

Le support de PWA contient par défaut:
- la gestion du cache des ressources requises pour pouvoir fonctionner _offline_.
- la possibilité de transmettre un message de l'application au service_worker et réciproquement.
- le composant `/src/starter/NewVersion.vue`, intégré dans /src/App.vue gère le dialogue d'information de l'utilisateur de la disponibilité d'une nouvelle version.

> Remarque: si l'option d'interdiction d'exécution de plus d'une instance de l'application dans le browser est fixée, ce dialogue a peu de chance d'apparaître, la nouvelle version étant appliquée dès chargement.

### I18N - non optionnel
Mise en œuvre simple. Au pire il suffit de ne pas utiliser la fonction $t et / ou n'avoir qu'une langue déclarée.

En synchronisation avec I18n, quasar/lang/... est initialisé afin de fournir la _Locale_ propre à chaque langue et pas seulement la traduction.

La vue de démonstration `Home.vue` contient un `<q-select .../>` simple de changement de langue qui peut être copié / collé dans des vues de l'application.

### Styling / theming, modes sombre / clair - non optionnel
Les fichiers de style peut bien entendu être customisé.

Les applications peuvent déclarer leur propre thème (un pour le mode clair et un pour le mode sombre), un simple appel permet de basculer de mode sombre / clair et appliquer le thème correspondant.

La vue de démonstration `Homme.vue` contient un `<q-btn .../>` simple de permutation de mode sombre / clair qui peut être copié / collé dans des vues de l'application.

### Click sur une notification - optionnel
Le fichier de configuration de l'application `/src/app/config.ts` contient une propriété `NOTIFICATIONCLICK`: si celle-ci est `true`, le click sur une notification,
- soit monte au premier plan la fenêtre de l'application correspondante si elle est lancée,
- soit lance l'application dans un nouvel onglet affiché en premier plan.

### Support de WEB-PUSH - optionnel
Le fichier de configuration de l'application `/src/app/config.ts` contient une propriété `WEBPUSH`: 
- si celle-ci est non définie ou un string vide, le support du WEB-push n'est pas assuré.
- sinon elle doit contenir une **clé publique vapid** en base64.

Les messages envoyés par WEB-PUSH sont transmis sur une fonction _hook_ qui les routent à qui de droit.

L'usage du WEB-PUSH impose que le browser autorise les notifications à l'application.
- le composant `/src/starter/PermissonBox.vue` gère le dialogue d'information de l'utilisateur. Il est intégré à la racine `/src/starter/App.vue`. 

### Prévention de lancement en double dans un browser donné - optionnel
Le fichier de configuration de l'application `/src/app/config.ts` contient une propriété `DUPBYE: { fr: dupfr, en: dupen },`: 
- si cette propriété existe (et n'est pas ''), il n'est pas possible d'avoir plus d'une instance de l'application dans le browser.
- une tentative d'un second lancement est bloquée, la page échouant à se charger. 

### Autres features
Quelques fonctions utilitaires sont disponibles, comme par exemple,
- la sortie de l'application (vers une page hors du domaine).
- le rechargement de l'application vers une page annexe temporaire qui ne bloque pas le renouvellement du _service_worker_.
- quelques fonctions simples utilitaires (conversion binaire / base64, ...).

# Commandes
Elles s'activent par `npm run cmd1 ... `

  "scripts": {
    "build": "run-p type-check \"build-only {@}\" --",
    "build-only": "vite build",
    "dev": "vite",
    "preview": "vite preview",
    "type-check": "vue-tsc --build"
  },

`dev` créé un serveur de test servant l'application qui peut être,
- soit vue dans un browser,
- soit déboguer depuis VSCode.

`build` crée le répertoire /dist contenant les fichiers à distribuer.
- un shell script `sh/b1.sh` permet:
  - de copier un fichier _patch de configuration_ spécifique d'une cible précise de build,
  - de lancer le build,
  - de restaurer le fichier _patch de configuration_ de développement.

`preview` lance un serveur de preview d'une build, un test avant distribution.

Le shell script `sh/srv.sh` lance un serveur avec des certificats SSL et permet une preview de l'URL relative `.../dist/index.html` dans des conditions proches d'un déploiement externe.

See [Vite Configuration Reference](https://vite.dev/config/).

# Configurer une application

### La structure en folders
- `/dist` : (fixé) emplacement de la build.
- `/dsh` : (libre) : scripts et ressources de distribution.
  - `./build.sh ./build.ps1` : shell scripts de build. Le premier argument est le code de la cible de distribution (par exemple d1)
  - `./srv.sh ./srv.ps1` : shell scripts de lancement d'un serveur Web simple simulant le CDN externe.
  - `./depl.sh ./depl.ps1` : shell scripts de déploiement de la distribution dans un directory (passé en premier argument) en y préservant son directory `.git` et son fichier `README.md`
  - `/dsh/d1` : ressources de _patch_ spécifiques à la distribution `d1`.
    - `./config.json` : (fixé) patch de la configuration pour la distribution `d1`.
    - `./about.txt` : (fixé) fichier spécifique de `d1`.
  - `/dsh/tmp` : (fixé) directory de travail des shell scripts.
- `/public` : (fixé) ressources de fontes et des images présentes dans `index.htm`l et le `manifest` PWA.
- `/src` : (fixé)
  - `/src/app` : (quasi fixé, pourrait être changé mais c'est déconseillé). 
    - `./themes.ts` : (fixé) pour isoler la définition des thèmes dans un fichier distinct.
    - `./config.ts` : (fixé) options de configuration de l'application.
  - `/src/assets` : (fixé) toutes les ressources en particulier citées dans les styles.
    - `./custom.json` : (fixé) fichier de _patch_ de `config.ts`.
  - `/src/css` : (fixé)
    - `./quasar-variables.scss` : (fixé) contient la déclaration des _variables_ de style.
    - `./app.scss` : (fixé) définition des styles utilisables dans toutes les vues (dont les @font-face)
  - `/src/i18n` : (fixé)
    - `./fr.ts ./en-GB.ts` : un fichier par langue de l'application traduisant les termes.
    - Ce sont des `.ts` : ils peuvent importer des fichiers secondaires localisés ici.
  - `./starter` : (fixé) sources et composants du starter (customisables).
    - `./allstores.ts` expose les stores.
    - `./NewVersion.vue ./PermissionBox.vue` : composants du starter inscrits dans App.vue.
    - `./store.ts` : le store du starter (customisable).
    - `./util.ts` : quelques fonctions utilisées par le starter.
  - `./App.vue` : (quasi fixé, ppeut être changé dans /index.html mais c'est déconseillé). La vue racine de l'application:
    - script setup d'initialisation,
    - héberge deux composants (annonce de disponibilité d'une nouvelle version et gestion de la permission de notification).
  - `./main.ts` : (quasi fixé, peut être changé dans /index.html mais c'est déconseillé). LE script de _boot_ de l'application.
  - `./my-register-sw.ts` : (peut être changé dans /index.html). Le script d'enregistrement du script de service-worker.
- `/src-pwa/my-sw.ts` : emplacement et nom déclaré dans `vite.config.ts` SANS le mettre dans `/src`.
  - le nom `my-sw` figure aussi dans `my-register-sw.ts`
  - le changement d'emplacement / nom est déconseillé.
- `/index.html` : (fixé), le _template_ de la page de l'application.

Les fichiers suivants contribuent à la configuration:
- `/package.json` : customisé par ajout de modules et par son entête.
- `/READEME.md` : ce fichier.
- `/vite-config.ts` : la configuration de vite.
  - la section manifest est à customiser.
  - le reste n'a pas de l'être.

Les fichiers suivants n'ont pas lieu dêtre ajustés:
- `./pnpm...`
- `./tsconfig...`

### Fontes
Les fichiers de fontes sont à installer dans `/public/fonts`.

    /public/fonts/UbuntuSans_wdth,wght_.woff2

> Attention: les noms des fichiers ne doivent contenir QUE des caractères qui passent tels quels en URL (ni espace, ni `[` ...): ils sont mal traduits en build et sont indispobles _off line_.

Pour chaque fichier, une entrée dans /src/css/app.css donne son font_face:

    @font-face {
      font-family: 'Ubuntu Sans';
      src: url(/fonts/UbuntuSans_wdth,wght_.woff2) format("woff2-variations");
      font-style: normal
    }

### Icônes et images obligatoires

Dans `/public`
- `favicon.ico`
- `pwa-192x192.png`  `pwa-512x512.png`

Les dernières citées son celles mentionnées dans `/vite-config.ts >>> plugins >>> VitePWA >>> manifest >>> icons` 

    "icons": [
      { "src": "pwa-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
      { "src": "pwa-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
    ]

**Tailles obligatoires** : les formats 192x192 et 512x512 sont indispensables pour que Chrome et Android valident le manifeste et proposent l'installation.

**Attribut maskable** : ceci permet à Android d'adapter l'icône à différentes formes (cercle, carré arrondi) sans couper le logo. Gardez une marge de sécurité autour du visuel principal.

Les autres images / icônes sont à placer dans `/src/assets/img` (`img` est libre voire absent).

On y trouve pour la démo:
- deux images de splash d'attente durant l'initialisation de l'application,
- un logo et un superman pour illustrer leur usage dans une vue.

### `/src/app/config.ts`
Ce fichier fixe une liste de _constantes_ de configuration accessibles dans le code.

Afin qu'il puisse être _patché_ pour chaque distribution, le fichier `/src/assets/custom.json` contient la surcharge des constantes devant être appliquées pour une distribution donnée: le shell script `dsh/build.sh` (ou `.ps1`) copie le fichier approprié.

Le fichier `/src/app/themes.ts` ne contient _que_ la constante `THEMES`, juste pour que `config.ts` soit plus léger à gérer.

Voir les commentaires dans `config.ts` pour chaque constante.

## Synthèse: liste des customisations à effectuer
`/src/app/config.ts`
- les _langues_ supportées par l'application sont spécifiées ici.

`/src/main.ts`
- les langues supportées sont à configurer: création des fichiers de traduction dans `/src/i18n`.
- import d'extras de Quasar selon les besoins.
- à la rigueur ajuster les plugins de Quasar (par défaut aucun) et la configuration de Quasar (par défaut vide).

`/index.html`
- ajuster le titre.
- modifier / ajouter des tags `<meta>`

`/src/assets`
- inscrire les ressources spécifiques de l'application.

`/src/public`
- inscrire les fichiers d'icônes citès dans `index.html` et le manifeste.
- modifier / ajouter des fichiers de fontes.
- changer le `favicon.ico`.
- changer le `about.txt`.

`/src/i18n`
- inscrire les fichiers de traduction.
- rectifier si souhaité les messages du _starter_.

`/src/css`
- `quasar-variables.scss` : si les styles de l'application ont besoin de variables, les citer ici.
- `app.css` : 
  - ajuster la définition des `@font-face` en cas d'ajouts / changements de fontes.
  - déclarer les styles spécifiques de l'application.

`/src/my-register-sw.ts` : a priori rien à changer.

`/src-pwa/my-sw.ts`
- ajuster éventuellement la fonction `objectToNotification()`.
- ajuster éventuellement la fonction `urlFromNotification()`.
- ajuster / remplacer la fonction `customListener()` s'il y en a des listeners spécifiques.

`/src/App.vue`
- fixer la _home page_ de l'application.
- importer les modules à initialiser et ajouter l'invocation de leurs fonctions `init()`.
- ajuster ou supprimer le message d'attente et l'image de splash.

`/src/...`
- organiser et écrire les modules et vues de l'application.

`/src/starter`
- `./allstores.ts` : importer et initialiser les _stores_ de l'application.
- `./stores.ts` : déclarer les _hooks_ de l'application `onSwMessage onPushMessage`.
