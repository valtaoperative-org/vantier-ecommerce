<script setup lang="ts">
import type { CheckoutStep } from '../types'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { checkoutMessages } from '@shared/i18n/messages/checkout'

defineProps<{ currentStep: CheckoutStep }>()

const { t } = useI18n({ messages: checkoutMessages })
const steps = computed<{ key: CheckoutStep; label: string }[]>(() => [
  { key: 'address', label: t('checkout.steps.address') },
  { key: 'shipping', label: t('checkout.steps.shipping') },
  { key: 'payment', label: t('checkout.steps.payment') },
])

const order: CheckoutStep[] = ['address', 'shipping', 'payment', 'confirmation']

function isCompleted(key: CheckoutStep, current: CheckoutStep) {
  return order.indexOf(key) < order.indexOf(current)
}
function isActive(key: CheckoutStep, current: CheckoutStep) {
  return key === current
}
</script>

<template>
  <nav :aria-label="t('checkout.steps.label')" class="flex items-center gap-0 mb-10">
    <template v-for="(step, i) in steps" :key="step.key">
      <div class="flex items-center gap-2">
        <!-- Circle -->
        <div
          class="w-7 h-7 rounded-full border flex items-center justify-center text-[length:var(--text-micro)] font-semibold transition-colors duration-[var(--duration-normal)]"
          :class="[
            isCompleted(step.key, currentStep)
              ? 'bg-[color:var(--color-obsidian)] border-[color:var(--color-obsidian)] text-[color:var(--color-ivory)]'
              : isActive(step.key, currentStep)
                ? 'border-[color:var(--color-amber-accent)] text-[color:var(--color-amber-accent)]'
                : 'border-[color:var(--color-border)] text-[color:var(--color-border-strong)]'
          ]"
        >
          <svg v-if="isCompleted(step.key, currentStep)" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span v-else>{{ i + 1 }}</span>
        </div>
        <!-- Label -->
        <span
          class="text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-label)] transition-colors duration-[var(--duration-normal)]"
          :class="isActive(step.key, currentStep) ? 'text-[color:var(--color-amber-accent)] font-medium' : 'text-[color:var(--color-border-strong)]'"
        >
          {{ step.label }}
        </span>
      </div>
      <!-- Divider -->
      <div v-if="i < steps.length - 1" class="flex-1 h-px bg-[color:var(--color-border)] mx-3" />
    </template>
  </nav>
</template>
