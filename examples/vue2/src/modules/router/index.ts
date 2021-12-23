import VueRouter, { RouteConfig } from 'vue-router'

import SignupForm from '~/views/SignupForm.vue'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: SignupForm
  }
]

export const router = new VueRouter({
  routes
})
