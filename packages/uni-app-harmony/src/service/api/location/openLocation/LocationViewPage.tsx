// @ts-nocheck
// TODO 优化此处代码，此页面无对应的css
import { definePage } from '@dcloudio/uni-app-plus/service/framework/page/define'
import { createCommentVNode, createElementBlock, openBlock } from 'vue'
import { once } from '@dcloudio/uni-shared'

const LocationViewPage = {
  data() {
    return {
      latitude: 0,
      longitude: 0,
      loaded: false,
    }
  },
  onLoad(e) {
    this.latitude = e.latitude
    this.longitude = e.longitude
    this.loaded = true
  },
  methods: {},
  render: function (_ctx, _cache, $props, $setup, $data, $options) {
    return $data.loaded
      ? (openBlock(),
        createElementBlock(
          'location-view',
          {
            key: 0,
            style: { width: '100%', height: '100%' },
            latitude: $data.latitude,
            longitude: $data.longitude,
          },
          null,
          40,
          ['latitude', 'longitude']
        ))
      : createCommentVNode('v-if', true)
  },
}

export const ROUTE_LOCATION_VIEW_PAGE = '__uniappopenlocation'

export const initLocationViewPageOnce = once(() => {
  definePage(ROUTE_LOCATION_VIEW_PAGE, LocationViewPage)
  __uniRoutes.push({
    meta: {
      navigationBar: {
        style: 'custom',
      },
      isNVue: false,
      route: ROUTE_LOCATION_VIEW_PAGE,
    },
    path: '/' + ROUTE_LOCATION_VIEW_PAGE,
  })
})
