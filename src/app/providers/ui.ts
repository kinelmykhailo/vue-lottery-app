import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

export function setupUI(app: App): void {
  app.use(PrimeVue, { ripple: true })
  app.use(ConfirmationService)
  app.use(ToastService)
}
