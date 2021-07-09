import { extend } from '@vue/shared'
import { ComponentPublicInstance, getCurrentInstance } from 'vue'
import { rpx2px } from './util'

export function useCurrentPageId() {
  if (__PLATFORM__ === 'app') {
    // view 层
    return parseInt((window as any).__id__)
  }
  return getCurrentInstance()!.root.proxy!.$page.id
}

export function getPageIdByVm(vm: ComponentPublicInstance) {
  if (!vm.$) {
    return
  }
  const rootProxy = vm.$.root.proxy
  if (rootProxy && rootProxy.$page) {
    return rootProxy.$page.id
  }
}

export function getPageById(id: number) {
  return getCurrentPages().find((page) => page.$page.id === id)
}

export function getPageVmById(id: number) {
  const page = getPageById(id)
  if (page) {
    return (page as any).$vm as ComponentPublicInstance
  }
}

export function getCurrentPage() {
  const pages = getCurrentPages()
  const len = pages.length
  if (len) {
    return pages[len - 1]
  }
}

export function getCurrentPageMeta() {
  const page = getCurrentPage()
  if (page) {
    return page.$page.meta
  }
}

export function getCurrentPageId() {
  const meta = getCurrentPageMeta()
  if (meta) {
    return meta.id!
  }
  return -1
}

export function getCurrentPageVm() {
  const page = getCurrentPage()
  if (page) {
    return (page as any).$vm as ComponentPublicInstance
  }
}

const PAGE_META_KEYS = ['navigationBar', 'pullToRefresh'] as const

function initGlobalStyle() {
  return JSON.parse(JSON.stringify(__uniConfig.globalStyle || {}))
}

export function initRouteMeta(
  pageMeta: UniApp.PageRouteMeta,
  id?: number
): UniApp.PageRouteMeta {
  const globalStyle = initGlobalStyle()
  const res = extend({ id }, globalStyle, pageMeta)
  PAGE_META_KEYS.forEach((name) => {
    ;(res as any)[name] = extend({}, globalStyle[name], pageMeta[name])
  })
  return res
}

export function normalizePullToRefreshRpx(
  pullToRefresh: UniApp.PageRefreshOptions
) {
  if (pullToRefresh.offset) {
    pullToRefresh.offset = rpx2px(pullToRefresh.offset)
  }
  if (pullToRefresh.height) {
    pullToRefresh.height = rpx2px(pullToRefresh.height)
  }
  if (pullToRefresh.range) {
    pullToRefresh.range = rpx2px(pullToRefresh.range)
  }
  return pullToRefresh
}

export function initPageInternalInstance(
  openType: UniApp.OpenType,
  url: string,
  pageQuery: Record<string, any>,
  meta: UniApp.PageRouteMeta
): Page.PageInstance['$page'] {
  const { id, route } = meta
  return {
    id: id!,
    path: '/' + route,
    route: route,
    fullPath: url,
    options: pageQuery,
    meta,
    openType,
  }
}
