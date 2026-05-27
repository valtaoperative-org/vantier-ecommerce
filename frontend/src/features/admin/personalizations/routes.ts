import type { RouteRecordRaw } from 'vue-router'

export const personalizationsRoutes: RouteRecordRaw[] = [
  {
    path: 'personalizations',
    component: () => import('./components/PersonalizationsPage.vue'),
  },
]
