import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueKonva from 'vue-konva'

Vue.use(VueKonva)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
