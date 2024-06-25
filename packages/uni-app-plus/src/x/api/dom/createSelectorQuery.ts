import type { SelectorQueryRequest } from '@dcloudio/uni-api'
import type {
  CreateSelectorQuery,
  NodeField,
  NodeInfo,
  NodesRef,
  SelectorQuery,
  SelectorQueryNodeInfoCallback,
} from '@dcloudio/uni-app-x/types/uni'
import { getCurrentPage } from '@dcloudio/uni-core'
import type { ComponentPublicInstance, VNode } from 'vue'

function isVueComponent(comp: any) {
  const has$instance = typeof comp.$ === 'object'
  const has$el = typeof comp.$el === 'object'

  return has$instance && has$el
}

const isFunction = (val: any): val is Function => typeof val === 'function'

class NodesRefImpl implements NodesRef {
  private _selectorQuery: SelectorQueryImpl
  private _component: ComponentPublicInstance | null
  private _selector: string
  private _single: boolean
  constructor(
    selectorQuery: SelectorQueryImpl,
    component: ComponentPublicInstance | null,
    selector: string,
    single: boolean
  ) {
    this._selectorQuery = selectorQuery
    this._component = component
    this._selector = selector
    this._single = single
  }

  boundingClientRect(
    callback?: SelectorQueryNodeInfoCallback | null
  ): SelectorQuery {
    const hasArg = callback === null || typeof callback === 'function'
    if (hasArg) {
      this._selectorQuery._push(
        this._selector,
        this._component,
        this._single,
        {
          id: true,
          dataset: true,
          rect: true,
          size: true,
        } as NodeField,
        callback
      )
      return this._selectorQuery
    } else {
      return this.boundingClientRect(null)
    }
  }

  fields(
    fields: NodeField,
    callback: SelectorQueryNodeInfoCallback
  ): SelectorQuery {
    this._selectorQuery._push(
      this._selector,
      this._component,
      this._single,
      fields,
      callback
    )
    return this._selectorQuery
  }

  scrollOffset(callback: SelectorQueryNodeInfoCallback): SelectorQuery {
    this._selectorQuery._push(
      this._selector,
      this._component,
      this._single,
      {
        id: true,
        dataset: true,
        scrollOffset: true,
      } as NodeField,
      callback
    )
    return this._selectorQuery
  }

  context(callback: SelectorQueryNodeInfoCallback): SelectorQuery {
    this._selectorQuery._push(
      this._selector,
      this._component,
      this._single,
      {
        context: true,
      } as NodeField,
      callback
    )
    return this._selectorQuery
  }

  node(_callback: (result: any) => void): SelectorQuery {
    return this._selectorQuery
  }
}

class SelectorQueryImpl implements SelectorQuery {
  private _queue: Array<SelectorQueryRequest>
  private _component: ComponentPublicInstance | null = null
  private _queueCb: Array<SelectorQueryNodeInfoCallback | null>
  private _nodesRef!: NodesRef
  constructor(component: ComponentPublicInstance) {
    this._component = component
    this._queue = []
    this._queueCb = []
  }

  exec(callback?: (result: Array<any>) => void | null): NodesRef | null {
    this._component?.$?.$waitNativeRender(() => {
      requestComponentInfo(this._component, this._queue, (res: Array<any>) => {
        const queueCbs = this._queueCb
        res.forEach((info: any, _index) => {
          const queueCb = queueCbs[_index]
          if (isFunction(queueCb)) {
            queueCb!(info)
          }
        })
        if (callback && isFunction(callback)) {
          callback(res)
        }
      })
    })
    return this._nodesRef
  }

  in(component: any | null): SelectorQuery {
    if (isVueComponent(component)) {
      this._component = component as ComponentPublicInstance
    }
    return this
  }

  select(selector: string): NodesRef {
    this._nodesRef = new NodesRefImpl(this, this._component, selector, true)
    return this._nodesRef
  }

  selectAll(selector: string): NodesRef {
    this._nodesRef = new NodesRefImpl(this, this._component, selector, false)
    return this._nodesRef
  }

  selectViewport(): NodesRef {
    this._nodesRef = new NodesRefImpl(this, null, '', true)
    return this._nodesRef
  }

