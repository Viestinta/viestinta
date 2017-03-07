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
      <Paper zDepth={3} style={styles.parent}>
        <Paper
          zDepth={3} 
          style={styles.child}
        >
          <h4>This is some text.</h4>
        </Paper>
        <Paper
          zDepth={3} 
          style={styles.child}
        >
          <h4>This is some more text.</h4>
        </Paper>
        <Paper
          zDepth={3} 
          style={styles.child}
        >
          <h4>This is some more text. With lots of words, 
          to make the message really long, and this is only 
          to see what happens.
          This is some more text. With lots of words, 
          to make the message really long, and this is only 
          to see what happens.
          </h4>
        </Paper>
        <Paper
          zDepth={3} 
          style={styles.child}
        > 
          <h4>Student:</h4>
          <h4>This text also contains numbers 1-2-3-4.</h4>
        </Paper>
        <Paper
          zDepth={3} 
          style={styles.child}
        > 
          <h4>Student:</h4>
          <h4>This text also contains numbers 1-2-3-4.</h4>
        </Paper>
        <Paper
          zDepth={3} 
          style={styles.child}
        > 
          <h4>Student:</h4>
          <h4>This text also contains numbers 1-2-3-4.</h4>
        </Paper>

        
      </Paper>
    );
  }

}