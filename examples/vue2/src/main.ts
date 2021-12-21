import Vue from 'vue2'
import VueCompositionAPI from '@vue/composition-api'

import { validation } from './modules/validation'
import App from './App.vue'

Vue.use(VueCompositionAPI)
Vue.use(validation)

const app = new Vue({
  render: h => h(App)
})

app.$mount('#app')

declare module 'compose-validation' {
  interface ValidationBehaviorFunctions {
    change: any
    lazy: any
  }
}
