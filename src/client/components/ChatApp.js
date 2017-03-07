import React, { Component } from 'react'
import socket from '../../server/socket'

// Theme
import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

// Components
import ChatBox from './ChatBox'
import MessageList from './MessageList'
import Header from './Header'
import Login from './Login'
import FeedbackBox from './FeedbackBox'

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 0,
        height: 'auto',
    },
    element: {
        display: 'flex',
    }
};

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#ec7c2f', // Orange
    accent1Color:  '#2daae4', // Blue
  }
})

export default class ChatApp extends Component {
    // At beginning there is no msg and the text-field is empty
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    socket.on('join', this.join)
  }

  join () {
    console.log('join')
    socket.emit('join', 'Hello world from client')
  }

  render () {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div style={styles.container}>
            <Header />
            <Login />
            // List of messages
            <MessageList />
            // Inputfield for user
            <ChatBox />
            // Sidebar with feedback-options
            <FeedbackBox />
          </div>
        </MuiThemeProvider>
    )
  }
}
