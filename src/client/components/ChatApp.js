import React, { Component } from 'react'
import socket from '../socket'
import axios from 'axios'

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
import RaisedButton from 'material-ui/RaisedButton'


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

  constructor (props) {
    super(props)

    this.state = {
      username: undefined
    }

    this.login = this.login.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)
  }

  componentDidMount() {
    this.getUserInfo()
    socket.on('login', this.login)
  }

  login () {
    console.log('[ChatApp] login')
    socket.emit('login')
    console.log('[ChatApp] afterLogin')
  }

  getUserInfo () {
    console.log("Triggering 'getUserInfo ()'")
    axios
      .get("/user")
      .then(userinfo => {
        console.log("Returning user info: " + JSON.stringify(userinfo.data.user))
        this.setState({
          username: userinfo.data.user.name
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render () {
    const User = (
      <div>
        <p>Logget inn som: {this.state.username}</p>
      </div>
    )
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <Header />
          {/* Login button or username */}
          { !this.state.username ? <Login/> : User }
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
