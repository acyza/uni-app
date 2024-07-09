import { defineComponent as defineComponentOrigin } from '@vue/runtime-core'
declare global {
  const defineComponent: typeof defineComponentOrigin
  const __uniConfig: UniConfig
  const __uniRoutes: UniPageRoute[]

  function utsMapOf(obj: Record<string, any>): Map<string, any | null>
  function utsMapOf<K, V>(obj: Array<Array<any>>): Map<string, any | null>
  function padStyleMapOf(style: Map<string, any>): Map<string, Map<string, any>>

  type UniPageMeta = {
    isQuit: boolean
  }

  type UniPageRoute = {
    path: string
    component: any
    meta: UniPageMeta
    style: Map<string, any>
    needLogin?: boolean | null
  }
  type UniConfigOnReadyCallback = () => void
  type UniConfig = {
    realEntryPagePath: string
    entryPagePath: string
    globalStyle: Map<string, any>
    tabBar: Map<string, any> | null
    conditionUrl: string
    uniIdRouter: Map<string, any>
    themeConfig: Map<string, Map<string, any>>
    _ready: boolean
    callbacks: UniConfigOnReadyCallback[]
    onReady(callback: UniConfigOnReadyCallback): void
    get ready(): boolean
    set ready(value: boolean)
  }

  class UTSSourceMapPosition<
    name = string,
    fileName = string,
    line = number,
    column = number
  > {
    constructor(name: name, fileName: fileName, line: line, column: column) {}
  }

  namespace io {
    namespace dcloud {
      namespace uniapp {
        namespace appframe {
          class AppConfig {
            name: string
            appid: string
            versionName: string
            versionCode: string
            uniCompilerVersion: string
            singleThread: boolean
            flexDirection: string
            splashScreen: Map<string, any> | null
            isShowSplashAd: boolean
            darkmode: boolean
            defaultAppTheme: string
          }
        }
      }
    }
  }
}

export {}
