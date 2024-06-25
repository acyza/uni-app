import { extend } from '@vue/shared'

import { ViewJSBridge, getCurrentPageId } from '@dcloudio/uni-core'

import { APP_SERVICE_ID } from '@dcloudio/uni-app-plus/constants'

export const UniViewJSBridge = /*#__PURE__*/ extend(ViewJSBridge, {
  publishHandler,
})

function publishHandler(event: string, args: unknown = {}) {
  // 转换为字符串
  const pageId = getCurrentPageId() + ''
  if (__DEV__) {
    console.log(
      `[${Date.now()}][View]: ` +
        pageId +
        ' ' +
        event +
        ' ' +
        JSON.stringify(args)
    )
  }
  const webview = plus.webview as any
  webview.postMessageToUniNView(
    {
      type: 'subscribeHandler',
      args: {
        type: event,
        data: args,
        pageId,
      },
    },
    APP_SERVICE_ID
  )
}
