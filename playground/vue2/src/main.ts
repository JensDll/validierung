import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import VueRouter from 'vue-router'

import App from './App.vue'
import { router } from './modules/router'
import { validation } from './modules/validation'
import { pinia } from './modules/pinia'
import { PiniaVuePlugin } from 'pinia'

Vue.use(VueCompositionAPI)
Vue.use(VueRouter)
Vue.use(validation)
Vue.use(PiniaVuePlugin)

const app = new Vue({
  router,
  pinia,
  render: h => h(App)
})

app.$mount('#app')
