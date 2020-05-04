import React from 'react';

import LayoutDisconnected from 'components/layout/disconnected'
import PageLogin from 'components/pages/disconnected/login'

function Login() {
  return (
    <LayoutDisconnected>
      <PageLogin />
    </LayoutDisconnected>
  )
}

export default Login;
