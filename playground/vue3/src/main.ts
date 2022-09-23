import { createApp } from 'vue'

import App from './App.vue'
import { router } from '~/modules/router'
import { validierung } from '~/modules/validierung'
import '~/main.css'

const app = createApp(App)

app.use(router)
app.use(validierung)

app.mount('#app')
