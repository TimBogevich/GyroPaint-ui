import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/display',
    name: 'Display',
    component: () => import(/* webpackChunkName: "about" */ '../views/Display.vue')
  },
  {
    path: '/canvas',
    name: 'Canvas',
    component: () => import(/* webpackChunkName: "about" */ '../components/canvas.vue')
  },
  {
    path: '/mobile',
    name: 'Mobile',
    component: () => import(/* webpackChunkName: "about" */ '../components/mobile.vue')
  },
  {
    path: '/paint',
    name: 'Paint',
    component: () => import(/* webpackChunkName: "about" */ '../components/paint.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
