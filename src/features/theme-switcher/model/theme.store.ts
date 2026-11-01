import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark'

export const useThemeStore = defineStore(
  'theme',
  () => {
    const currentTheme = ref<Theme>(
      (localStorage.getItem('app:theme') as Theme) || 'light'
    )

    function applyTheme(theme: Theme): void {
      document.documentElement.setAttribute('data-bs-theme', theme)
      if (theme === 'dark') {
        document.body.classList.add('dark-theme')
      } else {
        document.body.classList.remove('dark-theme')
      }
    }

    function toggleTheme(): void {
      currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
      localStorage.setItem('app:theme', currentTheme.value)
      applyTheme(currentTheme.value)
    }

    function initTheme(): void {
      applyTheme(currentTheme.value)
    }

    watch(
      currentTheme,
      (newTheme) => {
        applyTheme(newTheme)
      },
      { immediate: true }
    )

    return {
      currentTheme,
      toggleTheme,
      initTheme
    }
  },
  {
    persist: {
      key: 'app:theme:persisted',
      paths: ['currentTheme']
    }
  }
)
