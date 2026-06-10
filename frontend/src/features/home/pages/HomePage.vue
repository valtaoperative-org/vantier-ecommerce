<script setup lang="ts">
import HeroCarousel from '../components/HeroCarousel.vue'
import BrandBreather from '../components/BrandBreather.vue'
import ProductLineGrid from '../components/ProductLineGrid.vue'
import FeaturedProducts from '../components/FeaturedProducts.vue'
import BrandStatement from '../components/BrandStatement.vue'
import ElProceso from '../components/ElProceso.vue'
import SeoHead from '@shared/components/SeoHead.vue'
import { useI18n } from 'vue-i18n'
import messages from '@/shared/i18n/messages/products'
const { t } = useI18n({ messages })
</script>
<template>
  <SeoHead
    :title="t('home.seo.title')"
    :description="t('home.seo.description')"
    canonical="https://vantierluxuryla.com/"
  />
  <HeroCarousel />
  <BrandBreather />
  <ProductLineGrid />
  <FeaturedProducts />
  <ElProceso />
  <BrandStatement />
</template>
