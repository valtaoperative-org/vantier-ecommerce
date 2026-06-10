<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import messages from '@/shared/i18n/messages/products'
const { t } = useI18n({ messages })
defineProps<{ stock: number; threshold?: number }>()
</script>
<template>
  <span
    v-if="stock <= (threshold ?? 50) && stock > 0"
    class="inline-block text-[length:var(--text-micro)] font-medium uppercase tracking-[var(--tracking-label)] text-[color:var(--color-amber-accent)] border border-[color:var(--color-amber-accent)] px-2 py-0.5"
  >
    {{ t('products.card.lowStock', { count: stock }) }}
  </span>
</template>
