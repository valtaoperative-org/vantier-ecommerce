<script setup lang="ts">
import { computed } from 'vue'
import type { ProductFilters, ProductLine, ProductStyle } from '../types'
import { LINE_LABELS, STYLE_LABELS } from '../types'
import { useI18n } from 'vue-i18n'
import messages from '@/shared/i18n/messages/products'
const { t } = useI18n({ messages })

const props = defineProps<{ modelValue: ProductFilters }>()
const emit = defineEmits<{ 'update:modelValue': [ProductFilters] }>()

const lines = Object.keys(LINE_LABELS) as ProductLine[]
const styles = Object.keys(STYLE_LABELS) as ProductStyle[]
const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']

function toggle(key: keyof ProductFilters, value: string) {
  const current = props.modelValue[key]
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: current === value ? undefined : value,
  })
}
</script>
<template>
  <aside class="space-y-8">
    <!-- Line filter -->
    <div>
      <p class="text-[length:var(--text-micro)] font-medium uppercase tracking-[var(--tracking-label)] opacity-50 mb-3">{{ t('products.filters.line') }}</p>
      <div class="flex flex-col gap-2">
        <button
          v-for="val in lines"
          :key="val"
          @click="toggle('line', val)"
          class="text-left text-[length:var(--text-small)] uppercase tracking-[var(--tracking-label)] transition-opacity duration-[var(--duration-fast)]"
          :class="modelValue.line === val ? 'font-semibold opacity-100' : 'opacity-50 hover:opacity-80'"
        >
          {{ t(`products.labels.lines.${val}`) }}
        </button>
      </div>
    </div>
    <!-- Style filter -->
    <div>
      <p class="text-[length:var(--text-micro)] font-medium uppercase tracking-[var(--tracking-label)] opacity-50 mb-3">{{ t('products.filters.style') }}</p>
      <div class="flex gap-2">
        <button
          v-for="val in styles"
          :key="val"
          @click="toggle('style', val)"
          class="px-3 py-1 text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-label)] border transition-colors duration-[var(--duration-fast)]"
          :class="modelValue.style === val
            ? 'bg-[color:var(--color-obsidian)] text-[color:var(--color-ivory)] border-[color:var(--color-obsidian)]'
            : 'border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]'"
        >
          {{ t(`products.labels.styles.${val}`) }}
        </button>
      </div>
    </div>
    <!-- Size filter -->
    <div>
      <p class="text-[length:var(--text-micro)] font-medium uppercase tracking-[var(--tracking-label)] opacity-50 mb-3">{{ t('products.filters.size') }}</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="size in sizes"
          :key="size"
          @click="toggle('size', size)"
          class="w-10 h-10 text-[length:var(--text-micro)] font-medium uppercase border transition-colors duration-[var(--duration-fast)]"
          :class="modelValue.size === size
            ? 'bg-[color:var(--color-obsidian)] text-[color:var(--color-ivory)] border-[color:var(--color-obsidian)]'
            : 'border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]'"
        >
          {{ size }}
        </button>
      </div>
    </div>
    <!-- Clear filters -->
    <button
      v-if="modelValue.line || modelValue.style || modelValue.size || modelValue.color"
      @click="emit('update:modelValue', {})"
      class="text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-label)] opacity-40 hover:opacity-70 transition-opacity duration-[var(--duration-fast)]"
    >
      {{ t('products.filters.clear') }}
    </button>
  </aside>
</template>
