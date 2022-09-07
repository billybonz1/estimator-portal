import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Select2 from 'vue3-select2-component'
import Maska from 'maska'
import mitt from 'mitt'

import App from './App.vue'
import router from './router'
import store from './store'
import notify from './utils/notify.plugin'

const emitter = mitt()
const app = createApp(App)
  .use(store)
  .use(router)
  .use(notify)
  .use(VueAxios, axios, Select2, Maska)
  .use(require('vue-cookies'))

app.config.globalProperties.emitter = emitter
app.mount('#app')
