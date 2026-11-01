<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { Participant, ParticipantFormData } from '@/types/participant'
import { isSameEmail } from '@/utils/validation'
import { useParticipantForm } from '@/composables/useParticipantForm'

import WinnersBlock from '@/components/WinnersBlock.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import Modal from '@/components/Modal.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const STORAGE_KEY = 'vue-lottery-app:state'

interface PersistedState {
  participants: Participant[]
  winnerIds: string[]
}

const store = reactive<PersistedState>({
  participants: [],
  winnerIds: []
})

onMounted(() => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    store.participants = parsed.participants ?? []
    store.winnerIds = parsed.winnerIds ?? []
  } catch {
  }
})

watch(
  store,
  () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  },
  { deep: true }
)


const winners = computed<Participant[]>(() =>
  store.winnerIds
    .map((id) => store.participants.find((p) => p.id === id))
    .filter((p): p is Participant => Boolean(p))
)

const canPickWinner = computed<boolean>(
  () =>
    store.winnerIds.length < 3 &&
    store.participants.some((p) => !store.winnerIds.includes(p.id))
)

function pickWinner(): void {
  if (!canPickWinner.value) return

  const eligible = store.participants.filter((p) => !store.winnerIds.includes(p.id))
  const randomIndex = Math.floor(Math.random() * eligible.length)
  store.winnerIds.push(eligible[randomIndex].id)
}

function removeWinner(id: string): void {
  store.winnerIds = store.winnerIds.filter((winnerId) => winnerId !== id)
}


function isEmailTaken(email: string): boolean {
  return store.participants.some((p) => isSameEmail(p.email, email))
}

function registerParticipant(data: ParticipantFormData): void {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`

  store.participants.push({ id, ...data })
}


const isEditModalOpen = ref(false)
const editingParticipant = ref<Participant | null>(null)

const EMPTY_FORM: ParticipantFormData = { name: '', dateOfBirth: '', email: '', phone: '' }

const editForm = useParticipantForm(
  { ...EMPTY_FORM },
  (email) =>
    store.participants.some(
      (p) => p.id !== editingParticipant.value?.id && isSameEmail(p.email, email)
    )
)

function openEditModal(participant: Participant): void {
  editingParticipant.value = participant
  editForm.resetForm({
    name: participant.name,
    dateOfBirth: participant.dateOfBirth,
    email: participant.email,
    phone: participant.phone
  })
  isEditModalOpen.value = true
}

function submitEdit(): void {
  if (!editForm.validateAll() || !editingParticipant.value) return

  const index = store.participants.findIndex((p) => p.id === editingParticipant.value?.id)
  if (index !== -1) {
    store.participants[index] = { id: editingParticipant.value.id, ...editForm.form }
  }
  isEditModalOpen.value = false
}

/* ---------------------------- Видалення ---------------------------- */

const isDeleteModalOpen = ref(false)
const deletingParticipant = ref<Participant | null>(null)

function openDeleteModal(participant: Participant): void {
  deletingParticipant.value = participant
  isDeleteModalOpen.value = true
}

function confirmDelete(): void {
  if (!deletingParticipant.value) return

  const id = deletingParticipant.value.id
  store.participants = store.participants.filter((p) => p.id !== id)
  store.winnerIds = store.winnerIds.filter((winnerId) => winnerId !== id)
  isDeleteModalOpen.value = false
  deletingParticipant.value = null
}

function cancelDelete(): void {
  isDeleteModalOpen.value = false
  deletingParticipant.value = null
}
</script>

<template>
  <div class="app">
    <WinnersBlock
      :winners="winners"
      :can-pick-winner="canPickWinner"
      @pick-winner="pickWinner"
      @remove-winner="removeWinner"
    />

    <RegisterForm :is-email-taken="isEmailTaken" @register="registerParticipant" />

    <ParticipantsTable
      :participants="store.participants"
      :winner-ids="store.winnerIds"
      @edit-participant="openEditModal"
      @delete-participant="openDeleteModal"
    />

    <Modal v-model="isEditModalOpen" title="Редагувати дані">
      <template #body>
        <BaseInput
          v-model="editForm.form.name"
          label="Name"
          :error="editForm.errors.name"
          :touched="editForm.touched.name"
          @blur="editForm.handleBlur('name')"
        />
        <BaseInput
          v-model="editForm.form.dateOfBirth"
          type="date"
          label="Date of Birth"
          :error="editForm.errors.dateOfBirth"
          :touched="editForm.touched.dateOfBirth"
          @blur="editForm.handleBlur('dateOfBirth')"
        />
        <BaseInput
          v-model="editForm.form.email"
          type="email"
          label="Email"
          :error="editForm.errors.email"
          :touched="editForm.touched.email"
          @blur="editForm.handleBlur('email')"
        />
        <BaseInput
          v-model="editForm.form.phone"
          type="tel"
          label="Phone number"
          :error="editForm.errors.phone"
          :touched="editForm.touched.phone"
          @blur="editForm.handleBlur('phone')"
        />
      </template>
      <template #footer>
        <BaseButton variant="secondary" @click="isEditModalOpen = false">Скасувати</BaseButton>
        <BaseButton @click="submitEdit">Оновити дані</BaseButton>
      </template>
    </Modal>

    <Modal v-model="isDeleteModalOpen" title="Видалення учасника">
      <template #body>
        <p v-if="deletingParticipant" class="mb-0">
          Ви дійсно бажаєте видалити учасника
          <strong>"{{ deletingParticipant.name }}"</strong>,
          <strong>"{{ deletingParticipant.email }}"</strong>?
        </p>
      </template>
      <template #footer>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
        <BaseButton variant="secondary" @click="cancelDelete">Ні</BaseButton>
      </template>
    </Modal>
  </div>
</template>
