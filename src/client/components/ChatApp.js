import React, { Component } from 'react'
import socket from '../socket'

import ChatBox from './ChatBox'
import MessageList from './MessageList'
import Header from './Header'
import Login from './Login'
import FeedbackBox from './FeedbackBox'

export default class ChatApp extends Component {
    // At beginning there is no msg and the text-field is empty
  constructor (props) {
    super(props)

    this.login = this.login.bind(this)
  }

  componentDidMount () {

    this.login()
  }

  login () {
    console.log('[ChatApp] login')
    socket.emit('login')
    console.log('[ChatApp] afterLogin')
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
