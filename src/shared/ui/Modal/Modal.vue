<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
  }>(),
  {
    title: ''
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialogRef = ref<HTMLElement | null>(null)

function close(): void {
  emit('update:modelValue', false)
}

// Ключовий модифікатор .esc закриває модальне вікно, поки воно відкрите.
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.modelValue) close()
}

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      await Promise.resolve()
      dialogRef.value?.focus()
    }
  }
)

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop-custom" @click.self="close">
        <Transition name="modal-zoom" appear>
          <div
            ref="dialogRef"
            class="modal-dialog-custom"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
          >
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <slot name="header">{{ title }}</slot>
                </h5>
                <button type="button" class="btn-close" aria-label="Закрити" @click="close" />
              </div>
              <div class="modal-body">
                <slot name="body" />
              </div>
              <div class="modal-footer">
                <slot name="footer" />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-dialog-custom {
  width: 100%;
  max-width: 480px;
  outline: none;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-zoom-enter-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.modal-zoom-enter-from {
  transform: scale(0.95);
  opacity: 0;
}
</style>
