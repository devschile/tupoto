# tupoto

[![Netlify Status](https://api.netlify.com/api/v1/badges/3509617b-6f8a-4aad-9f25-97e940b8b5f0/deploy-status)](https://app.netlify.com/sites/tupoto/deploys)
[![Build Status](https://travis-ci.org/devschile/tupoto.svg?branch=master)](https://travis-ci.org/devschile/tupoto)
[![dependency Status](https://img.shields.io/david/devschile/tupoto.svg)](https://david-dm.org/devschile/tupoto#info=dependencies)
[![devDependency Status](https://img.shields.io/david/dev/devschile/tupoto.svg)](https://david-dm.org/devschile/tupoto#info=devDependencies)

> tupo.to - acortador de URL's

## Desarrollo

Iniciar redis con docker-compose:

```bash
# Nota es necesario tener instalado Docker y docker-compose
docker-compose up -d
```

Instalar dependencias de node:

```bash
# Se recomienda el uso nvm
npm i
```

Ejecutar la aplicación en modo desarrollo (netlify-local) en http://localhost:9000:

```bash
npm run server
```

Ejecutar la aplicación en modo desarrollo (vue-cli) en http://localhost:8080:

```bash
npm run serve
```

**NOTA:** Solo ejecutar uno de los dos.

## Licencia

[MIT](https://tldrlegal.com/license/mit-license)
