import React, {Component } from 'react'
import socket from '../socket'
import RaisedButton from 'material-ui/RaisedButton'
import axios from 'axios'

export default class Login extends Component {
  
  constructor (props) {
    super(props)

    this.state = {
      username: undefined
    }

    this.login = this.login.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)

    this.getUserInfo ()
  }

  componentDidMount() {
    socket.on('login', this.login)
  }

  login () {
    console.log("Triggering 'login ()'")
    socket.emit('login')
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

  renderLogin () {
    if (!this.state.username) {
      return (
        <div>
          <RaisedButton
              backgroundColor="#be1527"
              labelColor="#ffffff"
              href="/login"
              label="Logg inn"
              icon={<img src="images/feide_100px_white.png" style={{width: 20, height: 'auto'}}/>}
          />
        </div>
      )
    } else {
      return (
        <div>
          <p id="username">Logget inn som: {this.state.username}</p>
        </div>
      )
    }
  }

  render () {
    if (!this.state.username) {
      return (
        <div>
          <RaisedButton
              backgroundColor="#be1527"
              labelColor="#ffffff"
              href="/login"
              label="Logg inn"
              icon={<img src="images/feide_100px_white.png" style={{width: 20, height: 'auto'}}/>}
          />
        </div>
      )
    } else {
      return (
        <div>
          <p id="username">Logget inn som: {this.state.username}</p>
        </div>
      )
    }
  }
}
