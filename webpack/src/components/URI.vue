<template>

  <section class="wrapper">
    URI
  </section>

</template>

<script>

import axios from 'axios'

const environment = process.env.NODE_ENV

export default {
  name: 'URI',
  data: () => ({
  }),
  methods: {
    postURL: function() {

      let options = {
        method: 'get',
        uri: '/.netlify/functions/get',
        data: {
          uri: this.inputURI
        }
      }

      if (environment === 'development') {
        options = {
          method: 'GET',
          uri: 'http://localhost:3000/uri',
          data: {
            uri: this.outputURI
          }
        }
      }

      axios(
      {
        method: options.method,
        url: options.uri,
        data: options.data
      })
      .then(response => {
        if (response && response.status === 200) {
          // no se que hacer aqui, redirect?
        }
      })
    }
  }
}

</script>

<style>
</style>
