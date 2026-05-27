import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import CareInstructions from '../CareInstructions.vue'

const CARE_DATA = {
  wash:   'Machine at cold temperature',
  bleach: 'No bleach',
  dry:    'Dry on low heat',
  colors: 'Wash with similar colors',
}

describe('CareInstructions', () => {
  it('renders 4 care items', () => {
    const wrapper = mount(CareInstructions, { props: { care: CARE_DATA, lineName: 'Polo Atelier' } })
    expect(wrapper.findAll('[data-care-item]')).toHaveLength(4)
  })

  it('displays the wash instruction', () => {
    const wrapper = mount(CareInstructions, { props: { care: CARE_DATA, lineName: 'Polo Atelier' } })
    expect(wrapper.text()).toContain('Machine at cold temperature')
  })

  it('displays the line name in the header', () => {
    const wrapper = mount(CareInstructions, { props: { care: CARE_DATA, lineName: 'Polo Atelier' } })
    expect(wrapper.text()).toContain('Polo Atelier')
  })
})
