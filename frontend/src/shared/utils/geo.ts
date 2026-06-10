import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  type SupportedLocale,
} from '@shared/i18n'

const STORAGE_KEY = 'user_locale'
const GEO_TIMEOUT_MS = 1_500

type GeoResponse = {
  country?: string
  country_code?: string
  countryCode?: string
}

function getStoredLocale(): SupportedLocale | null {
  try {
    const storedLocale = localStorage.getItem(STORAGE_KEY)
    return isSupportedLocale(storedLocale) ? storedLocale : null
  } catch {
    return null
  }
}

export async function determineInitialLocale(
  fetcher: typeof fetch = fetch,
): Promise<SupportedLocale> {
  const storedLocale = getStoredLocale()
  if (storedLocale) return storedLocale

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), GEO_TIMEOUT_MS)

  try {
    const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
    const endpoint = import.meta.env.VITE_GEO_ENDPOINT ?? `${apiBaseUrl}/api/v1/geo`
    const response = await fetcher(endpoint, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    if (!response.ok) return DEFAULT_LOCALE

    const data = (await response.json()) as GeoResponse
    const countryCode = data.country_code ?? data.countryCode ?? data.country
    return countryCode?.toUpperCase() === 'MX' ? 'es-MX' : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export function persistLocale(locale: SupportedLocale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // Locale still changes for this session when storage is unavailable.
  }
}
