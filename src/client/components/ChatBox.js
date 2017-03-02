import React, { Component } from 'react'
import socket from '../../server/socket'

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
    this.SendMessage = this.sendMessage.bind(this)
    this.cleanInput = this.cleanInput.bind(this)

  }
  
  componentDidMount () {
    socket.on('send-message', this.sendMessage)
  }


  cleanInput () {
    this.setState({text: ''})
  }

  sendMessage () {
    e.preventDefault()
    console.log('In handle send')
    // Setting msg.text to written input
    var msg = {
      text: this.state.text
    }

    // Emtpy input field
    this.setState({text: ''})

    console.log('Empty message field: ', this.state.text)

    socket.emit('receive-message', msg)
  }
  // Listen and update field dynamically when something is written
  changeHandler (e) {
    this.setState({ text: e.target.value })
    console.log('Changing state')
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
          <RaisedButton type='submit' onTouchTap={this.handleMessageSubmit} label="Send" />
        </div>
      </MuiThemeProvider>
    )
  }
}
