import React, { Component } from 'react'
import Message from './Message'

export default class ChatField extends Component {

  constructor (props) {
    super(props)
    // Starting with empty message-list
    this.state = {
      messages: props.messages
    }

    this.updateField = this.updateField.bind(this)
  }

  updateField (msg) {
    this.setState({messages: msg})
  }

  render () {
    console.log('In render in chatField')
    console.log('messages: ', this.state.messages)

    // Loop trought the messages in the state and create a Message component
    const messages = this.state.messages.map((message, i) => {
      console.log('Looping trought messages')

      return (
        <Message
          key={i}
          text={message.text} />
      )
    })

    return (
      <div id='chat-field'>
        { messages }
      </div>
    )
  }
}
