import { Model } from '@harmonyjs/persistence'

import schema from './schema'
import computed from './computed'
import scopes from './scopes'

export default <Model> {
  schema,
  computed,
  scopes,
}
