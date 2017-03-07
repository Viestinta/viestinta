import React, { Component } from 'react';
import socket from '../../server/socket';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

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
        padding: 10,
    },
    textField: {
        width: '100%',
        marginRight: 5,
    },
    btn: {

    },
};

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
        <Paper zDepth={3} style={styles.parent}>
            <TextField
                style={styles.textField}
                hintText='Skriv ny melding her.'
                multiLine={true}
                rows={1}
                rowsMax={2}
            />    
            <RaisedButton
                style={styles.btn}
                primary={true}
                label='Send'
                onChange={this.changeHandler}
                value={this.state.text}                
                onTouchTap={this.handleMessageSubmit}
            />
        </Paper>
    )
  }
}
