import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

import App from './App.vue'
import router from './router/index.js'

Vue.config.productionTip = false

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN_PUBLIC,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })]
  })
}

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
