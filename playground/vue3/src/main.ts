import { createApp } from 'vue'

import App from './App.vue'
import { validierung } from './modules/validierung'
import { router } from './modules/router'
import { pinia } from './modules/pinia'
import './main.css'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(validierung)

app.mount('#app')
