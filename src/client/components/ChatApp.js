import React, { Component } from 'react'
import socket from '../socket'
import axios from 'axios'

// Theme
import {orange800} from 'material-ui/styles/colors'
import {blue800} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

// Components
import Login from './Login'
import SessionWindow from './SessionWindow'


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
    accent1Color:  blue800
  }
})

export default class ChatApp extends Component {

  /**
   * @summary Saving state and binding functions.
   */
  constructor (props) {
    super(props)

    this.state = {
      user: undefined,
      isAdmin: false
    }

    this.getUserInfo = this.getUserInfo.bind(this)
    this.toggleAdmin = this.toggleAdmin.bind(this)
  }

  /**
   * @summary Get info about user when ChatApp mounts.
   */
  componentDidMount() {
    this.getUserInfo()
  }

  /**
   * @summary Get information about user.
   */
  getUserInfo () {
    axios
      .get("/user")
      .then(userinfo => {
        console.log("[ChatApp] Returning user info: " + JSON.stringify(userinfo.data.user))
        this.setState({
          user: userinfo.data.user
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  /**
   * @summary Set isAdmin state.
   */
  toggleAdmin () {
    this.setState({
      isAdmin: !this.state.isAdmin
    })
  }

  render () {
    const User = (
      <div>
        <p>Logget inn som: {this.state.user ? this.state.user.name : undefined}</p>
      </div>
    )
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          {/* Login screen or Session */}
          { !this.state.user ? <Login/> : <SessionWindow user={this.state.user} isAdmin={this.state.isAdmin} toggleAdmin={this.toggleAdmin}/> }
        </div>
      </MuiThemeProvider>
    )
  }
}
