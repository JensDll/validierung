import { createApp } from 'vue'

import '~/styles/main.css'
import App from './App.vue'
import { router } from '~/lib/router'
import { validierung } from '~/lib/validierung'

const app = createApp(App)

app.use(router)
app.use(validierung)

app.mount('#app')
