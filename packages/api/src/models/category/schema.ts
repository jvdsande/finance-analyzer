import { Schema, Types } from '@harmonyjs/persistence'

export default <Schema> {
  name: Types.String,
  color: Types.String, // Either RGBA or HexCode

  account: Types.ID,
}
