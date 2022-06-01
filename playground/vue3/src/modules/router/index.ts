import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import SignupForm from '~/pages/SignupForm.vue'
import DynamicForm from '~/pages/DynamicForm.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/signup'
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupForm,
    meta: {
      title: 'Signup'
    }
  },
  {
    path: '/dynamic',
    name: 'dynamic',
    component: DynamicForm,
    meta: {
      title: 'Dynamic'
    }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}
