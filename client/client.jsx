console.log('In client.jsx')

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
                /*{ this.props.user }*/
                { this.props.text }
        <p>Melding her</p>
      </div>
    )
  }
}

class ChatField extends React.Component {

  render () {
        // Loop trought the messages in the state and create a Message component
    const messages = this.props.messages.map((message) => {
      return (
        <Message
          text={message.text}
                />
      )
    })

    return (
      <div id='chat-field'>
        { messages }
                Meldingen kommer her
            </div>
    )
  }
}

var ChatBox = React.createClass({

  getInitialState () {
    return {text: ''}
  },

  handleMessageSubmit (e) {
    e.preventDefault()
    console.log('In handle send')
    var msg = {
      user: this.props.user,
      text: this.state.text
    }
    this.props.sendMessage(msg)
    this.setState({ text: '' })
  },
  changeHandler (e) {
    this.setState({ text: e.target.value })
  },

  render () {
    return (
      <div id='chat-box col-lg-6'>
        <h3>Ny melding</h3>
        <form onSubmit={this.handleMessageubmit}>
          <input
            onChange={this.changeHandler}
            value={this.state.text}
                    />
          <button type='btn btn-submit' />
        </form>
      </div>
    )
  }
})

var ChatApp = React.createClass({

  getInitialState () {
    return {
      messages: [], text: ''}
  },

  componentDidMount () {

  },

  _messageRecieve (message) {
    var {messages} = this.state
    messages.push(message)
    this.setState({messages})
  },

  handleMessageSubmit (message) {
    var {messages} = this.state
    messages.push(message)
    this.setState({messages})
  },

  render () {
    return (
      <div id='content'>
        <Header />
        <ChatField
          messages={this.state.messages}
              />
        <ChatBox
          onMessageSubmit={this.handleMessageSubmit}
          user={this.state.user}
              />
      </div>
    )
  }
})

ReactDOM.render(
  <ChatApp />,
    document.getElementById('app')
)

