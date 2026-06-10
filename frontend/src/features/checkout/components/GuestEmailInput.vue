<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { checkoutMessages } from '@shared/i18n/messages/checkout'
const model = defineModel<string>({ default: '' })
const { t } = useI18n({ messages: checkoutMessages })
</script>

<template>
  <div class="space-y-1">
    <label class="block text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-label)] text-[color:var(--color-on-surface)]">
      {{ t('checkout.email') }}
    </label>
    <input
      v-model="model"
      type="email"
      :placeholder="t('checkout.emailPlaceholder')"
      autocomplete="email"
      class="w-full border border-[color:var(--color-border)] bg-transparent px-3 py-2.5 text-[length:var(--text-small)] text-[color:var(--color-on-surface)] placeholder:text-[color:var(--color-border-strong)] focus:outline-none focus:border-[color:var(--color-obsidian)] transition-colors duration-[var(--duration-fast)]"
    />
  </div>
</template>
