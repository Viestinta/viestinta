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
    height: 116,

    marginTop: 10,
    padding: 10
  },
  textField: {
    width: '100%',
    marginRight: 5,
  },
  btn: {

  }
}

// Text input field
export default class ChatBox extends Component {

  /**
   * @summary Save state and binding functions.
   * @param {props} props - lecture from LectureWrapper.
   */
  constructor (props) {
    // Starting with empty inputfield
    super(props)
    this.state = {
      text: '',
      textLength: 0,
      sendDisabled: true,
    }

    this.changeHandler = this.changeHandler.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.keyDown = this.keyDown.bind(this)
  }

  /**
   * @summary Set ChatBox to listen for server events.
   */
  componentDidMount () {
    socket.on('send-message', this.sendMessage)
  }

  /**
   * @summary Send message to the server.
   */
  sendMessage () {
    // Setting msg.text to written input.
    var msg = {
      text: this.state.text.split('\n').join('\\n'),
      lecture: {
        id:  JSON.stringify(this.props.lecture.id),
        code: this.props.lecture.course.code,
        room: this.props.lecture.room,
      }
    }
    
    // Emtpy input field
    this.setState({
      text: '',
      textLength: 0,
      sendDisabled: true,
    })

    socket.emit('new-message', msg)
  }
 
  /**
   * @summary Save the written value every time it is changed.
   * @param {event} event - The event that triggered the function
   */
  // Listen and update field dynamically when something is written
  changeHandler (event) {
    var text = event.target.value
    var length = event.target.value.length
    var disable = false
    
    if (length <= 3) {
      disable = true
    } else if (length > 250) {
      text = event.target.value.substring(0, 250)
      length = 250
    }

    this.setState({ 
      text: text,
      textLength: length,
      sendDisabled: disable,
    })
  }

  /**
   * @summary Checks if enter or enter + shift is pressed, and do right action.
   * @param {event} event - The event that triggered the function
   */
  keyDown (event) {
    if (event.key === 'Enter' && !event.ctrlKey) {
      this.sendMessage()
      event.preventDefault()
    } else if (event.key === 'Enter' && event.ctrlKey) {
      this.setState({text: this.state.text + '\n'})
    }
  }

  render () {
    return (
      <Paper zDepth={3} style={styles.parent}>
        <TextField
          style={styles.textField}
          floatingLabelText={this.state.textLength + "/250 tegn."}
          floatingLabelFixed={true}
          hintText='Skriv ny melding her.'
          multiLine={true}
          rows={1}
          rowsMax={2}
          onChange={this.changeHandler}
          value={this.state.text}
          onKeyDown={this.keyDown}
        />
        <RaisedButton
          style={styles.btn}
          primary={true}
          label='Send'
          onTouchTap={this.sendMessage}
          disabled={this.state.sendDisabled}
        />
      </Paper>
    )
  }
}
