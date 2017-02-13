console.log("In main");

class ChatField extends React.Component {
    render() {
        return (
            <div id="chat-field">
                Mottate meldinger kommer her
            </div>
        )
    }
}

class ChatBox extends React.Component {
   render() {
        return (
            <div id="chat-field col-lg-6">
                <div id="input-group">
                    <input type="text" class="form-control" aria-describedby="basic-addon2" />
                    <span class="btn btn-default" type="button">
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
            <p>Melding her</p>
        );
    }
}


class Layout extends React.Component {

    render() {
        return (
            <div>
                <ChatField />

                <ChatBox />


            </div>
        );
    }
}

ReactDOM.render(
    <Layout />,
    document.getElementById("app")
);

