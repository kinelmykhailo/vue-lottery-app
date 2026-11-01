<script setup lang="ts">
import DataTable from 'primevue/datatable'

const props = withDefaults(
  defineProps<{
    value: unknown[]
    loading?: boolean
    stripedRows?: boolean
    showGridlines?: boolean
    responsiveLayout?: 'scroll' | 'stack'
    dataKey?: string
  }>(),
  {
    loading: false,
    stripedRows: true,
    showGridlines: false,
    responsiveLayout: 'scroll',
    dataKey: 'id'
  }
)
</script>

<template>
  <div class="app-table-wrapper">
    <DataTable
      :value="props.value"
      :loading="props.loading"
      :striped-rows="props.stripedRows"
      :show-gridlines="props.showGridlines"
      :responsive-layout="props.responsiveLayout"
      :data-key="props.dataKey"
      class="app-datatable p-datatable-sm"
    >
      <slot />
      <template #empty>
        <div class="text-center py-4 text-muted">
          <slot name="empty">Немає даних для відображення</slot>
        </div>
      </template>
      <template #loading>
        <div class="text-center py-4 text-muted">
          Завантаження даних...
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">
.app-table-wrapper {
  background: #ffffff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  :deep(.p-datatable-thead > tr > th) {
    background: #f8fafc;
    color: #475569;
    font-size: 0.825rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    padding: 0.85rem 1rem;
    border-color: #e2e8f0;
  }

  :deep(.p-datatable-tbody > tr > td) {
    padding: 0.85rem 1rem;
    font-size: 0.9rem;
    border-color: #f1f5f9;
  }
}
</style>
