<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCheckoutStore } from '../store'
import { useCartStore } from '@features/cart/store'
import { createPaymentIntent } from '../api'
import { uploadCustomizationFile } from '@features/uploads/api'
import type { ShippingRate } from '../types'
import CheckoutStepper from './CheckoutStepper.vue'
import GuestEmailInput from './GuestEmailInput.vue'
import AddressForm from './AddressForm.vue'
import type { AddressData } from './AddressForm.vue'
import ShippingMethodSelect from './ShippingMethodSelect.vue'
import StripePaymentForm from './StripePaymentForm.vue'
import OrderSummaryPanel from './OrderSummaryPanel.vue'
import SeoHead from '@shared/components/SeoHead.vue'
import DiscountCodeInput from '@features/cart/components/DiscountCodeInput.vue'

const router = useRouter()
const checkout = useCheckoutStore()
const cart = useCartStore()

const guestEmail = ref('')
const addressData = ref<AddressData | null>(null)
const preparingPayment = ref(false)
const prepareError = ref('')
const shippingUnavailable = ref(false)

function onAddressSubmit(data: AddressData) {
  addressData.value = data
  checkout.step = 'shipping'
}

function onShippingSelect(rate: ShippingRate) {
  shippingUnavailable.value = false
  checkout.shippingRate = rate
}

function onNoRates() {
  shippingUnavailable.value = true
  checkout.shippingRate = null
}

async function onShippingContinue() {
  if (preparingPayment.value) return  // synchronous double-click guard
  if (!checkout.shippingRate || !addressData.value) return
  preparingPayment.value = true
  prepareError.value = ''

  const addr = addressData.value
  try {
    const itemsPayload = await Promise.all(
      cart.items.map(async (i) => {
        if (i.isPersonalized) {
          // File may be lost after page reload (not persisted to localStorage).
          // If a fresh File is in memory, upload it. If only the preview URL exists
          // (tab still open, no reload), the cart store has the File reference.
          // If neither is available, surface an error so the user re-selects the file.
          let url: string | null = null
          if (i.customizationFile instanceof File) {
            url = await uploadCustomizationFile(i.customizationFile)
          } else if (i.customizationFileUrl && i.customizationFileUrl.startsWith('http')) {
            url = i.customizationFileUrl
          } else {
            throw new Error(`Por favor vuelve al carrito y vuelve a seleccionar el archivo de personalización para "${i.name}".`)
          }
          return {
            variant_id: i.variantId,
            qty: i.quantity,
            customization_file_url: url,
            customization_placement: i.customizationPlacement ?? null,
          }
        }
        return { variant_id: i.variantId, qty: i.quantity }
      })
    )

    const result = await createPaymentIntent({
      customer_email: guestEmail.value,
      customer_name: `${addr.firstName} ${addr.lastName}`,
      items: itemsPayload,
      shipping_address: {
        full_name: `${addr.firstName} ${addr.lastName}`,
        line1: addr.address1,
        line2: addr.address2 || undefined,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        country: addr.country,
        phone: addr.phone || undefined,
        district: addr.district || undefined,
      },
      discount_code: checkout.discountCode || null,
      selected_carrier_name: checkout.shippingRate.carrier_name,
      shipping_usd: checkout.shippingRate.price_usd,
    })

    checkout.clientSecret = result.client_secret
    checkout.orderId = result.order_id
    checkout.step = 'payment'
  } catch (err: unknown) {
    prepareError.value = err instanceof Error ? err.message : 'Could not prepare payment. Try again.'
  } finally {
    preparingPayment.value = false
  }
}

function onPaymentSuccess() {
  router.push(`/checkout/success?order_id=${checkout.orderId}`)
}
</script>

<template>
  <SeoHead
    title="Checkout — Vantier"
    description="Complete your order"
    :robots="{ index: false, follow: false }"
  />

  <div class="max-w-[var(--container-max)] mx-auto px-[var(--spacing-container)] py-12">
    <CheckoutStepper :current-step="checkout.step" />

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
      <!-- Left: form steps -->
      <div>
        <!-- Step 1: Address -->
        <template v-if="checkout.step === 'address'">
          <h2 class="text-[length:var(--text-title)] font-semibold mb-6 text-[color:var(--color-on-surface)]">
            Contact & Address
          </h2>
          <div class="space-y-4">
            <GuestEmailInput v-model="guestEmail" />
            <AddressForm @submit="onAddressSubmit" />
          </div>
        </template>

        <!-- Step 2: Shipping -->
        <template v-else-if="checkout.step === 'shipping'">
          <h2 class="text-[length:var(--text-title)] font-semibold mb-6 text-[color:var(--color-on-surface)]">
            Shipping Method
          </h2>
          <ShippingMethodSelect
            :zip="addressData?.zip ?? ''"
            :country="addressData?.country ?? 'US'"
            :city="addressData?.city ?? ''"
            :state="addressData?.state ?? ''"
            :district="addressData?.district ?? ''"
            :item-count="cart.totalItems"
            @select="onShippingSelect"
            @no-rates="onNoRates"
          />
          <p v-if="prepareError" class="mt-3 text-[length:var(--text-micro)] text-red-600">
            {{ prepareError }}
          </p>
          <button
            class="mt-6 w-full py-4 bg-[color:var(--color-obsidian)] text-[color:var(--color-ivory)] text-[length:var(--text-small)] tracking-[var(--tracking-label)] uppercase hover:opacity-80 disabled:opacity-40 transition-opacity duration-[var(--duration-normal)] flex items-center justify-center gap-2"
            :disabled="!checkout.shippingRate || preparingPayment || shippingUnavailable"
            @click="onShippingContinue"
          >
            <span
              v-if="preparingPayment"
              class="w-4 h-4 border-2 border-[color:var(--color-ivory)] border-t-transparent rounded-full animate-spin"
            />
            <span>{{ preparingPayment ? 'Preparing…' : 'Continue to Payment' }}</span>
          </button>
        </template>

        <!-- Step 3: Payment -->
        <template v-else-if="checkout.step === 'payment'">
          <h2 class="text-[length:var(--text-title)] font-semibold mb-6 text-[color:var(--color-on-surface)]">
            Payment
          </h2>
          <div class="mb-8">
            <DiscountCodeInput />
          </div>
          <StripePaymentForm
            v-if="checkout.clientSecret && checkout.orderId"
            :client-secret="checkout.clientSecret"
            :order-id="checkout.orderId"
            @success="onPaymentSuccess"
          />
        </template>
      </div>

      <!-- Right: order summary -->
      <OrderSummaryPanel :shipping-rate="checkout.shippingRate" />
    </div>
  </div>
</template>
