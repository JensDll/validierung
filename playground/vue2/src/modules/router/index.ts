import VueRouter, { RouteConfig } from 'vue-router'

import SignupForm from '~/pages/SignupForm.vue'
import DynamicForm from '~/pages/DynamicForm.vue'
import KeyedRules from '~/pages/KeyedRules.vue'
import FileUploadForm from '~/pages/FileUploadForm.vue'

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: SignupForm,
    meta: {
      displayName: 'Signup form'
    }
  },
  {
    path: '/dynamic',
    name: 'dynamic',
    component: DynamicForm,
    meta: {
      displayName: 'Dynamic form'
    }
  },
  {
    path: '/keyed',
    name: 'keyed',
    component: KeyedRules,
    meta: {
      displayName: 'Keyed rules'
    }
  },
  {
    path: '/upload',
    name: 'upload',
    component: FileUploadForm,
    meta: {
      displayName: 'File upload form'
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
