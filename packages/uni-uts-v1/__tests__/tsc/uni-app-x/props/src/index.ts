import { defineComponent, getCurrentInstance } from 'vue'
const __sfc__ = defineComponent({
  props: ['str', 'num'],
  setup() {
    const __ins = getCurrentInstance()!
    const _ctx = __ins.proxy as InstanceType<typeof __sfc__>
    return () => {
      _ctx.str
      _ctx.num
    }
  },
})
