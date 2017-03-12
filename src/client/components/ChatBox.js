import React, { Component } from 'react'
import socket from '../socket'

import RaisedButton from 'material-ui/RaisedButton'

import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'


import injectTapEventPlugin from 'react-tap-event-plugin';


const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  }
})

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
    console.log('[ChatBox] sendMessage')
    // Setting msg.text to written input
    var msg = {
      text: this.state.text
    }

    // Emtpy input field
    this.setState({text: ''})

    socket.emit('new-message', msg)
    console.log("[ChatBox] After sending message")
  }
  // Listen and update field dynamically when something is written
  changeHandler (e) {
    this.setState({ text: e.target.value })
    console.log('[ChatBox] changeHandler')
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div id='chat-box col-lg-6'>
          <h3>Ny melding</h3>
          <input
            onChange={this.changeHandler}
            value={this.state.text}
            />
          <RaisedButton type='submit' onTouchTap={this.sendMessage} label="Send" />
        </div>
      </MuiThemeProvider>
    )
  }
}
