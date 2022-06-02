import { createApp } from 'vue'

import App from './App.vue'
import { validierung } from './modules/validierung'
import { router } from './modules/router'
import './main.css'

const app = createApp(App)

app.use(router)
app.use(validierung)

app.mount('#app')
