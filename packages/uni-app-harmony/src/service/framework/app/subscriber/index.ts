import { getRouteOptions, subscribeServiceMethod } from '@dcloudio/uni-core'
import { WEB_INVOKE_APPSERVICE, addLeadingSlash } from '@dcloudio/uni-shared'
import {
  ON_WEBVIEW_READY,
  VD_SYNC,
  WEBVIEW_INSERTED,
  WEBVIEW_REMOVED,
} from '@dcloudio/uni-app-plus/constants'
import { onVdSync } from '@dcloudio/uni-app-plus/service/framework/dom'
import { onPlusMessage } from '@dcloudio/uni-app-plus/service/framework/app/initGlobalEvent'
import { subscribeNavigator } from '@dcloudio/uni-app-plus/service/framework/app/subscriber/navigator'
import { subscribeWebviewReady } from './webviewReady'
import {
  onWebviewInserted,
  onWebviewRemoved,
} from '@dcloudio/uni-app-plus/service/framework/app/subscriber/webviewLifecycle'
import {
  type WebInvokeAppService,
  onWebInvokeAppService,
} from '@dcloudio/uni-app-plus/service/framework/app/subscriber/webInvokeAppService'
import { subscribeBase64ToTempFilePath } from '../../../api/context/canvs'

export function initSubscribeHandlers() {
  const { subscribe, subscribeHandler, publishHandler } = UniServiceJSBridge

  onPlusMessage<{ type: string; data: Record<string, any>; pageId: number }>(
    'subscribeHandler',
    ({ type, data, pageId }) => {
      subscribeHandler(type, data, pageId)
    }
  )

  onPlusMessage<{
    data: Parameters<WebInvokeAppService>[0]
    webviewIds: string[]
  }>(WEB_INVOKE_APPSERVICE, ({ data, webviewIds }) => {
    onWebInvokeAppService(data, webviewIds)
  })

  subscribe(ON_WEBVIEW_READY, subscribeWebviewReady)
  subscribe(VD_SYNC, onVdSync)
  subscribeServiceMethod()
  // TODO subscribeAd
  subscribeNavigator()
  subscribe(WEBVIEW_INSERTED, onWebviewInserted)
  subscribe(WEBVIEW_REMOVED, onWebviewRemoved)
  subscribeBase64ToTempFilePath()
  // TODO subscribe(ON_WXS_INVOKE_CALL_METHOD, onWxsInvokeCallMethod)

  const routeOptions = getRouteOptions(
    addLeadingSlash(__uniConfig.entryPagePath!)
  )
  if (routeOptions) {
    // 防止首页 webview 初始化过早， service 还未开始监听
    publishHandler(ON_WEBVIEW_READY, {}, 1)
  }
}
