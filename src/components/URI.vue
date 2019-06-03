<template>
  <section class="wrapper">
    URI
  </section>
</template>

<script>
import axios from 'axios'

const isProduction = process.env.NODE_ENV === 'production'

/**
 * Funcion para obtener URL original.
 *
 * @param {string} id - ID de ur corta.
 * @returns {Promise<string>} - URL uriginal.
 * @example
 * const originalUrl = await getURL('aaAA')
 */
const getURL = id => {
  return axios({
    method: 'GET',
    url: '/.netlify/functions/get',
    params: { id }
  }).then(response => {
    return response.data
  })
}

export default {
  name: 'URI',
  data: () => ({
    post: null,
    error: null
  }),
  // eslint-disable-next-line require-jsdoc
  beforeRouteEnter (to) {
    getURL(to.params.id).then(uri => {
      window.location.href = uri
      return true
    }).catch(err => {
      // eslint-disable-next-line no-console
      console.error(err)
    })
  },
  // eslint-disable-next-line require-jsdoc
  beforeRouteUpdate (to) {
    return getURL(to.params.id).then(uri => {
      window.location.href = uri
      return true
    }).catch(err => {
      if (isProduction) {
        this.$raven.captureException(err)
      } else {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    })
  }
}

</script>

<style>
</style>
