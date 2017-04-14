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
    this.validateMessage = this.validateMessage.bind(this)
  }

  componentDidMount () {
    socket.on('send-message', this.sendMessage)
  }

  cleanInput () {
    this.setState({text: ''})
  }

  sendMessage () {
    console.log('[ChatBox] sendMessage to room: ' + this.props.lecture.room)
    if (this.validateMessage(this.state.text)) {
      // Setting msg.text to written input
      var msg = {
        text: this.state.text,
        lecture: {
          id:  JSON.stringify(this.props.lecture.id),
          code: this.props.lecture.course.code,
          room: this.props.lecture.room,
        },
        errorText: ''

      }
       // Emtpy input field
      this.setState({text: ''})

      socket.emit('new-message', msg)
      console.log('[ChatBox] After sending message')
   
    }
    
  }
  // Listen and update field dynamically when something is written
  changeHandler (e) {
    this.setState({ text: e.target.value })
    console.log('[ChatBox] changeHandler')
  }

  validateMessage (msg) {
    console.log("Length: ", msg.length)
    if (msg.length < 3 ) {
      // Error message that message is to short
      console.log("Error: message is to short: ", msg.length)
      this.setState({'errorText': 'Meldingen må være på minst 3 tegn.'})
      return false
    } else if (msg.length > 250) {
      // Error message that message is to long
      console.log("Error: message is to long: ", msg.length)    
      this.setState({'errorText': 'Meldingen må være under 250 tegn.'})
      return false
    }
    return true

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
          errorText={this.state.errorText}
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
