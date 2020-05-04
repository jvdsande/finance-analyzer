import { PropertyMode, Schema, Types } from '@harmonyjs/persistence'

export default <Schema> {
  email: Types.String,
  password: Types.String.withMode(PropertyMode.INPUT),
  active: Types.Boolean,

  firstName: Types.String,
  lastName: Types.String,

  goals: {
    saving: Types.Float,
    categories: [{
      category: Types.ID,
      value: Types.Float, // use Math.max(100, total) as base100
    }],
  },
}
