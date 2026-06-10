<script setup lang="ts">
import type { Product } from '../types'
import ProductCard from './ProductCard.vue'
import { useI18n } from 'vue-i18n'
import messages from '@/shared/i18n/messages/products'
const { t } = useI18n({ messages })

defineProps<{
  relatedProducts: Product[]
}>()
</script>

<template>
  <section v-if="relatedProducts.length > 0" class="bg-[color:var(--color-warm-beige)] py-16 px-[var(--spacing-container)] border-t border-[color:var(--color-obsidian)]/5">
    <div class="max-w-[var(--container-max)] mx-auto">

      <!-- Header -->
      <p class="text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-display)] text-[color:var(--color-obsidian)]/35 mb-2">
        {{ t('products.related.eyebrow') }}
      </p>
      <div class="flex items-end justify-between mb-3">
        <h2 class="text-[length:var(--text-headline)] font-light uppercase tracking-[var(--tracking-headline)] text-[color:var(--color-obsidian)]">
          {{ t('products.related.title') }}
        </h2>
        <RouterLink
          to="/shop"
          class="hidden sm:inline-flex items-center gap-2 text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-label)] opacity-40 hover:opacity-100 transition-opacity duration-[var(--duration-normal)] mb-1"
        >
          {{ t('products.related.viewAll') }}
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </RouterLink>
      </div>
      <div class="w-7 h-px bg-[color:var(--color-amber-accent)] mb-10" />

      <!-- Grid: related cards + shop-all tile -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-[var(--spacing-card-gap)]">

        <!-- Real product cards -->
        <ProductCard
          v-for="product in relatedProducts"
          :key="product.id"
          :product="product"
        />

        <!-- Shop all editorial tile -->
        <RouterLink
          to="/shop"
          class="relative aspect-[3/4] bg-[color:var(--color-obsidian)] overflow-hidden flex flex-col items-center justify-center group"
          data-shop-all
        >
          <div class="absolute top-0 left-0 w-5 h-px bg-[color:var(--color-amber-accent)]" />
          <div class="text-center px-6">
            <p class="text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-display)] text-[color:var(--color-ivory)]/30 mb-2">{{ t('products.related.shopEntire') }}</p>
            <h3 class="text-[length:var(--text-title)] font-light tracking-[var(--tracking-headline)] text-[color:var(--color-ivory)]/65 group-hover:text-[color:var(--color-ivory)] transition-colors duration-[var(--duration-normal)]">
              {{ t('products.related.collection') }}
            </h3>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
