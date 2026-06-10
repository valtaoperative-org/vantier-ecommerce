<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { accountMessages } from '@shared/i18n/messages/account'

const props = defineProps<{ orderId: string; variantId: string }>()
const emit = defineEmits<{ (e: 'submit', data: { reason: string; preferredVariant: string }): void; (e: 'cancel'): void }>()

const reason = ref('')
const preferredVariant = ref('')
const submitting = ref(false)
const { t } = useI18n({ messages: accountMessages })

const reasons = [
  { value: 'Wrong size', key: 'wrongSize' },
  { value: 'Wrong color', key: 'wrongColor' },
  { value: 'Defective item', key: 'defective' },
  { value: 'Changed my mind', key: 'changedMind' },
  { value: 'Other', key: 'other' },
]

async function submit() {
  if (!reason.value || submitting.value) return
  submitting.value = true
  // TODO: wire to exchanges API
  await new Promise((r) => setTimeout(r, 500))
  emit('submit', { reason: reason.value, preferredVariant: preferredVariant.value })
  submitting.value = false
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-[length:var(--text-title)] font-semibold text-[color:var(--color-on-surface)]">{{ t('exchanges.requestTitle') }}</h3>
    <p class="text-[length:var(--text-small)] text-[color:var(--color-border-strong)]">
      {{ t('exchanges.orderNumber', { number: orderId.slice(-8).toUpperCase() }) }} · {{ t('exchanges.variant', { variant: variantId.slice(-6) }) }}
    </p>

    <div class="space-y-1">
      <label class="block text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-label)]">{{ t('exchanges.reason') }}</label>
      <select
        v-model="reason"
        class="w-full border border-[color:var(--color-border)] bg-transparent px-3 py-2.5 text-[length:var(--text-small)] text-[color:var(--color-on-surface)] focus:outline-none focus:border-[color:var(--color-obsidian)] transition-colors duration-[var(--duration-fast)]"
      >
        <option value="" disabled>{{ t('exchanges.selectReason') }}</option>
        <option v-for="r in reasons" :key="r.value" :value="r.value">{{ t(`exchanges.reasons.${r.key}`) }}</option>
      </select>
    </div>

    <div class="space-y-1">
      <label class="block text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-label)]">{{ t('exchanges.preferredVariant') }}</label>
      <input
        v-model="preferredVariant"
        type="text"
        :placeholder="t('exchanges.preferredVariantPlaceholder')"
        class="w-full border border-[color:var(--color-border)] bg-transparent px-3 py-2.5 text-[length:var(--text-small)] text-[color:var(--color-on-surface)] focus:outline-none focus:border-[color:var(--color-obsidian)] transition-colors duration-[var(--duration-fast)]"
      />
    </div>

    <div class="flex gap-3 pt-2">
      <button
        :disabled="!reason || submitting"
        class="flex-1 py-3 bg-[color:var(--color-obsidian)] text-[color:var(--color-ivory)] text-[length:var(--text-small)] tracking-[var(--tracking-label)] uppercase hover:opacity-80 disabled:opacity-40 transition-opacity duration-[var(--duration-normal)] flex items-center justify-center gap-2"
        @click="submit"
      >
        <span v-if="submitting" class="w-4 h-4 border-2 border-[color:var(--color-ivory)] border-t-transparent rounded-full animate-spin" />
        {{ t('exchanges.submit') }}
      </button>
      <button
        class="px-6 py-3 border border-[color:var(--color-border)] text-[length:var(--text-small)] uppercase tracking-[var(--tracking-label)] hover:border-[color:var(--color-border-strong)] transition-colors duration-[var(--duration-fast)]"
        @click="emit('cancel')"
      >
        {{ t('exchanges.cancel') }}
      </button>
    </div>
  </div>
</template>
