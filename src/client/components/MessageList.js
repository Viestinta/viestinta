import React, { Component } from 'react'
import socket from '../../server/socket'
import Paper from 'material-ui/Paper';
import {List} from 'material-ui/List';

import Message from './Message'

const styles = {

  parent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    maxWidth:   500,
    maxHeight:  400,
    width:      '100%',
    height:     '100%',

    marginTop: 10,
    paddingRight: 20,

    overflowY: 'auto',
    minHeight: 0,
  },

  child: {
    height: 500,
    width: '100%',

    padding: 0,
    margin: 0,
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
        <List style={styles.child}>
          {list}
        </List>
      </Paper>
    )
  }

}
