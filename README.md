# tupoto

[![dockeri.co](http://dockeri.co/image/lgatica/tupoto)](https://hub.docker.com/r/lgatica/tupoto/)

[![Build Status](https://travis-ci.org/devschile/tupoto.svg?branch=master)](https://travis-ci.org/devschile/tupoto)
[![dependency Status](https://img.shields.io/david/devschile/tupoto.svg?style=flat-square)](https://david-dm.org/devschile/tupoto#info=dependencies)
[![devDependency Status](https://img.shields.io/david/dev/devschile/tupoto.svg?style=flat-square)](https://david-dm.org/devschile/tupoto#info=devDependencies)

> tupo.to - acortador de URL's

## Desarrollo

Iniciar redis con docker-compose:

```bash
# Nota es necesario tener instalado Docker y docker-compose
docker-compose -f docker-compose.dev.yml up -d
```

Instalar dependencias de node:

```bash
# Se recomienda el uso nvm
npm i
```

Ejecutar la aplicación en modo desarrollo:

```bash
npm run start:dev
```

## Licencia

[MIT](https://tldrlegal.com/license/mit-license)
