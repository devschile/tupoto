import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import URI from '@/components/URI'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/:id',
      name: 'uri',
      component: URI
    }
  ]
})
