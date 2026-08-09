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
    path: '/rula-worksheet',
    name: 'rula-worksheet',
    component: () => import('@/pages/WorksheetPage.vue'),
  },
  {
    path: '/rula-vs-reba',
    name: 'rula-vs-reba',
    component: () => import('@/pages/RulaVsRebaPage.vue'),
  },
  {
    path: '/rula-scores',
    name: 'rula-scores',
    component: () => import('@/pages/RulaScoresPage.vue'),
  },
  {
    path: '/rula-citation',
    name: 'rula-citation',
    component: () => import('@/pages/RulaCitationPage.vue'),
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
