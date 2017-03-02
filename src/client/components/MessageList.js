import React, { Component } from 'react'
import Message from './Message'

export default class MessageList extends Component {

  constructor (props) {
    super(props)
  }

  render () {

    var list = this.props.messages.map((message, i) => {
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