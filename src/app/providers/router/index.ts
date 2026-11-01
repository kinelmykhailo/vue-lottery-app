import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { setupGuards } from './guards'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home').then((m) => m.HomePage),
    meta: {
      title: 'Головна | Vue Lottery App',
      layout: 'default'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/about').then((m) => m.AboutPage),
    meta: {
      title: 'Про автора | Vue Lottery App',
      layout: 'default'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login').then((m) => m.LoginPage),
    meta: {
      title: 'Вхід | Vue Lottery App',
      layout: 'auth',
      guestOnly: true
    }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/pages/users').then((m) => m.UsersPage),
    meta: {
      title: 'Учасники | Vue Lottery App',
      requiresAuth: true,
      layout: 'default'
    }
  },
  {
    path: '/users/:id',
    component: () => import('@/pages/user-details').then((m) => m.UserDetailsPage),
    props: true,
    meta: {
      requiresAuth: true,
      layout: 'default'
    },
    children: [
      {
        path: '',
        name: 'user-details',
        component: () => import('@/pages/user-details').then((m) => m.UserDetailsInfo),
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
        component: () => import('@/pages/user-details').then((m) => m.UserEditView),
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
    component: () => import('@/pages/not-found').then((m) => m.NotFoundPage),
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

setupGuards(router)

export default router
