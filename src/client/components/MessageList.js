import React, { Component } from 'react'
import socket from '../socket'
import Paper from 'material-ui/Paper'
import {List} from 'material-ui/List'

import Message from './Message'

const styles = {

  parent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    maxWidth: 500,
    maxHeight: 400,
    width: '100%',
    height: '100%',

    marginTop: 10,
    paddingRight: 20,

    overflowY: 'auto',
    minHeight: 0
  },

  child: {
    height: 500,
    width: '100%',

    padding: 0,
    margin: 0,
    textAlign: 'left'
  }
};

export default class MessageList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      messages: []
    }

    this.receiveMessage = this.receiveMessage.bind(this)
    this.getAllMessages = this.getAllMessages.bind(this)
    this.updateMessageListOrder = this.updateMessageListOrder.bind(this)
    this.sort = this.sort.bind(this) 
    this.getClock = this.getClock.bind(this)
  }

  componentDidMount () {
    socket.on('receive-message', this.receiveMessage)
    socket.on('all-messages', this.getAllMessages)
    socket.on('update-message-order', this.updateMessageListOrder)
  }

  receiveMessage (msg) {
    // Copies the list
    var messages = this.state.messages.slice()

    // Adds the message
    messages.push(msg)
    this.setState({ messages: messages })
    console.log("Messages in receiveMessage: ", this.state.messages)
  }

  getAllMessages (msgList) {
    this.setState({
      messages: msgList
    })
  }

  updateMessageListOrder (msgList) {
    this.setState({ messages: msgList})
    this.sort()
  }

  sort () {
    var list = this.state.messages.slice()
    
    list.sort(function(msgOne, msgTwo) {
      var msgOneVotes = msgOne.votesUp - msgOne.votesDown
      var msgTwoVotes = msgTwo.votesUp - msgTwo.votesDown
    
      if (msgOneVotes > msgTwoVotes) {
        return -1
      } else if (msgOneVotes < msgTwoVotes) {
        return 1
      } else {
        return 0
      }
    })

    this.setState({
      messages: list
    })

  }

  getClock(time) {
    if (time.length > 5) {
        return time.substring(11, 16)
      }

    return time
  }

  render () {

    var list = this.state.messages.map((message, i) => {
      var time = message.time
      time = this.getClock(time)

      return (
        <Message
          key={i}
          time={time}
          text={message.text}
          id={message.id}
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