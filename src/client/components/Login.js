import React, {Component } from 'react'
import socket from '../socket'

export default class Login extends Component {
  
  constructor (props) {
    super(props)

    this.login = this.login.bind(this)
  }

  componentDidMount() {
    socket.on('login', this.login)
  }

  login () {
    socket.emit('login')
  }

  render () {
    return (
      <div id='login'>
        <form action="">
          <button type='btn btn-submit' value='Log In' onClick={this.login}>
            Log In
          </button>
        </form>
      </div>
    )
  }
}
