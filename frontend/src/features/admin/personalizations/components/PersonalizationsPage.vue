<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AdminStatCard from '@features/admin/components/shared/AdminStatCard.vue'
import StatusBadge from '@features/admin/components/shared/StatusBadge.vue'
import type { AdminStatus } from '@features/admin/components/shared/StatusBadge.vue'
import { useAdminOrdersStore } from '@features/admin/orders/store'
import { useAdminInventoryStore } from '@features/admin/inventory/store'
import type { AdminOrder, OrderStatus } from '@features/admin/orders/types'

const store = useAdminOrdersStore()
const inventory = useAdminInventoryStore()

const STATUS_MAP: Record<OrderStatus, AdminStatus> = {
  pending:    'pendiente',
  processing: 'procesando',
  shipped:    'enviado',
  delivered:  'entregado',
  cancelled:  'inactivo',
}

onMounted(async () => {
  if (!store.orders.length) await store.loadOrders()
  if (!inventory.products.length) await inventory.fetchProducts()
})

const variantMeta = computed(() => {
  const map = new Map<string, { productName: string; size: string; color: string }>()
  for (const p of inventory.products) {
    for (const v of p.variants) {
      map.set(v.id, { productName: p.name, size: v.size, color: v.color })
    }
  }
  return map
})

const personalizedOrders = computed(() =>
  store.orders.filter((o: AdminOrder) => o.items.some(i => i.customization_file_url))
)

const pendingCount = computed(() =>
  personalizedOrders.value.filter(o => o.status === 'pending' || o.status === 'processing').length
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

function safeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' ? url : '#'
  } catch {
    return '#'
  }
}

function isImage(url: string) {
  return /\.(png|jpe?g|webp)$/i.test(url)
}
</script>

<template>
  <div class="space-y-8">
    <!-- KPI -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <AdminStatCard
        label="Total Personalizaciones"
        :value="personalizedOrders.length"
        icon="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
      <AdminStatCard
        label="Requieren Atención"
        :value="pendingCount"
        icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </div>

    <!-- Table -->
    <div v-if="store.loading" class="text-center py-16 opacity-50">Cargando…</div>

    <div v-else-if="!personalizedOrders.length" class="text-center py-16 opacity-40">
      No hay órdenes con personalización.
    </div>

    <div v-else class="overflow-x-auto rounded-xl border border-[var(--admin-border)]">
      <table class="w-full text-sm">
        <thead class="bg-[var(--admin-surface-raised)] text-[var(--admin-text-secondary)] uppercase text-xs tracking-wider">
          <tr>
            <th class="px-4 py-3 text-left">Orden</th>
            <th class="px-4 py-3 text-left">Cliente</th>
            <th class="px-4 py-3 text-left">Fecha</th>
            <th class="px-4 py-3 text-left">Estado</th>
            <th class="px-4 py-3 text-left">Prenda</th>
            <th class="px-4 py-3 text-left">Colocación</th>
            <th class="px-4 py-3 text-left">Fee</th>
            <th class="px-4 py-3 text-left">Diseño</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="order in personalizedOrders" :key="order.id">
            <template v-for="item in order.items.filter(i => i.customization_file_url)" :key="item.id">
              <tr class="border-t border-[var(--admin-border)] hover:bg-[var(--admin-surface-raised)] transition-colors">
                <td class="px-4 py-3 font-mono text-xs opacity-60">
                  {{ order.id.slice(0, 8) }}
                </td>
                <td class="px-4 py-3">
                  <div class="font-medium">{{ order.customer_name || '—' }}</div>
                  <div class="text-xs opacity-50">{{ order.customer_email }}</div>
                </td>
                <td class="px-4 py-3 text-xs opacity-60">{{ formatDate(order.created_at) }}</td>
                <td class="px-4 py-3">
                  <StatusBadge :status="STATUS_MAP[order.status]" />
                </td>
                <td class="px-4 py-3">
                  <template v-if="variantMeta.get(item.variant_id)">
                    <div class="font-medium">{{ variantMeta.get(item.variant_id)!.productName }}</div>
                    <div class="text-xs opacity-50">
                      {{ variantMeta.get(item.variant_id)!.size }} · {{ variantMeta.get(item.variant_id)!.color }}
                    </div>
                  </template>
                  <span v-else class="opacity-40 font-mono text-xs">{{ item.variant_id.slice(0, 8) }}</span>
                </td>
                <td class="px-4 py-3 text-xs opacity-70">
                  {{ item.customization_details?.placement || '—' }}
                </td>
                <td class="px-4 py-3 text-xs font-medium">
                  ${{ parseFloat(item.customization_fee_usd).toFixed(2) }}
                </td>
                <td class="px-4 py-3">
                  <div class="inline-flex items-center gap-2">
                    <!-- Thumbnail + Ver -->
                    <a
                      :href="safeUrl(item.customization_file_url!)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 group"
                    >
                      <img
                        v-if="isImage(item.customization_file_url!)"
                        :src="item.customization_file_url!"
                        class="w-10 h-10 object-cover rounded border border-[var(--admin-border)] group-hover:opacity-80 transition-opacity"
                        alt="diseño"
                      />
                      <span
                        v-else
                        class="w-10 h-10 flex items-center justify-center rounded border border-[var(--admin-border)] bg-[var(--admin-surface-raised)] group-hover:opacity-80 transition-opacity"
                      >
                        <svg class="w-5 h-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <span class="text-xs opacity-50 group-hover:opacity-100 transition-opacity">Ver</span>
                    </a>

                    <!-- Download -->
                    <a
                      :href="safeUrl(item.customization_file_url!)"
                      :download="item.customization_file_url!.split('/').pop()"
                      class="p-1.5 rounded hover:bg-[var(--admin-border)] transition-colors opacity-50 hover:opacity-100"
                      title="Descargar diseño"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
