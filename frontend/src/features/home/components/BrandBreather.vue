<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import messages from '@/shared/i18n/messages/products'
const { t } = useI18n({ messages })
</script>
<template>
  <section class="w-full min-h-screen bg-[color:var(--color-obsidian)] border-t border-b border-[color:var(--color-amber-accent)]/10 py-24 px-[var(--spacing-container)] flex flex-col items-center justify-center text-center">
    <div class="w-8 h-px bg-[color:var(--color-amber-accent)] mb-8" />
    <blockquote class="text-[length:var(--text-title)] md:text-[length:var(--text-headline)] font-light leading-tight tracking-[var(--tracking-headline)] text-[color:var(--color-ivory)] max-w-3xl opacity-90 uppercase">
      {{ t('home.breather.quote').split('\n')[0] }}<br />
      {{ t('home.breather.quote').split('\n')[1] }}
    </blockquote>
    <p class="text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-display)] text-[color:var(--color-border-strong)] mt-8">
      {{ t('home.breather.caption') }}
    </p>
  </section>
</template>
