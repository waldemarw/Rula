import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/assessment/right',
    name: 'assessment-right',
    component: () => import('@/pages/AssessmentPage.vue'),
    meta: { mode: 'right' },
  },
  {
    path: '/assessment/left',
    name: 'assessment-left',
    component: () => import('@/pages/AssessmentPage.vue'),
    meta: { mode: 'left' },
  },
  {
    path: '/assessment/both',
    name: 'assessment-both',
    component: () => import('@/pages/AssessmentPage.vue'),
    meta: { mode: 'both' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/AboutPage.vue'),
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/pages/ContactPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]
