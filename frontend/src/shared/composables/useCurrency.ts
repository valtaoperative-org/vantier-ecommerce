import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  CURRENCY_BY_LOCALE,
  DEFAULT_LOCALE,
  isSupportedLocale,
} from '@shared/i18n'

export function useCurrency() {
  const { locale } = useI18n()

  const activeLocale = computed(() => (
    isSupportedLocale(locale.value) ? locale.value : DEFAULT_LOCALE
  ))

  const formatter = computed(() => new Intl.NumberFormat(activeLocale.value, {
    style: 'currency',
    currency: CURRENCY_BY_LOCALE[activeLocale.value],
  }))

  function formatPrice(amountInCents: number): string {
    if (!Number.isFinite(amountInCents)) return formatter.value.format(0)
    return formatter.value.format(amountInCents / 100)
  }

  return {
    currency: computed(() => CURRENCY_BY_LOCALE[activeLocale.value]),
    formatPrice,
  }
}
