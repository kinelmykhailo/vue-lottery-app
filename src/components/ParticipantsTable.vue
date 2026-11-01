<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Participant, SortDirection, SortField } from '@/types/participant'
import SearchBar from '@/components/SearchBar.vue'

const props = defineProps<{
  participants: Participant[]
  winnerIds: string[]
}>()

const emit = defineEmits<{
  'edit-participant': [participant: Participant]
  'delete-participant': [participant: Participant]
}>()

const filterQuery = ref('')
const sortField = ref<SortField>(null)
const sortDirection = ref<SortDirection>('asc')

function onFilterByName(value: string): void {
  filterQuery.value = value
}

function toggleSort(field: Exclude<SortField, null>): void {
  if (sortField.value !== field) {
    sortField.value = field
    sortDirection.value = 'asc'
  } else {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  }
}

const filteredParticipants = computed<Participant[]>(() => {
  const query = filterQuery.value.trim().toLowerCase()
  if (!query) return props.participants
  return props.participants.filter((participant) =>
    participant.name.toLowerCase().includes(query)
  )
})

const displayedParticipants = computed<Participant[]>(() => {
  const field = sortField.value
  if (!field) return filteredParticipants.value

  const direction = sortDirection.value === 'asc' ? 1 : -1
  return [...filteredParticipants.value].sort((a, b) => {
    if (field === 'name') return a.name.localeCompare(b.name) * direction
    return (a.dateOfBirth < b.dateOfBirth ? -1 : a.dateOfBirth > b.dateOfBirth ? 1 : 0) * direction
  })
})

function isWinner(participant: Participant): boolean {
  return props.winnerIds.includes(participant.id)
}

function formatDate(value: string): string {
  if (!value) return ''
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}
</script>

<template>
  <section class="card-block p-4">
    <SearchBar @filter-by-name="onFilterByName" />

    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>
              Name
              <span
                class="sort-icon"
                :class="{ 'is-active': sortField === 'name' }"
                role="button"
                title="Сортувати за іменем"
                @click="toggleSort('name')"
              >
                {{ sortField === 'name' && sortDirection === 'desc' ? '▼' : '▲' }}
              </span>
            </th>
            <th>
              Date of Birth
              <span
                class="sort-icon"
                :class="{ 'is-active': sortField === 'dateOfBirth' }"
                role="button"
                title="Сортувати за датою народження"
                @click="toggleSort('dateOfBirth')"
              >
                {{ sortField === 'dateOfBirth' && sortDirection === 'desc' ? '▼' : '▲' }}
              </span>
            </th>
            <th>Email</th>
            <th>Phone number</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="displayedParticipants.length === 0">
            <td colspan="7" class="text-center text-muted py-3">Учасників не знайдено.</td>
          </tr>
          <tr
            v-for="(participant, index) in displayedParticipants"
            :key="participant.id"
            :class="{ 'table-warning': isWinner(participant) }"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ participant.name }}</td>
            <td>{{ formatDate(participant.dateOfBirth) }}</td>
            <td>{{ participant.email }}</td>
            <td>{{ participant.phone }}</td>
            <td>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                @click="emit('edit-participant', participant)"
              >
                Редагувати дані
              </button>
            </td>
            <td>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="emit('delete-participant', participant)"
              >
                Видалити учасника
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
