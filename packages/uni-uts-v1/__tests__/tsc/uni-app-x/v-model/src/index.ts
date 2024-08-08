import { defineComponent, useModel } from 'vue'
defineComponent({
  props: {
    modelValue: { type: String },
    msg: { type: String, default: 'default msg' },
    num: { type: Number, default: 1 },
  },
  setup(props) {
    const modelValue = useModel(props, 'modelValue')
    modelValue.value = '123'
    const msg = useModel(props, 'msg')
    msg.value = '123'
    const num = useModel(props, 'num')
    num.value = 1
  },
})
