import { createApp } from 'vue'

import App from './App.vue'
import { router } from '~/lib/router'
import { validierung } from '~/lib/validierung'
import '~/main.css'

const app = createApp(App)

app.use(router)
app.use(validierung)

app.mount('#app')
