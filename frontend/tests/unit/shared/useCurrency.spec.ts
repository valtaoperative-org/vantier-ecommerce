import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { i18n } from '@shared/i18n'
import { useCurrency } from '@shared/composables/useCurrency'

const TestComponent = defineComponent({
  setup() {
    return useCurrency()
  },
  template: '<span>{{ formatPrice(12345) }}</span>',
})

describe('useCurrency', () => {
  it('formats cents reactively for the active locale', async () => {
    i18n.global.locale.value = 'en-US'
    const wrapper = mount(TestComponent, { global: { plugins: [i18n] } })
    expect(wrapper.text()).toContain('$123.45')

    i18n.global.locale.value = 'es-MX'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('$123.45')
    expect(wrapper.vm.currency).toBe('MXN')
  })
})
