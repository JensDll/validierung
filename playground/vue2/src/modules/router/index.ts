import VueRouter, { type RouteConfig } from 'vue-router'

import SignupForm from '~/pages/SignupForm.vue'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: SignupForm
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
