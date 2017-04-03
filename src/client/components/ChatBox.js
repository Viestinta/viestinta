import React, { Component } from 'react'
import socket from '../socket'

import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

const styles = {
  parent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    maxWidth: 500,
    width: '100%',
    height: 80,

    marginTop: 10,
    padding: 10
  },
  textField: {
    width: '100%',
    marginRight: 5
  },
  btn: {

  }
}

// Text input field
export default class ChatBox extends Component {

  constructor (props) {
    // Starting with empty inputfield
    super(props)
    this.state = {
      text: ''
    }

    this.changeHandler = this.changeHandler.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.cleanInput = this.cleanInput.bind(this)
  }

  componentDidMount () {
    socket.on('send-message', this.sendMessage)
  }

  cleanInput () {
    this.setState({text: ''})
  }

  sendMessage () {
    console.log('[ChatBox] sendMessage to course: ' + this.props.courseCode)
    // Setting msg.text to written input
    var msg = {
      text: this.state.text,
      courseCode: this.props.courseCode,
    }

    // Emtpy input field
    this.setState({text: ''})

    socket.emit('new-message', msg)
    console.log('[ChatBox] After sending message')
  }
  // Listen and update field dynamically when something is written
  changeHandler (e) {
    this.setState({ text: e.target.value })
    console.log('[ChatBox] changeHandler')
  }

  render () {
    return (
      <Paper zDepth={3} style={styles.parent}>
        <TextField
          style={styles.textField}
          hintText='Skriv ny melding her.'
          multiLine
          rows={1}
          rowsMax={2}
          onChange={this.changeHandler}
          value={this.state.text}
            />
        <RaisedButton
          style={styles.btn}
          primary={true}
          label='Send'
          onTouchTap={this.sendMessage}
            />
      </Paper>
    )
  }
}
