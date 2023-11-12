FIP Sign
===

_Une aide pour emmarger en FIP + TAF._

## Commencer à développer
L'appli se base sur le framework [Vue.js](https://fr.vuejs.org) et [Bun](https://bun.sh) pour le développement et le build.

Il est possible de remlpacer **bun** par **node.js**.

### Tester l'application 

```bash
$ bun install
$ bun run dev
```

### Déployer et vérifier l'application

```bash
$ bun run build
$ bun run preview
```

## Déployer l'application avec Docker

```bash
$ docker build -t fip_sign -f docker/Dockerfile .
$ docker run -p 8080:80 fip_sign
```

# Copyrights
Some assets used in this repository might be copiryghted. There is no intention to use them without permission. If you are the owner of these assets and whant them removed, plese contact me.