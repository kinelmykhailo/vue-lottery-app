<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog'

const props = withDefaults(
  defineProps<{
    group?: string
  }>(),
  {
    group: undefined
  }
)
</script>

<template>
  <ConfirmDialog :group="props.group" class="app-confirm-dialog" />
</template>

<style scoped lang="scss">
:deep(.p-confirm-dialog) {
  max-width: 450px;
}
</style>
