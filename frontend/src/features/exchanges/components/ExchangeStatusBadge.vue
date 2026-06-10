<script setup lang="ts">
import type { ExchangeStatus } from '../types'
import { useI18n } from 'vue-i18n'
import { accountMessages } from '@shared/i18n/messages/account'

defineProps<{ status: ExchangeStatus }>()
const { t } = useI18n({ messages: accountMessages })

const styles: Record<ExchangeStatus, string> = {
  requested: 'bg-amber-50 text-amber-700 border border-amber-200',
  approved:  'bg-blue-50 text-blue-700 border border-blue-200',
  shipped:   'bg-violet-50 text-violet-700 border border-violet-200',
  completed: 'bg-green-50 text-green-700 border border-green-200',
}
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-pill)] text-[length:var(--text-micro)] font-medium uppercase tracking-[var(--tracking-label)]"
    :class="styles[status]"
  >
    {{ t(`exchanges.statuses.${status}`) }}
  </span>
</template>
