import React from 'react'
import ReactDOM from 'react-dom'

import ChatApp from './components/ChatApp'

if (typeof window !== 'undefined') {
  ReactDOM.render(
    <ChatApp />,
		document.getElementById('app')
	)
}
