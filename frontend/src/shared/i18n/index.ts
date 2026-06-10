import { createI18n } from 'vue-i18n'
import { sharedMessages } from './messages/shared'
import { checkoutMessages } from './messages/checkout'
import { accountMessages } from './messages/account'
import { homeProductsMessages } from './messages/products'

export const SUPPORTED_LOCALES = ['en-US', 'es-MX'] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: SupportedLocale = 'en-US'

export const CURRENCY_BY_LOCALE: Record<SupportedLocale, 'USD' | 'MXN'> = {
  'en-US': 'USD',
  'es-MX': 'MXN',
}

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return typeof value === 'string' && SUPPORTED_LOCALES.includes(value as SupportedLocale)
}

const baseMessages = {
  'en-US': {
    navigation: {
      home: 'Home',
      shop: 'Shop',
      openCart: 'Open cart',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    cart: {
      title: 'Cart',
      selection: 'Your Selection',
      empty: 'Your cart is empty',
      emptyHint: 'Add items from the collection to get started.',
      shopCollection: 'Shop the Collection',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      free: 'Free',
      calculatedAtCheckout: 'Calculated at checkout',
      checkout: 'Proceed to Checkout',
      taxes: 'Taxes calculated at checkout',
      removeItem: 'Remove item',
      decreaseQuantity: 'Decrease quantity',
      increaseQuantity: 'Increase quantity',
    },
    locale: {
      label: 'Language and region',
      english: 'US',
      spanish: 'ES',
    },
  },
  'es-MX': {
    navigation: {
      home: 'Inicio',
      shop: 'Tienda',
      openCart: 'Abrir carrito',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
    },
    cart: {
      title: 'Carrito',
      selection: 'Tu selección',
      empty: 'Tu carrito está vacío',
      emptyHint: 'Agrega artículos de la colección para comenzar.',
      shopCollection: 'Ver la colección',
      orderSummary: 'Resumen del pedido',
      subtotal: 'Subtotal',
      shipping: 'Envío',
      free: 'Gratis',
      calculatedAtCheckout: 'Se calcula al pagar',
      checkout: 'Continuar al pago',
      taxes: 'Los impuestos se calculan al pagar',
      removeItem: 'Eliminar artículo',
      decreaseQuantity: 'Disminuir cantidad',
      increaseQuantity: 'Aumentar cantidad',
    },
    locale: {
      label: 'Idioma y región',
      english: 'US',
      spanish: 'ES',
    },
  },
}

const messages = {
  'en-US': {
    ...baseMessages['en-US'],
    ...sharedMessages['en-US'],
    ...checkoutMessages['en-US'],
    ...accountMessages['en-US'],
    ...homeProductsMessages['en-US'],
  },
  'es-MX': {
    ...baseMessages['es-MX'],
    ...sharedMessages['es-MX'],
    ...checkoutMessages['es-MX'],
    ...accountMessages['es-MX'],
    ...homeProductsMessages['es-MX'],
  },
}

export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages,
})

export async function loadSliceMessages(
  slice: string,
  locale: SupportedLocale,
): Promise<void> {
  try {
    const messages = await import(`../../features/${slice}/i18n/${locale}.json`)
    i18n.global.mergeLocaleMessage(locale, { [slice]: messages.default })
  } catch {
    // Feature-level translations are optional.
  }
}
