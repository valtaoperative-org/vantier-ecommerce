<script setup lang="ts">
import { computed } from 'vue'
import type { ProductLine } from '../types'
import { LINE_LABELS } from '../types'
import { useI18n } from 'vue-i18n'
import messages from '@/shared/i18n/messages/products'
const { t } = useI18n({ messages })

const props = defineProps<{ open: boolean; line?: ProductLine }>()
const emit = defineEmits<{ (e: 'close'): void }>()

type Chart = {
  columns: string[]
  rows: (string | number)[][]
}

const CHARTS: Record<ProductLine, Chart> = {
  essential: {
    columns: ['size', 'chest', 'length'],
    rows: [
      ['S', 92, 68],
      ['M', 98, 72],
      ['L', 108, 75],
      ['XL', 116, 78],
      ['XXL', 120, 80],
    ],
  },
  signature: {
    columns: ['size', 'chest', 'shoulder', 'length'],
    rows: [
      ['S', 105.99, 46.50, 74.98],
      ['M', 112.97, 48.48, 76.98],
      ['L', 121.99, 50.97, 78.99],
      ['XL', 130.98, 53.49, 80.97],
      ['XXL', 139.97, 55.98, 82.98],
      ['XXXL', 150.24, 59.23, 86.23],
    ],
  },
  polo_atelier: {
    columns: ['size', 'chest', 'shoulder', 'length'],
    rows: [
      ['S', 110, 46, 65],
      ['M', 114, 47, 67],
      ['L', 118, 48, 69],
      ['XL', 122, 49, 71],
      ['XXL', 127, 50, 73],
    ],
  },
}

const chart = computed<Chart>(() => CHARTS[props.line ?? 'essential'] ?? CHARTS.essential)
const lineTitle = computed(() => props.line
  ? t(`products.labels.lines.${props.line}`, LINE_LABELS[props.line])
  : '')
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        @click.self="emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-[color:var(--color-obsidian)]/40 backdrop-blur-[2px]" @click="emit('close')" />

        <!-- Panel -->
        <div class="relative z-10 bg-[color:var(--color-surface)] w-full max-w-lg p-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <p class="text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-label)] text-[color:var(--color-border-strong)] mb-1">{{ lineTitle || t('products.sizeGuide.guide') }}</p>
              <h2 class="text-[length:var(--text-title)] font-semibold tracking-[var(--tracking-headline)]">{{ t('products.sizeGuide.title') }}</h2>
            </div>
            <button
              class="w-8 h-8 flex items-center justify-center text-[color:var(--color-border-strong)] hover:text-[color:var(--color-obsidian)] transition-colors"
              :aria-label="t('products.sizeGuide.close')"
              @click="emit('close')"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <p class="text-[length:var(--text-small)] text-[color:var(--color-border-strong)] mb-5">
            {{ t('products.sizeGuide.instructions') }}
          </p>

          <div class="overflow-x-auto">
            <table class="w-full text-[length:var(--text-small)]">
              <thead>
                <tr class="border-b border-[color:var(--color-border)]">
                  <th
                    v-for="(col, i) in chart.columns"
                    :key="col"
                    class="py-2 text-left text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-label)] font-medium text-[color:var(--color-border-strong)]"
                    :class="i < chart.columns.length - 1 ? 'pr-6' : ''"
                  >
                    {{ t(`products.sizeGuide.columns.${col}`) }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in chart.rows"
                  :key="String(row[0])"
                  class="border-b border-[color:var(--color-border)] last:border-0"
                >
                  <td
                    v-for="(cell, i) in row"
                    :key="i"
                    class="py-3"
                    :class="[
                      i < row.length - 1 ? 'pr-6' : '',
                      i === 0 ? 'font-medium text-[color:var(--color-on-surface)]' : 'text-[color:var(--color-border-strong)]',
                    ]"
                  >
                    {{ cell }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity var(--duration-normal) ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
