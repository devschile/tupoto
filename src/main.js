import Vue from 'vue'
import VueRaven from 'vue-raven'

import App from './App.vue'

Vue.config.productionTip = false

if (process.env.NODE_ENV === 'production') {
  Vue.use(VueRaven, {
    dsn: process.env.SENTRY_DSN_PUBLIC
  })
}

new Vue({
  render: h => h(App)
}).$mount('#app')
