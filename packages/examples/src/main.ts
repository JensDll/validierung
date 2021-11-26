import { createApp } from 'vue'

import { router } from './modules/router'
import { validation } from './modules/validation'
import App from './App.vue'

createApp(App).use(router).use(validation).mount('#app')

declare module 'vue3-form-validation' {
  export interface CustomValidationBehaviorFunctions {
    example: any
  }
}
