<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useCartStore } from '@features/cart/store'
import FreeShippingBar from '@shared/components/FreeShippingBar.vue'
import { formatUSD, formatMXNFromUSD } from '@shared/utils/formatters'
import { useI18n } from 'vue-i18n'
import { checkoutMessages } from '@shared/i18n/messages/checkout'

const cart = useCartStore()
const { t } = useI18n({ messages: checkoutMessages })
</script>

<template>
  <div class="border-t border-[color:var(--color-border)] pt-4 space-y-4">
    <FreeShippingBar />



    <div class="space-y-2 pt-2">
      <div class="flex justify-between text-[length:var(--text-small)] text-[color:var(--color-on-surface)]">
        <span>{{ t('cart.subtotal') }}</span>
        <div class="text-right">
          <span class="font-medium">{{ formatUSD(cart.subtotal) }}</span>
          <p class="text-[length:var(--text-micro)] text-[color:var(--color-border-strong)]">(~{{ formatMXNFromUSD(cart.subtotal) }})</p>
        </div>
      </div>
      <div class="flex justify-between text-[length:var(--text-small)] text-[color:var(--color-border-strong)]">
        <span>{{ t('cart.shipping') }}</span>
        <span>{{ cart.freeShipping ? t('cart.free') : t('cart.calculatedAtCheckout') }}</span>
      </div>
    </div>

    <RouterLink
      to="/checkout"
      class="block w-full text-center py-4 bg-[color:var(--color-obsidian)] text-[color:var(--color-ivory)] text-[length:var(--text-small)] tracking-[var(--tracking-label)] uppercase hover:opacity-80 transition-opacity duration-[var(--duration-normal)]"
    >
      {{ t('cart.checkout') }}
    </RouterLink>

    <p class="text-center text-[length:var(--text-micro)] text-[color:var(--color-border-strong)]">
      {{ t('cart.taxes') }}
    </p>
  </div>
</template>
