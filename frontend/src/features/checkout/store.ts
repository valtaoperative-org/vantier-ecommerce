import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CheckoutStep, ShippingRate } from './types'

export const useCheckoutStore = defineStore('checkout', () => {
  const step = ref<CheckoutStep>('address')
  const shippingRate = ref<ShippingRate | null>(null)
  const discountCode = ref<string | null>(null)
  const discountAmount = ref<number>(0)
  const clientSecret = ref<string | null>(null)
  const orderId = ref<string | null>(null)

  function reset() {
    step.value = 'address'
    shippingRate.value = null
    discountCode.value = null
    discountAmount.value = 0
    clientSecret.value = null
    orderId.value = null
  }

  return { step, shippingRate, discountCode, discountAmount, clientSecret, orderId, reset }
})
