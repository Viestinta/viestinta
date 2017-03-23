import React, { Component } from 'react'
import socket from '../socket'

// Theme
import {orange800} from 'material-ui/styles/colors'
import {blue500} from 'material-ui/styles/colors'
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
        height: '100%'
    },
    element: {
        display: 'flex'
    }
};

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: orange800,
    accent1Color:  blue500
  }
})

export default class ChatApp extends Component {
    // At beginning there is no msg and the text-field is empty
  constructor (props) {
    super(props)

    this.login = this.login.bind(this)
  }

  componentDidMount () {
    this.login()
  }

  login () {
    console.log('[ChatApp] login')
    socket.emit('login')
    console.log('[ChatApp] afterLogin')
  }

  render () {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div style={styles.container}>
            <Header />
            <Login />
            {/* List of messages */}
            <MessageList />
            {/* Inputfield for user */}
            <ChatBox />
            {/* Sidebar with feedback-options */}
            <FeedbackBox />
          </div>
        </MuiThemeProvider>
    )
  }
}
