import { createApp } from 'vue3'

import App from './App.vue'
import { validation } from './modules/validation'

createApp(App).use(validation).mount('#app')

declare module 'compose-validation' {
  interface ValidationBehaviorFunctions {
    change: any
    lazy: any
  }
}
