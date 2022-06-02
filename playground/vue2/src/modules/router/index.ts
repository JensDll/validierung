import VueRouter, { type RouteConfig } from 'vue-router'

import SignupForm from '~/pages/SignupForm.vue'
import DynamicForm from '~/pages/DynamicForm.vue'
import Miscellaneous from '~/pages/Miscellaneous.vue'

const routes: RouteConfig[] = [
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
  },
  {
    path: '/miscellaneous',
    name: 'miscellaneous',
    component: Miscellaneous,
    meta: {
      title: 'Miscellaneous'
    }
  }
]

export const router = new VueRouter({
  routes
})

declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}
