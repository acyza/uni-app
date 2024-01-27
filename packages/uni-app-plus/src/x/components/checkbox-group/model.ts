/// <reference types="@dcloudio/uni-app-x/types/native-global" />

export const CHECKBOX_GROUP_NAME = 'CheckboxGroup'
export const CHECKBOX_GROUP_ROOT_ELEMENT = 'uni-checkbox-group-element'
export class UniCheckboxGroupElement extends UniFormControlElement<string[]> {
  _initialValue: string[] = []

  constructor(data: INodeData, pageNode: PageNode) {
    super(data, pageNode)
  }

  override get value(): string[] {
    return this._getValue()
  }
  override set value(value: string[]) {
    this._setValue(value)
  }

  override reset() {
    this.value = this._initialValue.slice(0)
  }

  _getValue = (): string[] => {
    return this._initialValue
  }
  _setValue = (value: string[]) => {}
}

// export const checkboxGroupProps = {}
class UniCheckboxGroupChangeEventDetail {
  value: string[]
  constructor(value: string[]) {
    this.value = value
  }
}
export class UniCheckboxGroupChangeEvent extends CustomEvent<UniCheckboxGroupChangeEventDetail> {
  constructor(value: string[]) {
    super('change', {
      detail: new UniCheckboxGroupChangeEventDetail(value),
    })
  }
}
