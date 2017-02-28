import React, { Component } from 'react'

export default class ChatBox extends Component {

  constructor (props) {
    // Starting with empty inputfield
    super(props)
    this.state = {
      text: ''
    }

    this.changeHandler = this.changeHandler.bind(this)
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this)
    this.cleanInput = this.cleanInput.bind(this)
  }

  cleanInput () {
    this.setState({text: ''})
  }

  handleMessageSubmit (e) {
    e.preventDefault()
    console.log('In handle send')
    // Setting msg.text to written input
    var msg = {
      text: this.state.text
    }

    // Emtpy input field
    this.setState({text: ''})

    console.log('Empty message field: ', this.state.text)

    this.props.sendMessage(msg)
  }
  // Listen and update field dynamically when something is written
  changeHandler (e) {
    this.setState({ text: e.target.value })
    console.log('Changing state')
  }

  render () {
    return (
      <div id='chat-box col-lg-6'>
        <h3>Ny melding</h3>
        <input
          onChange={this.changeHandler}
          value={this.state.text} />
        <button type='submit' value='Send' onClick={this.handleMessageSubmit}>Send</button>

      </div>
    )
  }
}
