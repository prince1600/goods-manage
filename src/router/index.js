import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/login/login.vue";
import Home from "@/components/home/home.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    children: [
      
    ]
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
