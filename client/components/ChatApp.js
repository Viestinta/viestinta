import React, { Component } from 'react'

import ChatBox from './ChatBox'
import ChatField from './ChatField'
import Header from './Header'
import Login from './Login'

export default class ChatApp extends Component {

	// At beginning there is no msg and the text-field is empty
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      text: '',
      socket: io.connect()
    }

    this.sendMessage = this.sendMessage.bind(this)
    this.join = this.join.bind(this)
    this.receiveMessage = this.receiveMessage.bind(this)
  }

  componentDidMount () {
    this.state.socket.on('join', this.join)
    this.state.socket.on('send-message', this.sendMessage)
    this.state.socket.on('receive-message', this.receiveMessage)
  }

  join () {
    console.log('join')
    this.state.socket.emit('join', 'Hello world from client')
  }

  receiveMessage (msg) {
    console.log('receiveMessage: ', msg.text)
    this.state.messages.push(msg)
    this.setState({ messages: this.state.messages })
  }

	// When a message is submitted
  sendMessage (msg) {
    console.log('sendMessage: ', msg.text)
    this.state.socket.emit('new-message', msg)
  }

  render () {
    return (
      <div id='content'>
        <Header />
        <Login />
        <ChatField
          messages={this.state.messages}
				/>
        <ChatBox
          sendMessage={this.sendMessage}
					/>
      </div>
    )
  }
}
