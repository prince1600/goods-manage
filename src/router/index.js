import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/login/login.vue";
import Home from "@/components/home/home.vue"
import User from "@/components/user/user.vue"
import Right from "@/components/rights/right.vue"
import Roles from "@/components/rights/roles.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
      path: 'users',
      name: 'users',
      component: User
      },
      {
        path: 'rights',
        name: 'rights',
        component: Right,
      },
      {
        path: 'roles',
        name: 'roles',
        component: Roles,
      }
    ],
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
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login') {
    if (token) next()
    else next('/login')
  } else {
    if (token) next('/')
    else next()
  }
})
export default router
