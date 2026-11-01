<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { User } from '@/entities/user'

const props = defineProps<{
  id: string | number
  user?: User
}>()
</script>

<template>
  <div v-if="props.user" class="user-details-info">
    <div class="row g-4">
      <!-- Contact & Personal -->
      <div class="col-md-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-bottom py-3">
            <h5 class="card-title mb-0 fw-bold">Особисті та контактні дані</h5>
          </div>
          <div class="card-body">
            <dl class="row mb-0">
              <dt class="col-sm-4 text-muted">Email:</dt>
              <dd class="col-sm-8 fw-medium">
                <a :href="`mailto:${props.user.email}`" class="text-decoration-none">{{ props.user.email }}</a>
              </dd>

              <dt class="col-sm-4 text-muted">Телефон:</dt>
              <dd class="col-sm-8 fw-medium">{{ props.user.phone || '—' }}</dd>

              <dt class="col-sm-4 text-muted">Вік:</dt>
              <dd class="col-sm-8">{{ props.user.age }} років</dd>

              <dt class="col-sm-4 text-muted">Стать:</dt>
              <dd class="col-sm-8 text-capitalize">{{ props.user.gender }}</dd>

              <dt class="col-sm-4 text-muted">Дата нар.:</dt>
              <dd class="col-sm-8">{{ props.user.birthDate || '—' }}</dd>

              <dt class="col-sm-4 text-muted">Група крові:</dt>
              <dd class="col-sm-8">{{ props.user.bloodGroup || '—' }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Address & Employment -->
      <div class="col-md-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-bottom py-3">
            <h5 class="card-title mb-0 fw-bold">Місце роботи та адреса</h5>
          </div>
          <div class="card-body">
            <dl class="row mb-0">
              <dt class="col-sm-4 text-muted">Компанія:</dt>
              <dd class="col-sm-8 fw-medium">{{ props.user.company?.name || '—' }}</dd>

              <dt class="col-sm-4 text-muted">Посада:</dt>
              <dd class="col-sm-8">{{ props.user.company?.title || '—' }}</dd>

              <dt class="col-sm-4 text-muted">Відділ:</dt>
              <dd class="col-sm-8">{{ props.user.company?.department || '—' }}</dd>

              <dt class="col-sm-4 text-muted">Університет:</dt>
              <dd class="col-sm-8">{{ props.user.university || '—' }}</dd>

              <dt class="col-sm-4 text-muted">Місто/Країна:</dt>
              <dd class="col-sm-8">
                {{ props.user.address?.city || '—' }}, {{ props.user.address?.country || '—' }}
              </dd>

              <dt class="col-sm-4 text-muted">Адреса:</dt>
              <dd class="col-sm-8">{{ props.user.address?.address || '—' }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div class="mt-4 text-end">
      <RouterLink :to="`/users/${props.id}/edit`" class="btn btn-primary px-4">
        ✏️ Редагувати дані користувача
      </RouterLink>
    </div>
  </div>
</template>
