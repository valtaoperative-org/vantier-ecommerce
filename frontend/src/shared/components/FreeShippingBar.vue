<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@features/cart/store'
import { useI18n } from 'vue-i18n'

const cart = useCartStore()
const { t } = useI18n()
const THRESHOLD = 5
const progress = computed(() => Math.min(cart.totalItems / THRESHOLD, 1))
const remaining = computed(() => Math.max(THRESHOLD - cart.totalItems, 0))
const achieved = computed(() => cart.totalItems >= THRESHOLD)
</script>
<template>
  <div class="w-full">
    <p class="text-[length:var(--text-micro)] font-medium mb-2 text-[color:var(--color-on-surface)]">
      <span v-if="achieved">{{ t('shared.shipping.achieved') }}</span>
      <span v-else>{{ t(remaining === 1 ? 'shared.shipping.remaining' : 'shared.shipping.remainingPlural', { count: remaining }) }}</span>
    </p>
    <div class="h-0.5 bg-[color:var(--color-border)] w-full overflow-hidden">
      <div
        class="h-full bg-[color:var(--color-amber-accent)] transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out-expo)]"
        :style="{ width: `${progress * 100}%` }"
        :class="{ 'animate-[threshold-pulse_400ms_ease-out_1]': achieved }"
      />
    </div>
  </div>
</template>
