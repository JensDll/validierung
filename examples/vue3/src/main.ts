import { createApp } from 'vue'

import App from './App.vue'
import { validation } from './modules/validation'
import { router } from './modules/router'

createApp(App).use(validation).use(router).mount('#app')

declare module 'validierung' {
  interface ValidationBehaviorFunctions {
    change: any
    lazy: any
    lazier: any
    submit: any
  }
}
