import React from 'react'
import ReactDOM from 'react-dom'

import ChatApp from './components/ChatApp'

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
if (typeof window !== 'undefined') {
  ReactDOM.render(
    <ChatApp id='chat-app' />,
		document.getElementById('app')
	)
}
