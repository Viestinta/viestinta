import React from 'react'
import ReactDOM from 'react-dom'

export default ChatBox = React.createClass({

  getInitialState () {
	  // Starting with empty inputfield
	return {text: ''}
  },

  handleMessageSubmit (e) {
	e.preventDefault()
	console.log('In handle send')
	var msg = {
		// Setting msg.text to written input
		text: this.state.text
	}

	this.props.sendMessage(msg)
	  // Emtpy input field
	this.setState({ text: '' })
  },
	// Listen and update field dynamically when something is written
  changeHandler (e) {
	this.setState({ text: e.target.value })
	  console.log("Changing state")
  },

  render () {
	return (
	  <div id='chat-box col-lg-6'>
		<h3>Ny melding</h3>
		  <input
			onChange={this.changeHandler}
			value={this.state.text}
					/>
		  <button type='submit' value="Send" onClick={this.handleMessageSubmit}>Send</button>

	  </div>
	)
  }
})
