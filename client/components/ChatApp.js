import React from 'react'

import ChatBox from './ChatBox'
import ChatField from './ChatField'
import Header from './Header'
import Message from './Message'
import FeedBackMenu from './FeedBackMenu'

export default class ChatApp extends React.createClass({

	// At beginning there is no msg and the text-field is empty
  getInitialState () {
  	console.log("In getinitialstate")
  	return {
  	  messages: [],
  	  text: '',
  	  socket: io.connect('http://localhost:8000'),
  	}

  	  console.log("Socket in getInitialState: ", socket)
  },

  componentDidMount () {
  		this.state.socket.on('join', this.join)
  		this.state.socket.on('send-message', this.sendMessage)
  		this.state.socket.on('receive-message', this.receiveMessage)
  		
  },

  join () {
  	console.log("join")
  	this.state.socket.emit("join", 'Hello world from client')
  },

  receiveMessage (msg) {
  	console.log("receiveMessage: ", msg.text)
  	this.state.messages.push(msg)
  	console.log("MessagesState: ", this.state.messages)
  	this.setState({ messages: this.state.messages })
  },
  
  // When a message is submitted
  sendMessage (msg) {
  	console.log("sendMessage: ", msg.text)
	  this.state.socket.emit('new-message', msg)
  },

  render () { 
  	return (
  	  <div id='content'>
    		<Header />
    		<ChatField
            messages={this.state.messages}
    			/>
    		<ChatBox
    		  sendMessage={this.sendMessage}
    			  />
  	  </div>
  	)
  }
})