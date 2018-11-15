import Vue from 'vue'
import VueRaven from 'vue-raven'

import App from './App.vue'

Vue.config.productionTip = false

if (process.env.NODE_ENV === 'production') {
  Vue.use(VueRaven, {
    dsn: 'https://7f31a740e7ec460cbdd1c9fdf2595be0@sentry.io/1323839'
  })
}

new Vue({
  render: h => h(App)
}).$mount('#app')
