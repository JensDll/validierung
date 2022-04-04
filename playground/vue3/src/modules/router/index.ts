import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

import SignupForm from '~/pages/SignupForm.vue'
import DynamicForm from '~/pages/DynamicForm.vue'
import KeyedRules from '~/pages/KeyedRules.vue'
import FileUploadForm from '~/pages/FileUploadForm.vue'

const routes: RouteRecordRaw[] = [
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
  },
  {
    path: '/upload',
    name: 'upload',
    component: FileUploadForm,
    meta: {
      displayName: 'File Upload Form'
    }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

declare module 'vue-router' {
  interface RouteMeta {
    displayName: string
  }
}
