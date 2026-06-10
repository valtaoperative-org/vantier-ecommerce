<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@features/cart/store'
import { useCheckoutStore } from '@features/checkout/store'
import type { ShippingRate } from '../types'
import { formatUSD, formatMXNFromUSD } from '@shared/utils/formatters'
import { useI18n } from 'vue-i18n'
import { checkoutMessages } from '@shared/i18n/messages/checkout'

const props = defineProps<{ shippingRate?: ShippingRate | null }>()

const cart = useCartStore()
const checkout = useCheckoutStore()
const { t } = useI18n({ messages: checkoutMessages })
const total = computed(() => Math.max(0, cart.subtotal - checkout.discountAmount) + (props.shippingRate?.price_usd ?? 0))
</script>

<template>
  <aside class="sticky top-24 bg-[color:var(--color-warm-beige)] p-6 space-y-4">
    <h2 class="text-[length:var(--text-small)] tracking-[var(--tracking-label)] uppercase font-medium">{{ t('checkout.summary.title') }}</h2>

    <!-- Line items -->
    <div class="space-y-3 border-b border-[color:var(--color-border)] pb-4">
      <div
        v-for="item in cart.items"
        :key="item.variantId"
        class="flex justify-between gap-4"
      >
        <div class="flex-1 min-w-0">
          <p class="text-[length:var(--text-small)] truncate text-[color:var(--color-on-surface)]">{{ item.name }}</p>
          <p class="text-[length:var(--text-micro)] text-[color:var(--color-border-strong)]">{{ item.color }} · {{ item.size }} · {{ t('checkout.summary.quantity', { quantity: item.quantity }) }}</p>
        </div>
        <p class="text-[length:var(--text-small)] text-[color:var(--color-on-surface)] flex-shrink-0">
          {{ formatUSD(item.priceUSD * item.quantity) }}
        </p>
      </div>
    </div>

    <!-- Totals -->
    <div class="space-y-2">
      <div class="flex justify-between text-[length:var(--text-small)] text-[color:var(--color-on-surface)]">
        <span>{{ t('checkout.summary.subtotal') }}</span>
        <span>{{ formatUSD(cart.subtotal) }}</span>
      </div>
      <div v-if="checkout.discountAmount > 0" class="flex justify-between text-[length:var(--text-small)] text-green-700">
        <span>{{ t('checkout.summary.discount', { code: checkout.discountCode }) }}</span>
        <span>-{{ formatUSD(checkout.discountAmount) }}</span>
      </div>
      <div class="flex justify-between text-[length:var(--text-small)] text-[color:var(--color-border-strong)]">
        <span>{{ t('checkout.summary.shipping') }}</span>
        <span>
          <span v-if="!shippingRate">—</span>
          <span v-else-if="cart.freeShipping || shippingRate.price_usd === 0">{{ t('checkout.summary.free') }}</span>
          <span v-else>{{ formatUSD(shippingRate.price_usd) }}</span>
        </span>
      </div>
      <div class="flex justify-between text-[length:var(--text-small)] font-semibold text-[color:var(--color-on-surface)] pt-2 border-t border-[color:var(--color-border)]">
        <span>{{ t('checkout.summary.total') }}</span>
        <div class="text-right">
          <span>{{ formatUSD(total) }}</span>
          <p class="text-[length:var(--text-micro)] font-normal text-[color:var(--color-border-strong)]">(~{{ formatMXNFromUSD(total) }})</p>
        </div>
      </div>
    </div>
  </aside>
</template>
