import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import DynamicView from '~/features/dynamic/routes/DynamicView.vue'
import MiscellaneousView from '~/features/miscellaneous/routes/MiscellaneousView.vue'
import SignupView from '~/features/signup/routes/SignupView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/signup'
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView,
    meta: {
      title: 'Signup'
    }
  },
  {
    path: '/dynamic',
    name: 'dynamic',
    component: DynamicView,
    meta: {
      title: 'Dynamic'
    }
  },
  {
    path: '/miscellaneous',
    name: 'miscellaneous',
    component: MiscellaneousView,
    meta: {
      title: 'Miscellaneous'
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
