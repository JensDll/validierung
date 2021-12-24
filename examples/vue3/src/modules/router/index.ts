import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

import SignupForm from '~/views/SignupForm.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: SignupForm
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
