console.log("In main");

class Header extends React.Component {
    render() {
        return (
            <header>
                <h1> Velkommen til Viestinta! </h1>
            </header>
        )
    }
}

class ChatField extends React.Component {
    constructor(messages) {
        super(messages);
    }

    printMessages(messages) {
        for (var i = 0; i < messages.size(); i++) {
            <p> messages[i] </p>
        }
    }

    render() {

        const messages = this.props
        return (
            <div id="chat-field">
                {
                    this.props.messages.map((message, i) => {
                        return (
                            <Message
                                key={i}
                                user={message.user}
                                text={message.text}
                            />
                        );
                    })
                }
                Meldingen kommer her
            </div>
        )
    }
}

class ChatBox extends React.Component {
    getInitialState() {
        return {text: ''};
    }

    handleMessageSubmit(e) {
        e.preventDefault();
        console.log("In handle send");
        var msg = {
            user : this.props.user,
            text : this.state.text
        }
        this.props.sendMessage(msg);
        this.setState({ text: ''});

   }
   changeHandler(e) {
       this.setState({ text : e.target.value });
   }

   render() {
        return (
            <div id="chat-box col-lg-6">
                <h3>Ny melding</h3>
                <form onSubmit="{this.sendMessage}">
                    <input
                        onChange={this.changeHandler}
                        value={this.state.text}
                    />
                </form>
            </div>
        )
    }
}


class Message extends React.Component {
    render() {
        return (
            <div id="message">
                { this.props.user }
                { this.props.text }
                <p>Melding her</p>
            </div>
        );
    }
}


class ChatApp extends React.Component {

  getInitialState() {
      return {
          messages:[], text: ''};
  }

  componentDidMount() {
      socket.on('init', this._initialize);
      socket.on('send:message', this._messageRecieve);
      socket.on('user:join', this._userJoined);
      socket.on('user:left', this._userLeft);
      socket.on('change:name', this._userChangedName);
  }

  _initialize(data) {
      var {users, name} = data;
      this.setState({users, user: name});
  }

  _messageRecieve(message) {
      var {messages} = this.state;
      messages.push(message);
      this.setState({messages});
  }

  handleMessageSubmit(message) {
      var {messages} = this.state;
      messages.push(message);
      this.setState({messages});
      socket.emit('send:message', message);
  }

  render() {
      return (
          <div id="content">
              <Header
                  users={this.state.users}
              />
              <ChatField
                  messages={this.state.messages}
              />
              <ChatBox
                  onMessageSubmit={this.handleMessageSubmit}
                  user={this.state.user}
              />
          </div>
      );
  }
}


ReactDOM.render(
    <ChatApp />,
    document.getElementById("app")
);

