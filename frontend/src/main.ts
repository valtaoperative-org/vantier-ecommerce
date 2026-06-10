import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './app/App.vue'
import router from './app/router'
import { pinia } from './app/plugins/pinia'
import { i18n } from './shared/i18n'
import { determineInitialLocale } from './shared/utils/geo'
import { useAuthStore } from './features/auth/store'
import './style.css'

async function bootstrap() {
  const locale = await determineInitialLocale()
  i18n.global.locale.value = locale
  document.documentElement.lang = locale

  const app = createApp(App)
    .use(pinia)
    .use(router)
    .use(i18n)
    .use(createHead())

  const auth = useAuthStore()
  try {
    await auth.syncFromNeonAuth()
  } finally {
    app.mount('#app')
  }
}

void bootstrap()
