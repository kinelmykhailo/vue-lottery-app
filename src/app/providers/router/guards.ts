import type { Router } from 'vue-router'
import { useSessionStore } from '@/entities/session'

export function setupGuards(router: Router): void {
  router.beforeEach((to) => {
    const session = useSessionStore()

    if (to.matched.some((record) => record.meta.requiresAuth) && !session.isAuthenticated) {
      return {
        name: 'login',
        query: { redirect: to.fullPath }
      }
    }

    if (to.matched.some((record) => record.meta.guestOnly) && session.isAuthenticated) {
      return { name: 'users' }
    }
  })

  router.afterEach((to) => {
    const title = (to.meta.title as string) || 'Vue Lottery App'
    document.title = title
  })
}
