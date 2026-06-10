import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { determineInitialLocale } from '@shared/utils/geo'

const values = new Map<string, string>()
const storage = {
  clear: () => values.clear(),
  getItem: (key: string) => values.get(key) ?? null,
  key: (index: number) => [...values.keys()][index] ?? null,
  get length() {
    return values.size
  },
  removeItem: (key: string) => values.delete(key),
  setItem: (key: string, value: string) => values.set(key, value),
}

describe('determineInitialLocale', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', storage)
  })

  afterEach(() => {
    localStorage.clear()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('prioritizes a supported stored locale', async () => {
    localStorage.setItem('user_locale', 'es-MX')
    const fetcher = vi.fn()

    await expect(determineInitialLocale(fetcher)).resolves.toBe('es-MX')
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('uses country detection when no preference exists', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ country_code: 'MX' }),
    })

    await expect(determineInitialLocale(fetcher)).resolves.toBe('es-MX')
  })

  it('falls back to en-US for invalid storage and request failures', async () => {
    localStorage.setItem('user_locale', 'fr-FR')
    const fetcher = vi.fn().mockRejectedValue(new Error('offline'))

    await expect(determineInitialLocale(fetcher)).resolves.toBe('en-US')
  })
})
