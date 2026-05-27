<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@features/cart/store'
import { useCheckoutStore } from '@features/checkout/store'
import { validateDiscount } from '@features/checkout/api'

const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()

const code = ref(checkoutStore.discountCode || '')
const state = ref<'idle' | 'loading' | 'success' | 'error'>(checkoutStore.discountCode ? 'success' : 'idle')
const errorMessage = ref('')

async function apply() {
  if (!code.value.trim()) return
  state.value = 'loading'
  
  try {
    const data = await validateDiscount(code.value.trim(), cartStore.subtotal)
    state.value = 'success'
    checkoutStore.discountCode = code.value.trim().toUpperCase()
    checkoutStore.discountAmount = data.discount_amount_usd
  } catch (err: any) {
    state.value = 'error'
    checkoutStore.discountCode = null
    checkoutStore.discountAmount = 0
    errorMessage.value = err.response?.data?.detail || 'Invalid or expired discount code'
  }
}

function reset() {
  code.value = ''
  state.value = 'idle'
  errorMessage.value = ''
  checkoutStore.discountCode = null
  checkoutStore.discountAmount = 0
}
</script>

<template>
  <div class="w-full">
    <div class="flex gap-2">
      <input
        v-model="code"
        type="text"
        placeholder="Discount code"
        :disabled="state === 'loading' || state === 'success'"
        class="flex-1 border border-[color:var(--color-border)] bg-transparent px-3 py-2 text-[length:var(--text-small)] text-[color:var(--color-on-surface)] placeholder:text-[color:var(--color-border-strong)] focus:outline-none focus:border-[color:var(--color-obsidian)] transition-colors duration-[var(--duration-fast)] disabled:opacity-50"
        @keydown.enter="apply"
      />
      <button
        v-if="state !== 'success'"
        :disabled="state === 'loading' || !code.trim()"
        class="px-4 py-2 bg-[color:var(--color-obsidian)] text-[color:var(--color-ivory)] text-[length:var(--text-small)] tracking-[var(--tracking-label)] uppercase hover:opacity-80 disabled:opacity-40 transition-opacity duration-[var(--duration-fast)]"
        @click="apply"
      >
        <span v-if="state === 'loading'" class="inline-block w-4 h-4 border-2 border-[color:var(--color-ivory)] border-t-transparent rounded-full animate-spin" />
        <span v-else>Apply</span>
      </button>
      <button
        v-else
        class="px-4 py-2 border border-[color:var(--color-border)] text-[length:var(--text-small)] tracking-[var(--tracking-label)] uppercase hover:opacity-70 transition-opacity duration-[var(--duration-fast)]"
        @click="reset"
      >
        Remove
      </button>
    </div>
    <p v-if="state === 'success'" class="mt-1.5 text-[length:var(--text-micro)] text-green-700">
      Code applied
    </p>
    <p v-if="state === 'error'" class="mt-1.5 text-[length:var(--text-micro)] text-red-600">
      {{ errorMessage }}
    </p>
  </div>
</template>
