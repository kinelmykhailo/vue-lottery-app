<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { User } from '@/entities/user'
import { useUsersStore } from '@/entities/user'
import { AppButton } from '@/shared/ui'

const props = defineProps<{
  users: User[]
  winnerIds: number[]
  isLoading?: boolean
}>()

const usersStore = useUsersStore()
const confirm = useConfirm()
const toast = useToast()

function confirmDeleteUser(user: User): void {
  confirm.require({
    message: `Ви дійсно бажаєте видалити користувача "${user.firstName} ${user.lastName}" (${user.email})?`,
    header: 'Підтвердження видалення',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger p-button-sm',
    rejectClass: 'p-button-secondary p-button-sm',
    acceptLabel: 'Так, видалити',
    rejectLabel: 'Скасувати',
    accept: async () => {
      try {
        await usersStore.removeUser(user.id)
        toast.add({
          severity: 'success',
          summary: 'Видалено',
          detail: `Користувача "${user.firstName} ${user.lastName}" видалено!`,
          life: 3000
        })
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Помилка видалення',
          detail: (e as Error).message,
          life: 4000
        })
      }
    }
  })
}
</script>

<template>
  <div class="card border-0 shadow-sm overflow-hidden mb-4">
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col" style="width: 60px">ID</th>
            <th scope="col">Користувач</th>
            <th scope="col">Контакти</th>
            <th scope="col">Вік / Стать</th>
            <th scope="col" class="text-end" style="min-width: 220px">Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in props.users"
            :key="user.id"
            :class="{ 'table-warning': props.winnerIds.includes(user.id) }"
          >
            <td class="fw-bold text-muted">#{{ user.id }}</td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <img
                  :src="user.image || `https://dummyjson.com/icon/${user.username}/128`"
                  :alt="user.username"
                  class="rounded-circle border"
                  width="40"
                  height="40"
                />
                <div>
                  <div class="fw-semibold text-dark">
                    {{ user.firstName }} {{ user.lastName }}
                    <span v-if="props.winnerIds.includes(user.id)" class="badge bg-warning text-dark ms-1">
                      🏆 Winner
                    </span>
                  </div>
                  <div class="text-muted small">@{{ user.username }}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="small text-truncate" style="max-width: 220px">{{ user.email }}</div>
              <div class="small text-muted">{{ user.phone || '—' }}</div>
            </td>
            <td>
              <span class="small">{{ user.age }} р., <span class="text-capitalize">{{ user.gender }}</span></span>
            </td>
            <td class="text-end">
              <div class="d-inline-flex gap-1">
                <RouterLink :to="`/users/${user.id}`" class="text-decoration-none">
                  <AppButton label="Деталі" size="small" outlined severity="info" />
                </RouterLink>
                <RouterLink :to="`/users/${user.id}/edit`" class="text-decoration-none">
                  <AppButton label="Редагувати" size="small" outlined severity="secondary" />
                </RouterLink>
                <AppButton
                  label="Видалити"
                  size="small"
                  outlined
                  severity="danger"
                  @click="confirmDeleteUser(user)"
                />
              </div>
            </td>
          </tr>

          <tr v-if="props.users.length === 0 && !props.isLoading">
            <td colspan="5" class="text-center py-4 text-muted">
              Користувачів не знайдено.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
