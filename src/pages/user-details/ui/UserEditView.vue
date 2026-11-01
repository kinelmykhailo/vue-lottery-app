<script setup lang="ts">
import type { User } from '@/entities/user'
import { UserEditForm } from '@/features/user-form'

const props = defineProps<{
  id: string | number
  user?: User
}>()

const emit = defineEmits<{
  'user-updated': [user: User]
}>()
</script>

<template>
  <div class="user-edit-page">
    <UserEditForm
      :id="props.id"
      :user="props.user"
      @user-updated="emit('user-updated', $event)"
    />
  </div>
</template>
