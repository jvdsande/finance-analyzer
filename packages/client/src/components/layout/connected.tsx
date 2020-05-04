import React from 'react'
import ConnectedRouter from 'components/shared/routers/connected'

import 'style/style.scss'

const LayoutConnected = ({ children } : { children: React.ReactNode }) => (
  <ConnectedRouter>
    {children}
  </ConnectedRouter>
)

export default LayoutConnected
