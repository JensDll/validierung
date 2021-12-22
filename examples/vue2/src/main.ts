import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

import { validation } from './modules/validation'
import App from './App.vue'

Vue.use(VueCompositionAPI)
Vue.use(validation)

const app = new Vue({
  render: h => h(App)
})

app.$mount('#app')

declare module 'validierung' {
  interface ValidationBehaviorFunctions {
    change: any
    lazy: any
    lazier: any
    submit: any
  }
}
