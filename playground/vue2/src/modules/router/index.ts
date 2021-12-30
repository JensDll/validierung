import VueRouter, { RouteConfig } from 'vue-router'

import SignupForm from '~/views/SignupForm.vue'
import DynamicForm from '~/views/DynamicForm.vue'
import KeyedRules from '~/views/KeyedRules.vue'

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: SignupForm,
    meta: {
      displayName: 'Signup Form'
    }
  },
  {
    path: '/dynamic',
    name: 'dynamic',
    component: DynamicForm,
    meta: {
      displayName: 'Dynamic Form'
    }
  },
  {
    path: '/keyed',
    name: 'keyed',
    component: KeyedRules,
    meta: {
      displayName: 'More Keyed Rules'
    }
  }
]

export const router = new VueRouter({
  routes
})

declare module 'vue-router' {
  interface RouteMeta {
    displayName: string
  }
}
