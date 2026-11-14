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

# Configuer une application
(TODO)
