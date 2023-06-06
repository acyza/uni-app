import { assert } from './testUtils'

describe('compiler:codegen', () => {
  test('default', () => {
    assert(`<view/>`, `createElementVNode("view")`)
    assert(
      `<view style="width:100px;height:100px;"/>`,
      `createElementVNode("view", new Map<string, any | null>([["style", "width:100px;height:100px;"]]))`
    )
    assert(
      `<text>{{msg}}</text>`,
      `createElementVNode("text", null, toDisplayString(_ctx.msg), 1 /* TEXT */)`
    )
  })
  test(`function:kotlin`, () => {
    assert(
      `<view/>`,
      `@Suppress("UNUSED_PARAMETER") function PagesIndexIndexRender(_ctx: PagesIndexIndex): VNode | null {\n  return createElementVNode("view")\n}`,
      {
        targetLanguage: 'kotlin',
        mode: 'function',
      }
    )
  })
  test(`UTSComponents:kotlin`, () => {
    assert(
      `<view><uts-hello/><uts-hello/></view>`,
      `@Suppress("UNUSED_PARAMETER") function PagesIndexIndexRender(_ctx: PagesIndexIndex): VNode | null {\nconst _component_uts_hello = uts.sdk.modules.utsHello.UtsHelloComponent.name\n\n  return createElementVNode("view", null, [\n    createVNode(_component_uts_hello),\n    createVNode(_component_uts_hello)\n  ])\n}`,
      {
        targetLanguage: 'kotlin',
        mode: 'function',
        parseUTSComponent(name) {
          if (name === 'uts-hello') {
            return {
              className: 'UtsHelloComponent',
              namespace: 'uts.sdk.modules.utsHello',
              source: '@/uni_modules/uts-hello',
            }
          }
        },
      }
    )
  })
  test(`UTSComponents:kotlin`, () => {
    assert(
      `<view><custom/><custom/><custom1/></view>`,
      `import _component_custom from '@/components/custom/custom.vue'\nimport _component_custom1 from '@/components/custom1/custom1.vue'\n@Suppress("UNUSED_PARAMETER") function PagesIndexIndexRender(_ctx: PagesIndexIndex): VNode | null {\n// const _component_custom = resolveComponent("custom")\n// const _component_custom1 = resolveComponent("custom1")\n\n  return createElementVNode("view", null, [\n    createVNode(_component_custom),\n    createVNode(_component_custom),\n    createVNode(_component_custom1)\n  ])\n}`,
      {
        targetLanguage: 'kotlin',
        mode: 'function',
        matchEasyCom(tag) {
          if (tag.startsWith('custom')) {
            return `@/components/${tag}/${tag}.vue`
          }
        },
      }
    )
  })
})
