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

  constructor (props) {
    // Starting with empty inputfield
    super(props)
    this.state = {
      text: '',
      textToSend: '',
      textLength: 0,
      sendDisabled: true,
      ctrlPushed: false,
    }

    this.changeHandler = this.changeHandler.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.keyPushedDown = this.keyPushedDown.bind(this)
    this.keyPushedUp = this.keyPushedUp.bind(this)
    this.createMessageWithLinebreaks = this.createMessageWithLinebreaks.bind(this)
  }

  componentDidMount () {
    socket.on('send-message', this.sendMessage)
  }

  sendMessage () {
    console.log('[ChatBox] sendMessage to room: ' + this.props.lecture.room)

    this.createMessageWithLinebreaks()

    // Setting msg.text to written input
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
      textToSend: '',
      ctrlPushed: false
    })

    socket.emit('new-message', msg)
    console.log('[ChatBox] After sending message')
  }

  // Listen and update field dynamically when something is written
  changeHandler (e) {
    console.log("CHangehandler: ", e.target.value)
    var text = e.target.value
    var length = e.target.value.length
    var disable = false
    
    if (length <= 3) {
      disable = true
    } else if (length > 1000) {
      text = e.target.value.substring(0, 1000)
      length = 1000
    }

    this.setState({ 
      text: text,
      textLength: length,
      sendDisabled: disable,
      ctrlPushed: false
    })
    console.log('[ChatBox] changeHandler')
  }

  createMessageWithLinebreaks () {
    console.log("createMessageWithLinebreaks")
    /*
    let newline = '<br />'
    let start = this.state.textToSend.replace('<br />', '').length
    let end = this.state.text.length
    console.log("Start: ", start, "end: ", end, "--> ", this.state.text.substring(start, end))
    let newTextToSend = this.state.textToSend + this.state.text.substring(start, end) + newline

    this.setState({textToSend: newTextToSend})
    console.log("textToSend: ", this.state.textToSend)
    */
    //console.log(this.state.text," --> ", this.state.text.replaceAll('\n', '\\n'))
  }

  keyPushedDown (key) {
    if (key.key === 'Enter') {
      //this.sendMessage()
      console.log("Enter pushed")

      this.createMessageWithLinebreaks()
      
    }
    /*
    if (key.key === 'Enter' && !this.state.ctrlPushed) {
        this.sendMessage()
    }
    else if (key.keyCode === 17) {

      console.log("Ctrl down")
      this.setState({ctrlPushed: true})
    }
  */
  }

  keyPushedUp (key) {
    if (key.keyCode === 17) {
      console.log("Ctrl up")
      this.setState({ctrlPushed: false})
    }
    if (key.key === 'Enter') {
      console.log("Enter up")
      
    }

  }

  render () {
    return (
      <Paper zDepth={3} style={styles.parent}>
        <TextField
          style={styles.textField}
          floatingLabelText={this.state.textLength + "/1000 tegn."}
          floatingLabelFixed={true}
          hintText='Skriv ny melding her.'
          multiLine={true}
          rows={1}
          rowsMax={2}
          onChange={this.changeHandler}
          value={this.state.text}
          onKeyPress={this.keyPushedDown}
          
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
