<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@features/cart/store'
import CartDrawer from '@features/cart/components/CartDrawer.vue'
import ToastContainer from '@shared/components/ToastContainer.vue'
import AnnouncementBar from '@shared/components/AnnouncementBar.vue'
import AppFooter from '@shared/components/AppFooter.vue'
import LocaleSelector from '@shared/components/LocaleSelector.vue'
import { useToast } from '@shared/composables/useToast'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const cart = useCartStore()
const toast = useToast()
const { t } = useI18n()
const mobileMenuOpen = ref(false)
const cartOpen = ref(false)

const DISCOUNT_CODE = '15OFFROYALTY'

async function copyDiscountCode() {
  try {
    await navigator.clipboard.writeText(DISCOUNT_CODE)
    toast.show(t('shared.discount.copied', { code: DISCOUNT_CODE }), 'success')
  } catch {
    toast.show(t('shared.discount.fallback', { code: DISCOUNT_CODE }), 'default')
  }
}

// Close mobile menu and cart drawer on route change
watch(() => route.path, () => { mobileMenuOpen.value = false; cartOpen.value = false })

const navLinks = [
  { to: '/', labelKey: 'navigation.home' },
  { to: '/shop', labelKey: 'navigation.shop' },
]
</script>
<template>
  <div class="min-h-screen flex flex-col bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)]">
    <!-- Announcement bar -->
    <AnnouncementBar />

    <!-- Nav -->
    <header class="sticky top-0 z-40 border-b border-[color:var(--color-amber-accent)]/8 bg-[color:var(--color-obsidian)]">
      <div class="relative max-w-[var(--container-max)] mx-auto px-[var(--spacing-container)] h-16 flex items-center justify-between">

        <!-- Left: Desktop nav links -->
        <nav class="hidden md:flex items-center gap-8" :aria-label="t('shared.navigation.main')">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-[length:var(--text-small)] font-medium uppercase tracking-[var(--tracking-label)] text-[color:var(--color-ivory)]/50 hover:text-[color:var(--color-ivory)] relative after:absolute after:bottom-0 after:left-0 after:h-px after:bg-[color:var(--color-ivory)] after:transition-[width] after:duration-[var(--duration-normal)] after:ease-[var(--ease-out-expo)] hover:after:w-full transition-colors duration-[var(--duration-fast)]"
            :class="$route.path === link.to ? 'text-[color:var(--color-ivory)] after:w-full' : 'after:w-0'"
          >
            {{ t(link.labelKey) }}
          </RouterLink>
        </nav>

        <!-- Center: Logo (absolute so it's truly centered) -->
        <RouterLink
          to="/"
          class="absolute left-1/2 -translate-x-1/2 hover:opacity-70 transition-opacity duration-[var(--duration-fast)]"
          :aria-label="t('shared.navigation.logoHome')"
        >
          <img
            src="/Logos y tipografia/LOGOTIPO BLANCO VANTIER.svg"
            alt="Vantier"
            class="h-5 w-auto"
          />
        </RouterLink>

        <!-- Right actions -->
        <div class="flex items-center gap-4 ml-auto">
          <LocaleSelector />

          <!-- Cart icon -->
          <button class="relative p-2 hover:opacity-70 transition-opacity duration-[var(--duration-fast)] text-[color:var(--color-ivory)]" :aria-label="t('navigation.openCart')" @click="cartOpen = true">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <Transition name="badge-pop">
              <span
                v-if="cart.totalItems > 0"
                :key="cart.totalItems"
                class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[color:var(--color-amber-accent)] text-[color:var(--color-obsidian)] text-[10px] font-bold flex items-center justify-center"
              >
                {{ cart.totalItems > 9 ? '9+' : cart.totalItems }}
              </span>
            </Transition>
          </button>

          <!-- Hamburger (mobile only) -->
          <button
            class="md:hidden p-2 hover:opacity-70 transition-opacity duration-[var(--duration-fast)] text-[color:var(--color-ivory)]"
            :aria-label="mobileMenuOpen ? t('navigation.closeMenu') : t('navigation.openMenu')"
            :aria-expanded="mobileMenuOpen"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <Transition name="hamburger" mode="out-in">
                <g v-if="!mobileMenuOpen" key="open">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </g>
                <g v-else key="close">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </g>
              </Transition>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu overlay -->
      <Transition name="mobile-menu">
        <nav
          v-if="mobileMenuOpen"
          class="md:hidden border-t border-[color:var(--color-amber-accent)]/10 bg-[color:var(--color-obsidian)] px-[var(--spacing-container)] py-6 flex flex-col gap-5"
          :aria-label="t('shared.navigation.mobile')"
        >
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-[length:var(--text-title)] font-light uppercase tracking-[var(--tracking-headline)] text-[color:var(--color-ivory)] hover:opacity-60 transition-opacity duration-[var(--duration-fast)]"
            :class="{ 'opacity-40': $route.path !== link.to }"
          >
            {{ t(link.labelKey) }}
          </RouterLink>

        </nav>
      </Transition>
    </header>

    <!-- Main content -->
    <main class="flex-1">
      <RouterView v-slot="{ Component, route }">
        <Transition :name="(route.meta.transition as string) ?? 'page'" mode="out-in">
          <div :key="route.path">
            <component :is="Component" />
          </div>
        </Transition>
      </RouterView>
    </main>

    <!-- Footer: naturally below all full-screen sections, only reached on scroll -->
    <AppFooter />
  </div>

  <!-- Cart Drawer -->
  <Teleport to="body">
    <CartDrawer :open="cartOpen" @close="cartOpen = false" />
  </Teleport>

  <!-- Floating Discount Button -->
  <button
    type="button"
    @click="copyDiscountCode"
    class="discount-float fixed bottom-6 right-6 z-40 group flex items-center gap-3 pl-6 pr-7 py-3 bg-[color:var(--color-amber-accent)] border border-[color:var(--color-amber-accent)] text-[color:var(--color-obsidian)] transition-all duration-300 hover:bg-[color:var(--color-obsidian)] hover:text-[color:var(--color-amber-accent)] hover:shadow-[0_0_24px_rgba(184,142,70,0.3)] hover:scale-[1.03]"
    style="border-radius: 2px;"
    :aria-label="t('shared.discount.copy', { code: DISCOUNT_CODE })"
  >
    <!-- Tag icon -->
    <svg class="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke-linejoin="round"/>
      <circle cx="7" cy="7" r="1.2" fill="currentColor"/>
    </svg>
    <!-- Label -->
    <span class="text-[10px] font-semibold uppercase tracking-[0.2em] leading-none whitespace-nowrap">
      {{ t('shared.discount.label') }}
      <span class="opacity-40 mx-1">·</span>
      15OFFROYALTY
    </span>
  </button>

  <!-- Toast notifications -->
  <ToastContainer />
</template>

<style>
.badge-pop-enter-active { transition: transform var(--duration-normal) var(--ease-out-expo); }
.badge-pop-enter-from { transform: scale(1.4); }
.badge-pop-enter-to { transform: scale(1); }

.mobile-menu-enter-active { transition: opacity var(--duration-normal) ease, transform var(--duration-normal) var(--ease-out-expo); }
.mobile-menu-leave-active { transition: opacity var(--duration-fast) ease, transform var(--duration-fast) ease; }
.mobile-menu-enter-from { opacity: 0; transform: translateY(-8px); }
.mobile-menu-leave-to  { opacity: 0; transform: translateY(-4px); }

.hamburger-enter-active, .hamburger-leave-active { transition: opacity var(--duration-fast) ease; }
.hamburger-enter-from, .hamburger-leave-to { opacity: 0; }

/* Page transitions */
.page-enter-active {
  transition: opacity 240ms ease, transform 300ms cubic-bezier(0.25, 0.1, 0.1, 1);
}
.page-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to  { opacity: 0; transform: translateY(-4px); }

/* Floating discount button entrance */
.discount-float {
  animation: float-in 600ms 800ms cubic-bezier(0.25, 0.1, 0.1, 1) both;
}
@keyframes float-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
