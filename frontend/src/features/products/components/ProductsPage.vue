<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import messages from '@/shared/i18n/messages/products'
const { t } = useI18n({ messages })
</script>
<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold">{{ t('products.placeholder.title') }}</h1>
    <p class="text-gray-500 mt-2">{{ t('products.placeholder.body') }}</p>
  </div>
</template>
