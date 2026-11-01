<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { AppButton } from '@/shared/ui'

const sessionStore = useSessionStore()
const router = useRouter()

function handleLogout(): void {
  sessionStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <AppButton
    label="Logout"
    severity="danger"
    outlined
    size="small"
    @click="handleLogout"
  />
</template>
