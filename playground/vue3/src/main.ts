import { createApp } from 'vue'

import App from './App.vue'
import { validation } from './modules/validation'
import { router } from './modules/router'
import { pinia } from './modules/pinia'

createApp(App).use(validation).use(router).use(pinia).mount('#app')
