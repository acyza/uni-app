import path from 'path'
import type { Node } from '@babel/types'
import { type ExpressionNode, createSimpleExpression } from '@vue/compiler-core'
import { walk } from 'estree-walker'
import { parseExpression } from '@babel/parser'
import MagicString from 'magic-string'
import {
  camelize,
  genUTSComponentPublicInstanceIdent,
  genUTSComponentPublicInstanceImported,
  normalizePath,
} from '@dcloudio/uni-cli-shared'
import type { TemplateCompilerOptions } from './options'
import { stringifyExpression } from './transforms/transformExpression'
import type { TransformContext } from './transform'
import type { CompilerError } from './errors'

export const __DEV__ = true
export const __BROWSER__ = false
export const __COMPAT__ = false

export function genRenderFunctionDecl({
  className = '',
}: // inline = false,
TemplateCompilerOptions): string {
  // if(inline){
  //   return `(): VNode | null =>`
  // }
  // 调整返回值类型为 any | null, 支持 <template>some text</template>
  return `function ${className}Render(): any | null`
}

export function rewriteObjectExpression(
  exp: ExpressionNode,
  context: TransformContext
) {
  const source = stringifyExpression(exp)
  if (source.includes('{')) {
    const s = new MagicString(source)
    const ast = parseExpression(source, {
      plugins: context.expressionPlugins,
    })
    walk(ast, {
      enter(node: Node) {
        if (node.type === 'ObjectExpression') {
          s.prependLeft(
            node.start!,
            node.properties.length > 0
              ? 'utsMapOf('
              : 'utsMapOf<string, any | null>('
          )
          s.prependRight(node.end!, ')')
        }
      },
    })
    return createSimpleExpression(s.toString(), false, exp.loc)
  }
}

export function onCompilerError(error: CompilerError) {}

export function addEasyComponentAutoImports(
  easyComponentAutoImports: Record<string, [string, string]>,
  rootDir: string,
  tagName: string,
  fileName: string
) {
  // 内置easycom，如 unicloud-db
  if (fileName.includes('@dcloudio')) {
    return
  }
  rootDir = normalizePath(rootDir)
  if (path.isAbsolute(fileName) && fileName.startsWith(rootDir)) {
    fileName = '@/' + normalizePath(path.relative(rootDir, fileName))
  }

  let imported = ''
  // 加密插件easycom类型导入
  if (fileName.includes('?uts-proxy')) {
    const moduleId = path.basename(fileName.split('?uts-proxy')[0])
    fileName = `uts.sdk.modules.${camelize(moduleId)}`
    imported = genUTSComponentPublicInstanceImported(
      rootDir,
      `@/uni_modules/${moduleId}/components/${tagName}/${tagName}`
    )
  } else {
    imported = genUTSComponentPublicInstanceImported(rootDir, fileName)
  }
  easyComponentAutoImports[fileName] = [
    imported,
    genUTSComponentPublicInstanceIdent(tagName),
  ]
}
