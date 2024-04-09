import type { Node, ObjectMethod, ObjectProperty } from '@babel/types'
import type { ScriptCompileContext } from './context'
import { isCallOf, unwrapTSNode } from './utils'
import { DEFINE_PROPS } from './defineProps'
import { DEFINE_EMITS } from './defineEmits'
import { DEFINE_EXPOSE } from './defineExpose'
import { DEFINE_SLOTS } from './defineSlots'

export const DEFINE_OPTIONS = 'defineOptions'

export function processDefineOptions(
  ctx: ScriptCompileContext,
  node: Node
): boolean {
  if (!isCallOf(node, DEFINE_OPTIONS)) {
    return false
  }
  if (ctx.hasDefineOptionsCall) {
    ctx.error(`duplicate ${DEFINE_OPTIONS}() call`, node)
  }
  if (node.typeParameters) {
    ctx.error(`${DEFINE_OPTIONS}() cannot accept type arguments`, node)
  }
  if (!node.arguments[0]) return true

  ctx.hasDefineOptionsCall = true
  ctx.optionsRuntimeDecl = unwrapTSNode(node.arguments[0])

  let propsOption: ObjectMethod | ObjectProperty | undefined = undefined
  let emitsOption: ObjectMethod | ObjectProperty | undefined = undefined
  let exposeOption: ObjectMethod | ObjectProperty | undefined = undefined
  let slotsOption: ObjectMethod | ObjectProperty | undefined = undefined
  if (ctx.optionsRuntimeDecl.type === 'ObjectExpression') {
    for (const prop of ctx.optionsRuntimeDecl.properties) {
      if (
        (prop.type === 'ObjectProperty' || prop.type === 'ObjectMethod') &&
        prop.key.type === 'Identifier'
      ) {
        if (prop.key.name === 'props') propsOption = prop
        if (prop.key.name === 'emits') emitsOption = prop
        if (prop.key.name === 'expose') exposeOption = prop
        if (prop.key.name === 'slots') slotsOption = prop
      }
    }
  } else {
    ctx.error(
      `${DEFINE_OPTIONS}() options must be an object expression`,
      ctx.optionsRuntimeDecl
    )
  }

  if (
    ctx.optionsRuntimeDecl.properties.find((p) => p.type === 'SpreadElement')
  ) {
    ctx.error(
      `options does not support spread properties.`,
      ctx.optionsRuntimeDecl
    )
  }

  if (propsOption) {
    ctx.error(
      `${DEFINE_OPTIONS}() cannot be used to declare props. Use ${DEFINE_PROPS}() instead.`,
      propsOption
    )
  }
  if (emitsOption) {
    ctx.error(
      `${DEFINE_OPTIONS}() cannot be used to declare emits. Use ${DEFINE_EMITS}() instead.`,
      emitsOption
    )
  }
  if (exposeOption) {
    ctx.error(
      `${DEFINE_OPTIONS}() cannot be used to declare expose. Use ${DEFINE_EXPOSE}() instead.`,
      exposeOption
    )
  }
  if (slotsOption) {
    ctx.error(
      `${DEFINE_OPTIONS}() cannot be used to declare slots. Use ${DEFINE_SLOTS}() instead.`,
      slotsOption
    )
  }

  return true
}
