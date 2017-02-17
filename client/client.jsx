var socket = io.connect()

class Header extends React.Component {
  render () {
    return (
      <header>
        <h1> Velkommen til Viestinta! </h1>
      </header>
    )
  }
}

class Message extends React.Component {
  render () {
    return (
      <div id='message'>
                { this.props.text }
      </div>
    )
  }
}

class ChatField extends React.Component {

  render () {

      // Loop trought the messages in the state and create a Message component
      const messages = this.props.messages.map((message, i) => {
          console.log("Looping trought messages")
          return (
            <Message
                key = {i}
                text={message.text}
                    />
          )
      })

    return (
      <div id='chat-field'>
        { messages }
    </div>
    )
  }
}

var ChatBox = React.createClass({

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

var ChatApp = React.createClass({

    // At beginning there is no msg and the text-field is empty
  getInitialState () {
    return {
      messages: [],
        text: '',
    }
  },

  componentDidMount () {
      // Not working, I think
      socket.on('send:message', this._messageRecieve);

  },

    // When a message is received
  _messageRecieve (message) {
    var {messages} = this.state
    messages.push(message)
    this.setState({messages})
  },

    // When a message is submitted
  sendMessage (message) {
      var messages = this.state.messages;
      messages.push(message);
      this.setState({ messages: messages });
      socket.emit('send:message', message);
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

ReactDOM.render(
  <ChatApp />,
    document.getElementById('app')
)