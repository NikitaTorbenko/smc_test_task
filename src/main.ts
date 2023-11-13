import './assets/main.css'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-teal/theme.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(PrimeVue).mount('#app')
