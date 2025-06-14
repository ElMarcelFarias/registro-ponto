import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Admin from '../pages/Admin.vue'
import Registro from '../pages/Registro.vue'
import auth from '../store/auth'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (auth.state.token && auth.isAdmin()) next()
      else next('/login')
    },
  },
  {
    path: '/registro',
    component: Registro,
    beforeEnter: (to, from, next) => {
      if (auth.state.token && auth.isFuncionario()) next()
      else next('/login')
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