  _push(
    selector: string,
    component: ComponentPublicInstance | null,
    single: boolean,
    fields: NodeField,
    callback: SelectorQueryNodeInfoCallback | null
  ) {
    this._queue.push({
      component,
      selector,
      single,
      fields,
    } as SelectorQueryRequest)
    this._queueCb.push(callback)
  }
}

class QuerySelectorHelper {
  _element: UniElement
  _commentStartVNode: VNode | undefined

  constructor(element: UniElement, vnode: VNode | undefined) {
    this._element = element
    this._commentStartVNode = vnode
  }

  static queryElement(
    element: UniElement,
    selector: string,
    all: boolean,
    vnode: VNode | undefined
  ): any | null {
    return new QuerySelectorHelper(element, vnode).query(selector, all)
  }

  query(selector: string, all: boolean): any | null {
    if (this._element.nodeName == '#comment') {
      return this.queryFragment(this._element, selector, all)
    } else {
      return all
        ? this.querySelectorAll(this._element, selector)
        : this.querySelector(this._element, selector)
    }
  }

  queryFragment(el: UniElement, selector: string, all: boolean): any | null {
    let current = el.nextSibling
    if (current == null) {
      return null
    }

    if (all) {
      const result1: Array<NodeInfo> = []
      while (true) {
        const queryResult = this.querySelectorAll(current!, selector)
        if (queryResult != null) {
          result1.push(...queryResult)
        }
        current = current.nextSibling
        if (current == null || this._commentStartVNode!.anchor == current) {
          break
        }
      }
      return result1
    } else {
      let result2: NodeInfo | null = null
      while (true) {
        result2 = this.querySelector(current!, selector)
        current = current.nextSibling
        if (
          result2 != null ||
          current == null ||
          this._commentStartVNode!.anchor == current
        ) {
          break
        }
      }
      return result2
    }
  }

  querySelector(element: UniElement, selector: string): NodeInfo | null {
    let element2 = this.querySelf(element, selector)
    if (element2 == null) {
      element2 = element.querySelector(selector)
    }
    if (element2 != null) {
      return this.getNodeInfo(element2)
    }
    return null
  }

  querySelectorAll(
    element: UniElement,
    selector: string
  ): Array<NodeInfo> | null {
    const nodesInfoArray: Array<NodeInfo> = []
    const element2 = this.querySelf(element, selector)
    if (element2 != null) {
      nodesInfoArray.push(this.getNodeInfo(element))
    }
    const findNodes = element.querySelectorAll(selector)
    findNodes?.forEach((el: UniElement) => {
      nodesInfoArray.push(this.getNodeInfo(el))
    })
    return nodesInfoArray
  }

  querySelf(element: UniElement | null, selector: string): UniElement | null {
    if (element == null || selector.length < 2) {
      return null
    }

    const selectorType = selector.charAt(0)
    const selectorName = selector.slice(1)
    if (selectorType == '.' && element.classList.includes(selectorName)) {
      return element
    }
    if (selectorType == '#' && element.getAttribute('id') == selectorName) {
      return element
    }
    if (selector.toUpperCase() == element.nodeName.toUpperCase()) {
      return element
    }

    return null
  }

  getNodeInfo(element: UniElement): NodeInfo {
    const rect = element.getBoundingClientRect()
    const nodeInfo = {
      id: element.getAttribute('id')?.toString(),
      dataset: null,
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    } as NodeInfo
    return nodeInfo
  }
}

function requestComponentInfo(
  vueComponent: ComponentPublicInstance | null,
  queue: Array<SelectorQueryRequest>,
  callback: any
) {
  const result: Array<any> = []
  const el = vueComponent?.$el
  if (el != null) {
    queue.forEach((item: SelectorQueryRequest) => {
      const queryResult = QuerySelectorHelper.queryElement(
        el,
        item.selector,
        !item.single,
        vueComponent?.$.subTree
      )
      if (queryResult != null) {
        result.push(queryResult)
      }
    })
  }
  callback(result)
}

export const createSelectorQuery: CreateSelectorQuery =
  function (): SelectorQuery {
    const instance = getCurrentPage() as ComponentPublicInstance
    return new SelectorQueryImpl(instance)
  }
