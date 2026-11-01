import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Головна | Vue Lottery App',
      layout: 'default'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: 'Про автора | Vue Lottery App',
      layout: 'default'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'Вхід | Vue Lottery App',
      layout: 'auth',
      guestOnly: true
    }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UsersView.vue'),
    meta: {
      title: 'Учасники | Vue Lottery App',
      requiresAuth: true,
      layout: 'default'
    }
  },
  {
    path: '/users/:id',
    component: () => import('@/views/UserDetailsView.vue'),
    props: true,
    meta: {
      requiresAuth: true,
      layout: 'default'
    },
    children: [
      {
        path: '',
        name: 'user-details',
        component: () => import('@/views/UserDetailsInfo.vue'),
        props: true,
        meta: {
          title: 'Деталі користувача | Vue Lottery App',
          requiresAuth: true,
          layout: 'default'
        }
      },
      {
        path: 'edit',
        name: 'user-edit',
        component: () => import('@/views/UserEditView.vue'),
        props: true,
        meta: {
          title: 'Редагування користувача | Vue Lottery App',
          requiresAuth: true,
          layout: 'default'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '404 - Сторінку не знайдено | Vue Lottery App',
      layout: 'default'
    }
  }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active'
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // Guard for protected routes
  if (to.matched.some((record) => record.meta.requiresAuth) && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  // Guard for guests-only routes (login page)
  if (to.matched.some((record) => record.meta.guestOnly) && auth.isAuthenticated) {
    return { name: 'users' }
  }
})

router.afterEach((to) => {
  const title = (to.meta.title as string) || 'Vue Lottery App'
  document.title = title
})

export default router
