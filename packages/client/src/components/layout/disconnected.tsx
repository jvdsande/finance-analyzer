import React from 'react'
import ConnectedRouter from 'components/shared/routers/connected'

import 'style/style.scss'

const LayoutDisconnected = ({ children } : { children: React.ReactNode }) => (
  <ConnectedRouter login>
    {children}
  </ConnectedRouter>
)

export default LayoutDisconnected
