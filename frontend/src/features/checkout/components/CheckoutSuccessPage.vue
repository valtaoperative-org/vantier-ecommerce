<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@features/cart/store'
import { useCheckoutStore } from '../store'
import { apiClient } from '@shared/api/client'
import OrderConfirmCard from './OrderConfirmCard.vue'
import SeoHead from '@shared/components/SeoHead.vue'
import { useI18n } from 'vue-i18n'
import { checkoutMessages } from '@shared/i18n/messages/checkout'

interface OrderItem {
  id: string
  variant_id: string
  qty: number
  unit_price_usd: string
}

interface OrderDetail {
  id: string
  customer_email: string
  customer_name: string | null
  status: string
  subtotal_usd: string
  shipping_usd: string
  discount_usd: string
  total_usd: string
  is_free_shipping: boolean
  shipping_address: Record<string, string>
  carrier_tracking_number: string | null
  items: OrderItem[]
  created_at: string
}

const route = useRoute()
const cart = useCartStore()
const checkout = useCheckoutStore()

const orderId = (route.query.order_id as string) ?? ''
const order = ref<OrderDetail | null>(null)
const loading = ref(true)
const error = ref(false)
const { t } = useI18n({ messages: checkoutMessages })

onMounted(async () => {
  cart.clear()
  checkout.reset()

  if (!orderId) {
    loading.value = false
    return
  }

  // Retry up to 5x with 1.5s gap — webhook may arrive slightly after redirect
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const { data } = await apiClient.get<OrderDetail>(`/orders/confirmation/${orderId}`)
      order.value = data
      loading.value = false
      return
    } catch {
      if (attempt < 4) await new Promise(r => setTimeout(r, 1500))
    }
  }

  error.value = true
  loading.value = false
})

import { formatUSD, formatMXNFromUSD } from '@shared/utils/formatters'

function formatPrice(n: string | number) {
  return formatUSD(Number(n))
}
</script>

<template>
  <SeoHead
    :title="t('checkout.seo.confirmedTitle')"
    :description="t('checkout.seo.confirmedDescription')"
    :robots="{ index: false, follow: false }"
  />

  <!-- Loading -->
  <div v-if="loading" class="max-w-lg mx-auto py-16 px-6 space-y-4">
    <div class="h-12 w-12 mx-auto bg-[color:var(--color-warm-beige)] animate-pulse rounded-full" />
    <div class="h-6 w-40 mx-auto bg-[color:var(--color-warm-beige)] animate-pulse" />
    <div class="h-4 w-60 mx-auto bg-[color:var(--color-warm-beige)] animate-pulse" />
  </div>

  <!-- Error fallback -->
  <OrderConfirmCard v-else-if="error || !order" :order-id="orderId" />

  <!-- Full confirmation -->
  <div v-else class="max-w-lg mx-auto py-16 px-6 space-y-8">
    <!-- Header -->
    <div class="text-center space-y-4">
      <div class="w-12 h-12 mx-auto rounded-full bg-[color:var(--color-obsidian)] flex items-center justify-center">
        <svg class="w-6 h-6 text-[color:var(--color-ivory)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <p class="text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-label)] text-[color:var(--color-border-strong)]">
        {{ t('checkout.confirmation.confirmed') }}
      </p>
      <h1 class="text-[length:var(--text-headline)] font-semibold text-[color:var(--color-on-surface)]">
        {{ order.customer_name
          ? t('checkout.confirmation.thankYouName', { name: order.customer_name.split(' ')[0] })
          : t('checkout.confirmation.thankYou') }}
      </h1>
      <p class="text-[length:var(--text-small)] text-[color:var(--color-border-strong)]">
        {{ t('checkout.confirmation.orderNumber', { orderId: order.id.slice(0, 8).toUpperCase() }) }}
      </p>
    </div>

    <!-- Items -->
    <div class="border border-[color:var(--color-border)] divide-y divide-[color:var(--color-border)]">
      <div
        v-for="item in order.items"
        :key="item.id"
        class="flex justify-between items-center px-4 py-3"
      >
        <div>
          <p class="text-[length:var(--text-small)] text-[color:var(--color-on-surface)]">
            {{ t('checkout.confirmation.variant', { id: item.variant_id.slice(0, 8) }) }}
          </p>
          <p class="text-[length:var(--text-micro)] text-[color:var(--color-border-strong)]">
            {{ t('checkout.confirmation.quantity', { quantity: item.qty }) }}
          </p>
        </div>
        <p class="text-[length:var(--text-small)] font-medium text-[color:var(--color-on-surface)]">
          {{ formatPrice(Number(item.unit_price_usd) * item.qty) }}
        </p>
      </div>
    </div>

    <!-- Totals -->
    <div class="space-y-2 text-[length:var(--text-small)]">
      <div class="flex justify-between text-[color:var(--color-border-strong)]">
        <span>{{ t('checkout.confirmation.subtotal') }}</span>
        <span>{{ formatPrice(order.subtotal_usd) }}</span>
      </div>
      <div class="flex justify-between text-[color:var(--color-border-strong)]">
        <span>{{ t('checkout.confirmation.shipping') }}</span>
        <span>{{ order.is_free_shipping ? t('checkout.confirmation.free') : formatPrice(order.shipping_usd) }}</span>
      </div>
      <div v-if="Number(order.discount_usd) > 0" class="flex justify-between text-green-700">
        <span>{{ t('checkout.confirmation.discount') }}</span>
        <span>-{{ formatPrice(order.discount_usd) }}</span>
      </div>
      <div class="flex justify-between font-semibold text-[color:var(--color-on-surface)] border-t border-[color:var(--color-border)] pt-2">
        <span>{{ t('checkout.confirmation.total') }}</span>
        <div class="text-right">
          <span>{{ formatPrice(order.total_usd) }}</span>
          <p class="text-[length:var(--text-micro)] font-normal text-[color:var(--color-border-strong)]">(~{{ formatMXNFromUSD(Number(order.total_usd)) }})</p>
        </div>
      </div>
    </div>

    <!-- Delivery info -->
    <div class="border border-[color:var(--color-border)] p-4 space-y-1 text-[length:var(--text-small)]">
      <p class="text-[color:var(--color-on-surface)]">
        {{ t('checkout.confirmation.shippingTo', { city: order.shipping_address.city, state: order.shipping_address.state }) }}
      </p>
      <p v-if="order.carrier_tracking_number" class="text-[color:var(--color-border-strong)]">
        {{ t('checkout.confirmation.tracking', { number: order.carrier_tracking_number }) }}
      </p>
      <p v-else class="text-[color:var(--color-border-strong)]">
        {{ t('checkout.confirmation.estimatedDelivery', { days: t('checkout.confirmation.deliveryDays') }) }}
      </p>
      <p class="text-[color:var(--color-border-strong)]">
        {{ t('checkout.confirmation.emailSent', { email: order.customer_email }) }}
      </p>
    </div>

    <!-- CTA -->
    <div class="text-center">
      <RouterLink
        to="/shop"
        class="inline-block px-10 py-3 bg-[color:var(--color-obsidian)] text-[color:var(--color-ivory)] text-[length:var(--text-small)] tracking-[var(--tracking-label)] uppercase hover:opacity-80 transition-opacity duration-[var(--duration-normal)]"
      >
        {{ t('checkout.confirmation.continueShopping') }}
      </RouterLink>
    </div>
  </div>
</template>
