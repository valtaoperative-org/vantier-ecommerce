<script setup lang="ts">
import SeoHead from '@shared/components/SeoHead.vue'
import SectionLabel from '@shared/components/SectionLabel.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { accountMessages } from '@shared/i18n/messages/account'

const { t, tm } = useI18n({ messages: accountMessages })
const mission = computed(() => tm('about.mission') as string[])
const pillars = computed(() => tm('about.pillars') as Array<{ title: string; body: string }>)
const lines = computed(() => tm('about.collections') as Array<{ name: string; range: string; desc: string }>)
</script>

<template>
  <SeoHead
    :title="t('about.seoTitle')"
    :description="t('about.seoDescription')"
    canonical="https://vantierluxuryla.com/about"
  />

  <!-- Hero -->
  <section class="h-[60vh] min-h-[400px] flex items-end bg-[color:var(--color-obsidian)] overflow-hidden relative">
    <div class="absolute top-0 right-[40%] w-px h-full bg-white/8" />
    <div class="absolute top-16 left-0 right-0 h-px bg-white/8" />
    <div class="pb-16 px-[var(--spacing-container)] max-w-[var(--container-max)] mx-auto w-full relative z-10">
      <p class="text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-display)] text-white/40 mb-6">
        {{ t('about.location') }}
      </p>
      <h1 class="text-[length:var(--text-display)] font-light uppercase tracking-[var(--tracking-headline)] leading-[1.0] text-[color:var(--color-ivory)] max-w-2xl">
        <template v-for="line in t('about.title').split('\n')" :key="line">{{ line }}<br /></template>
      </h1>
    </div>
  </section>

  <!-- Mission -->
  <section class="py-[var(--spacing-section)]">
    <div class="max-w-[var(--container-max)] mx-auto px-[var(--spacing-container)]">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <SectionLabel :text="t('about.philosophy')" />
          <h2 class="mt-4 text-[length:var(--text-headline)] font-light uppercase tracking-[var(--tracking-headline)] leading-[1.1]">
            <template v-for="line in t('about.philosophyTitle').split('\n')" :key="line">{{ line }}<br /></template>
          </h2>
        </div>
        <div class="space-y-6 text-[length:var(--text-body)] leading-relaxed text-[color:var(--color-on-surface)] opacity-70 lg:pt-12">
          <p v-for="paragraph in mission" :key="paragraph">{{ paragraph }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Three pillars -->
  <section class="py-[var(--spacing-section)] bg-[color:var(--color-warm-beige)]">
    <div class="max-w-[var(--container-max)] mx-auto px-[var(--spacing-container)]">
      <SectionLabel :text="t('about.pillarsLabel')" />
      <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div v-for="pillar in pillars" :key="pillar.title" class="space-y-4">
          <div class="w-8 h-px bg-[color:var(--color-amber-accent)]" />
          <h3 class="text-[length:var(--text-title)] font-semibold uppercase tracking-[var(--tracking-headline)]">{{ pillar.title }}</h3>
          <p class="text-[length:var(--text-small)] leading-relaxed opacity-60">{{ pillar.body }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Collections intro -->
  <section class="py-[var(--spacing-section)]">
    <div class="max-w-[var(--container-max)] mx-auto px-[var(--spacing-container)]">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <SectionLabel :text="t('about.collectionsLabel')" />
          <h2 class="mt-4 text-[length:var(--text-headline)] font-light uppercase tracking-[var(--tracking-headline)] leading-[1.1]">
            <template v-for="line in t('about.collectionsTitle').split('\n')" :key="line">{{ line }}<br /></template>
          </h2>
        </div>
        <div class="space-y-8 lg:pt-12">
          <div v-for="line in lines" :key="line.name" class="border-b border-[color:var(--color-border)] pb-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-label)] opacity-50 mb-1">{{ line.range }}</p>
                <h4 class="font-medium uppercase tracking-[var(--tracking-label)]">{{ line.name }}</h4>
                <p class="mt-2 text-[length:var(--text-small)] opacity-60 leading-relaxed">{{ line.desc }}</p>
              </div>
              <RouterLink
                to="/shop"
                class="flex-shrink-0 text-[length:var(--text-micro)] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity duration-[var(--duration-fast)]"
              >{{ t('about.shop') }}</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-20 bg-[color:var(--color-obsidian)] text-center">
    <p class="text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-display)] text-white/40 mb-6">{{ t('about.begin') }}</p>
    <h2 class="text-[length:var(--text-headline)] font-light uppercase tracking-[var(--tracking-headline)] text-[color:var(--color-ivory)] max-w-lg mx-auto px-6">
      {{ t('about.discover') }}
    </h2>
    <RouterLink
      to="/shop"
      class="mt-10 inline-flex items-center gap-3 text-[length:var(--text-small)] uppercase tracking-[var(--tracking-label)] text-[color:var(--color-ivory)] border-b border-white/30 pb-0.5 hover:border-white transition-colors duration-[var(--duration-normal)]"
    >
      {{ t('about.shopAll') }}
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </RouterLink>
  </section>
</template>
