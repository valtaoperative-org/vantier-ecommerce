<script setup lang="ts">
import { useRoute } from 'vue-router'
import OrderConfirmCard from './OrderConfirmCard.vue'
import SeoHead from '@shared/components/SeoHead.vue'
import { useI18n } from 'vue-i18n'
import { checkoutMessages } from '@shared/i18n/messages/checkout'

const route = useRoute()
const orderId = route.params.orderId as string
const { t } = useI18n({ messages: checkoutMessages })
</script>

<template>
  <SeoHead
    :title="t('checkout.seo.orderConfirmedTitle', { orderId })"
    :description="t('checkout.seo.confirmedDescription')"
    :robots="{ index: false, follow: false }"
  />
  <OrderConfirmCard :order-id="orderId" />
</template>
