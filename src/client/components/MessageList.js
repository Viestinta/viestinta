import React, { Component } from 'react'
import socket from '../../server/socket'
import Message from './Message'

export default class MessageList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      messages: []
    }

    this.receiveMessage = this.receiveMessage.bind(this)  
  }

  componentDidMount() {
    socket.on('receive-message', this.receiveMessage)
  }

  receiveMessage (msg) {
    console.log('receiveMessage: ', msg.text)
    // Copies the list
    var messages = this.state.messages.slice()
    // Adds the message
    messages.push(msg)
    this.setState({ messages: messages })
  }
  
  render () {

    var list = this.state.messages.map((message, i) => {
      console.log('Looping trought messages in messageList')

      return (
        <Message
          key={i}
          text={message.text}
        />
      )
    })

    return (
      <ul>
        {list}
      </ul>
    );
  }

}