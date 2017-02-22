import React from 'react'
import Message from './Message'

export default class ChatField extends React.Component {

  render () {
  	// Loop trought the messages in the state and create a Message component
  	const messages = this.props.messages.map((message, i) => {
    console.log('Looping trought messages')

    return (
      <Message
        key={i}
        text={message.text}
			/>
    )
  })

    return (
      <div id='chat-field'>
        { messages }
      </div>
    )
  }
}
