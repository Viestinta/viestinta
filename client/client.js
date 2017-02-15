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
    },

    handleSend(e) {
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
   },

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

