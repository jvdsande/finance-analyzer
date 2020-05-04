/* eslint-disable max-classes-per-file */
import { CategoryAccessor } from 'accessors'
import {
  observable, when,
} from 'mobx'

import StateSession from 'state/entities/session'

export default class StateCategories {
  @observable categories : any[] = []

  constructor(sessionState : StateSession) {
    const categorySubscriptions = CategoryAccessor.query
      .readMany
      .select({
        _id: true,
        name: true,
        color: true,
      })

    when(() => !!sessionState.token, () => {
      categorySubscriptions.subscribe(async (categories) => {
        this.categories = categories as any[]
      })
    })
  }
}
