import { createApp } from 'vue'

import { router } from './modules/router'
import { validation } from './modules/validation'
import App from './App.vue'

createApp(App).use(router).use(validation).mount('#app')

declare global {
  interface UseValidation_CustomValidationBehaviorFunctions {
    force: any
    change: any
  }
}