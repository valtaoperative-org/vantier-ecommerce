<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  DEFAULT_LOCALE,
  isSupportedLocale,
} from '@shared/i18n'
import { persistLocale } from '@shared/utils/geo'

const { locale, t } = useI18n()

function changeLocale(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (!isSupportedLocale(value)) return

  locale.value = value
  persistLocale(value)
  document.documentElement.lang = value
}

const currentLocale = computed(() => (
  isSupportedLocale(locale.value) ? locale.value : DEFAULT_LOCALE
))
</script>

<template>
  <label class="relative inline-flex items-center">
    <span class="sr-only">{{ t('locale.label') }}</span>
    <select
      :value="currentLocale"
      :aria-label="t('locale.label')"
      class="cursor-pointer appearance-none bg-transparent pr-4 text-[10px] font-medium uppercase tracking-[var(--tracking-label)] text-[color:var(--color-ivory)]/60 outline-none hover:text-[color:var(--color-ivory)]"
      @change="changeLocale"
    >
      <option value="en-US">{{ t('locale.english') }}</option>
      <option value="es-MX">{{ t('locale.spanish') }}</option>
    </select>
    <svg class="pointer-events-none absolute right-0 h-3 w-3 text-[color:var(--color-ivory)]/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="m7 10 5 5 5-5" />
    </svg>
  </label>
</template>
