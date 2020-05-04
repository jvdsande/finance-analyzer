import { observable, toJS } from 'mobx'
import StateCategories from 'state/entities/categories'
import StateOperations from 'state/entities/operations'
import StateDragNDrop from 'state/utils/dragndrop'

import StateSession from './entities/session'

// Add `toJS` to console object for easy mobx debugging
declare global {
  interface Console {
    toJS: (a: any) => void
  }
}

console.toJS = (a: any) => console.log(toJS(a))


class StateManager {
  session = new StateSession()

  operations = new StateOperations(this.session)

  categories = new StateCategories(this.session)

  dragndrop = new StateDragNDrop(this.operations)

  @observable language = null

  @observable overview = 'monthly'

  @observable showSettings = false
}

const state = new StateManager()

export default state
