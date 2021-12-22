import { createApp } from 'vue'

import App from './App.vue'
import { validation } from './modules/validation'

createApp(App).use(validation).mount('#app')

declare module 'validierung' {
  interface ValidationBehaviorFunctions {
    change: any
    lazy: any
    lazier: any
    submit: any
  }
}
