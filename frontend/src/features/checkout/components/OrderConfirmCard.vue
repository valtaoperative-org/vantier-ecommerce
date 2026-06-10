<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { checkoutMessages } from '@shared/i18n/messages/checkout'

defineProps<{
  orderId: string
  email?: string
}>()
const { t } = useI18n({ messages: checkoutMessages })
</script>

<template>
  <div class="max-w-lg mx-auto py-16 px-6 text-center space-y-6">
    <!-- Check icon -->
    <div class="w-12 h-12 mx-auto rounded-full bg-[color:var(--color-obsidian)] flex items-center justify-center">
      <svg class="w-6 h-6 text-[color:var(--color-ivory)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>

    <div class="space-y-2">
      <p class="text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-label)] text-[color:var(--color-border-strong)]">
        {{ t('checkout.confirmation.confirmed') }}
      </p>
      <h1 class="text-[length:var(--text-headline)] font-semibold text-[color:var(--color-on-surface)]">
        {{ t('checkout.confirmation.thankYou') }}
      </h1>
      <p class="text-[length:var(--text-small)] text-[color:var(--color-border-strong)]">
        {{ t('checkout.confirmation.orderNumber', { orderId }) }}
      </p>
    </div>

    <div class="border border-[color:var(--color-border)] p-5 text-left space-y-2">
      <p class="text-[length:var(--text-small)] text-[color:var(--color-on-surface)]">
        {{ t('checkout.confirmation.estimatedDelivery', { days: t('checkout.confirmation.deliveryDays') }) }}
      </p>
      <p v-if="email" class="text-[length:var(--text-small)] text-[color:var(--color-border-strong)]">
        {{ t('checkout.confirmation.confirmationSent', { email }) }}
      </p>
      <p class="text-[length:var(--text-small)] text-[color:var(--color-border-strong)]">
        {{ t('checkout.confirmation.exchanges') }}
      </p>
    </div>

    <RouterLink
      to="/shop"
      class="inline-block px-10 py-3 bg-[color:var(--color-obsidian)] text-[color:var(--color-ivory)] text-[length:var(--text-small)] tracking-[var(--tracking-label)] uppercase hover:opacity-80 transition-opacity duration-[var(--duration-normal)]"
    >
      {{ t('checkout.confirmation.continueShopping') }}
    </RouterLink>
  </div>
</template>
