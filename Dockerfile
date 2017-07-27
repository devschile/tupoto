FROM node:8-alpine

LABEL maintainer "Leonardo Gatica <lgatica@protonmail.com>"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json package-lock.json /usr/src/app/
RUN npm i && npm cache clean --force && \
  rm -rf ~/.node-gyp /tmp/*
COPY . /usr/src/app

CMD [ "npm", "start" ]
