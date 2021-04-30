import { defineComponent, inject, onUnmounted, watch } from 'vue'
import { useCustomEvent } from '@dcloudio/uni-components'
import { Map, Circle } from './qqMap/types'
import { QQMapsExt } from './qqMap'

const props = {
  latitude: { type: [Number, String], require: true },
  longitude: { type: [Number, String], require: true },
  color: { type: String, default: '' },
  fillColor: { type: String, default: '' },
  radius: { type: [Number, String], require: true },
  strokeWidth: { type: [Number, String], default: '' },
  level: { type: String, default: '' },
}

export type Props = Partial<Record<keyof typeof props, any>>
type CustomEventTrigger = ReturnType<typeof useCustomEvent>
type OnMapReadyCallback = (
  map: Map,
  maps: QQMapsExt,
  trigger: CustomEventTrigger
) => void
type OnMapReady = (callback: OnMapReadyCallback) => void

export default /*#__PURE__*/ defineComponent({
  name: 'MapCircle',
  props,
  setup(props) {
    const onMapReady: OnMapReady = inject('onMapReady') as OnMapReady
    let circle: Circle
    function removeCircle() {
      if (circle) {
        circle.setMap(null)
      }
    }
    onMapReady((map, maps) => {
      function updateCircle(option: Props) {
        removeCircle()
        addCircle(option)
      }
      function addCircle(option: Props) {
        const center = new maps.LatLng(option.latitude, option.longitude)
        function getColor(color: string) {
          const c = color.match(/#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?/)
          if (c && c.length) {
            return maps.Color.fromHex(c[0], Number('0x' + c[1] || 255) / 255)
          } else {
            return undefined
          }
        }
        circle = new maps.Circle({
          map,
          center,
          clickable: false,
          radius: option.radius,
          strokeWeight: Number(option.strokeWidth) || 1,
          fillColor: getColor(option.fillColor) || getColor('#00000001'),
          strokeColor: getColor(option.color) || '#000000',
          strokeDashStyle: 'solid',
        })
      }
      addCircle(props as Props)
      watch(props, updateCircle)
    })
    onUnmounted(removeCircle)
    return () => {
      return null
    }
  },
})
