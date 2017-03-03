import React, { Component } from 'react'
import socket from '../../server/socket'

import ChatBox from './ChatBox'
import MessageList from './MessageList'
import Header from './Header'
import Login from './Login'
import FeedbackBox from './FeedbackBox'

export default class ChatApp extends Component {
    // At beginning there is no msg and the text-field is empty
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    socket.on('join', this.join)
  }

  join () {
    console.log('join')
    socket.emit('join', 'Hello world from client')
  }

  render () {
    return (
      <div id='content'>
        <Header />
        <Login />
        <MessageList />
        <ChatBox />
        <FeedbackBox />
      </div>
      
    )
  }
}
