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
                Mottate meldinger kommer her

            </div>
        )
    }
}

class ChatBox extends React.Component {

   handleSend(e) {
       const msg = e.target.value;
        // TODO Send message
       this.props.sendMessage(msg);
   }
   render() {
        return (
            <div id="chat-field col-lg-6">
                <div id="input-group">
                    <input type="text" class="form-control" aria-describedby="basic-addon2" />
                    <span class="btn btn-default" type="button" onClick={this.handleSend.bind(this)}>
                        Send
                    </span>
                </div>
            </div>
        )
    }
}

class Message extends React.Component {
    render() {
        return (
            <div id="message">
                <p>Melding her</p>
            </div>
        );
    }
}


class Layout extends React.Component {
    getInitialState() {
        return (
            messages = []
            //socket: window.io('http://localhost:3000')

        )
    }

    componentMounted() {
        this.state.socket.on('new-message', function(msg) {
            this.setState({messages: this.state.messages.push(msg)})
        })
    }

    sendMessage(msg) {
        const message = new Message(msg);

    }

    render() {
        const messages = ["Number one", "Number two", "Three"]
        return (
            <div id="content">

                <Header />
                <ChatField messages="messages"/>

                <ChatBox />


            </div>
        );
    }
}

ReactDOM.render(
    <Layout />,
    document.getElementById("app")
);

