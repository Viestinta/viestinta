import React, { Component } from 'react'
import socket from '../../server/socket'
import Paper from 'material-ui/Paper';

import Message from './Message'

const styles = {

  parent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    maxWidth:   500,
    maxHeight:  400,
    width:      'auto',
    height:     'auto',

    marginTop: 10,
    padding: 15,

    overflowY: 'auto',
    minHeight: 0,
  },

  child: {
    minHeight: 'auto',
    width: '100%',

    padding: 10,
    margin: 5,
    textAlign: 'left',
  },
};

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
      <Paper zDepth={3} style={styles.parent}>
        {list}
      </Paper>
    )
  }

}
