import { Schema, Types } from '@harmonyjs/persistence'

export default <Schema> {
  date: Types.Date,
  amount: Types.Float,
  category: Types.ID,
  type: Types.String, // 'INCOME', 'MONTHLY', 'NORMAL', 'EXCEPTIONAL'

  account: Types.ID,
}
