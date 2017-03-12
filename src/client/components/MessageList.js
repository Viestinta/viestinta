import React, { Component } from 'react'
import socket from '../socket'
import Message from './Message'

export default class MessageList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      messages: []
    }

    this.receiveMessage = this.receiveMessage.bind(this)
    this.lastTenMessages = this.lastTenMessages.bind(this)
  }

  componentDidMount () {
    socket.on('receive-message', this.receiveMessage)
    socket.on('last-ten-messages', this.lastTenMessages)
  }

  receiveMessage (msg) {
    console.log('receiveMessage: ', msg.text)
    // Copies the list
    var messages = this.state.messages.slice()
    // Adds the message
    messages.push(msg)
    this.setState({ messages: messages })
  }

  lastTenMessages (msgList) {
    console.log('lastTenMessages: ', msgList)
    this.setState({
      messages: msgList
    })
  }

  render () {
    var list = this.state.messages.map((message, i) => {
      console.log('Looping trought messages in messageList')

      var time = message.time
      // console.log('Date: ', date)
      // var time = date.format('dd.MM.yyyy HH:mm')
      // console.log('Time: ', time)
      return (
        <Message
          key={i}
          time={time}
          text={message.text}
        />
      )
    })

    return (
      <ul>
        {list}
      </ul>
    )
  }

}
