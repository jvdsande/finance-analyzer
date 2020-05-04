import { OperationAccessor } from 'accessors'
import { observable, action } from 'mobx'
import moment from 'moment'
import StateOperations from 'state/entities/operations'

export default class StateDragNDrop {
  operations : any[] = []

  @observable element : string = ''

  @observable target : string = ''

  @observable position = { x: 0, y: 0 }

  onDate ?: ((date: string) => void)

  constructor(operations : StateOperations) {
    this.operations = operations.operations

    if (typeof window !== 'undefined') {
      window.addEventListener('mouseup', this.drop)
      window.addEventListener('mousemove', this.move)
    }
  }

  @action.bound grab(element : any) {
    this.element = element
  }

  @action.bound drop() {
    if (this.target && this.element) {
      const date = moment(this.target.split('--')[0]).toISOString()
      OperationAccessor
        .mutate
        .update
        .withId(this.element)
        .withRecord({
          date,
        })
        .then(async () => null)

      if (this.onDate) {
        this.onDate(date)
      }
    }

    this.target = ''
    this.element = ''
  }

  @action.bound onTargetEnter(target : any) {
    this.target = target
  }

  @action.bound onTargetLeave(target : any) {
    if (this.target === target) {
      this.target = ''
    }
  }

  @action.bound move(e : MouseEvent) {
    if (this.element) {
      this.position = {
        x: e.x,
        y: e.y,
      }
    }
  }
}
