import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import { router } from '~/modules/router'
import { validierung } from '~/modules/validierung'
import '~/main.css'

Vue.use(VueRouter)
Vue.use(validierung)

const app = new Vue({
  router,
  render: h => h(App)
})

app.$mount('#app')
